const fs = require('node:fs');

export class LogFilesProcessor {
  private isFile(fileName: string): boolean {
    return fs.lstatSync(fileName).isFile();
  };
}
