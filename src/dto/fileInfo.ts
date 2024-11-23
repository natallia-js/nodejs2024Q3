export class FileInfoDto {
  filePath: string;
  fileSizeInKb?: number;
  modifyTime: Date;
  isFile: boolean;
}
