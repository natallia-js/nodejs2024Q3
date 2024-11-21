
import { LoggerService, Injectable, Scope, ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getDesiredLogLevelNames } from './logger.levels';
import { FileInfoDto } from '../dto/fileInfo';

// Specifying a default scope, to ensure that the provider can be shared across multiple classes.
// The provider lifetime is strictly tied to the application lifecycle.
// Once the application has bootstrapped, all providers have been instantiated.
@Injectable({ scope: Scope.DEFAULT })
export class CustomLogger extends ConsoleLogger implements LoggerService {

  private readonly maxLogFileSizeInKb = Number(this.configService.get('MAX_LOG_FILE_SIZE_IN_KB'));
  private readonly maxLogFilesCount = Number(this.configService.get('MAX_LOG_FILES_COUNT'));
  private readonly currentDirectory = process.cwd();

  constructor(private configService: ConfigService) {
    super();
    this.setLogLevels(getDesiredLogLevelNames(this.configService.get('LOG_LEVEL')));
  }

  fs.readdirSync(folderPath)
    .map(fileName => {
      return path.join(folderPath, fileName);
    })
    .filter(isFile);

  private getNextLogFileName(logLevel: string): string {
    return '';
  }

  // Creates a log file in a "log/{logLevel}" folder of the application, returns full file path
  private createLogFile(logLevel: string): string {
    //
  }

  private getCurrentLogFileInfo(logLevel: string): FileInfoDto | null {
    //
  }

  private getLogFilesFolderContent(logLevel: string): string[] {
    //
  }

  private writeDataToFile(filePath: string, data: any) {
    //
  }

  private writeMessageInLogFile(logLevel: string, message: any) {
    const currentLogFileInfo: FileInfoDto | null = this.getCurrentLogFileInfo(logLevel);
    if (!currentLogFileInfo) {
      // write to new file
      this.createLogFile()
      return;
    }
    if (currentLogFileInfo.fileSize < this.maxLogFileSizeInKb) {
      // write to current file
    } else {
      // necessary to create new file
      const allLogFiles = this.getLogFilesFolderContent(logLevel);
      if (allLogFiles.length >= this.maxLogFilesCount) {
        // delete the earliest log file
      }
      // create new log file, write to it
    }
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    // writing to console
    super.log(message);
    // writing to log file
    this.writeMessageInLogFile('log', message);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    // writing to console
    super.error(message);
    // writing to log file
    this.writeMessageInLogFile('error', message);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    // writing to console
    super.warn(message);
    // writing to log file
    this.writeMessageInLogFile('warn', message);
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any, ...optionalParams: any[]) {
    // writing to console
    super.debug(message);
    // writing to log file
    this.writeMessageInLogFile('debug', message);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: any, ...optionalParams: any[]) {
    // writing to console
    super.verbose(message);
    // writing to log file
    this.writeMessageInLogFile('verbose', message);
  }
}
