import { resolve } from 'node:path';
import { lstat, mkdir, unlink, readdir, stat, writeFile } from 'node:fs/promises';
import { FileInfoDto } from '../dto/fileInfo';

export class LogFilesProcessor {
  private baseDirectory: string;
  private maxLogFileSizeInKb: number;
  private maxLogFilesCount: number;

  constructor({ baseDirectory, maxLogFileSizeInKb, maxLogFilesCount }:
    {
      baseDirectory: string,
      maxLogFileSizeInKb: number,
      maxLogFilesCount: number,
    }) {
    this.baseDirectory = baseDirectory;
    this.maxLogFileSizeInKb = maxLogFileSizeInKb;
    this.maxLogFilesCount = maxLogFilesCount;
  }

  private async isFile(pathToFile: string): Promise<boolean> {
    const stats = await stat(pathToFile);
    return stats.isFile();
  }

  private async getFileSize(pathToFile: string): Promise<number> {
    const stats = await stat(pathToFile);
    return stats.size;
  }

  private async directoryExists(pathToDirectory: string): Promise<boolean> {
    try {
      await stat(pathToDirectory);
      return true;
    } catch {
      return false;
    }
  }

  private getLogDirectoryFullPath(logLevel: string): string {
    return resolve(this.baseDirectory, logLevel);
  }

  private getNewFileFullPath(logLevel: string): string {
    const now = new Date();
    const fileName = `${logLevel}${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}.log`;
    return resolve(this.getLogDirectoryFullPath(logLevel), fileName);
  }

  private async getDirectoryFilesInfo(directoryPath: string): Promise<FileInfoDto[]> {
    const directoryEntities = await Promise.all(
      (await readdir(directoryPath))
        .map(async (element) => {
          const entityPath = resolve(directoryPath, element);
          return {
            filePath: entityPath,
            isFile: await this.isFile(entityPath),
            modifyTime: (await lstat(entityPath)).mtime,
          };
        })
      );
    return (directoryEntities || []).filter(el => el.isFile);
  }

  private async getCurrentLogFileInfo(directoryFiles: FileInfoDto[]): Promise<FileInfoDto | null> {
    // looking for the newest file in directory and returning info about it
    const latestFile = !directoryFiles?.length
      ? null
      : directoryFiles.sort((a, b) => b.modifyTime.getTime() - a.modifyTime.getTime())[0];
    return !latestFile
      ? null
      : {
        ...latestFile,
        fileSizeInKb: (await this.getFileSize(latestFile.filePath)) / 1000,
      };
  }

  private getEarliestFiles(directoryFiles: FileInfoDto[], allowedFilesNumber: number): FileInfoDto[] {
    const sortedFiles = !directoryFiles?.length
      ? []
      : directoryFiles.sort((a, b) => a.modifyTime.getTime() - b.modifyTime.getTime());
    const realFilesNumber = sortedFiles.length;
    const notAllowedFilesNumber =
      allowedFilesNumber >= realFilesNumber
        ? 0
        : realFilesNumber - allowedFilesNumber;
    return sortedFiles.slice(0, notAllowedFilesNumber);
  }

  async writeMessageInLogFile(logLevel: string, message: string) {
    const directoryPath = this.getLogDirectoryFullPath(logLevel);

    const directoryExists = await this.directoryExists(directoryPath);
    if (!directoryExists)
      await mkdir(directoryPath, { recursive: true });

    const directoryFiles = await this.getDirectoryFilesInfo(directoryPath);
    const currentLogFileInfo = await this.getCurrentLogFileInfo(directoryFiles);
    let filePath = '';
    let fileSizeInKb = 0;
    if (!currentLogFileInfo)
      filePath = this.getNewFileFullPath(logLevel);
    else {
      filePath = currentLogFileInfo.filePath;
      fileSizeInKb = currentLogFileInfo.fileSizeInKb || 0;
    }

    if (fileSizeInKb >= this.maxLogFileSizeInKb) {
      if (directoryFiles.length >= this.maxLogFilesCount) {
        const earliestFiles = this.getEarliestFiles(directoryFiles, this.maxLogFilesCount);
        if (earliestFiles.length)
          for (let file of earliestFiles) {
            try { await unlink(file.filePath); } catch { }
          }
      }
      filePath = this.getNewFileFullPath(logLevel);
    }

    await writeFile(filePath, message, { flag: 'a' });
  }
}
