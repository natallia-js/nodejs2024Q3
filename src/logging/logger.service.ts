import { Injectable, ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { getDesiredLogLevelNames } from './logger.levels';
import { LogFilesProcessor } from './log-files.processor';
import { Semaphore } from 'async-mutex';

const maxConcurrentRequests = 1;
@Injectable()
export class CustomLogger extends ConsoleLogger {
  private logFilesProcessor: LogFilesProcessor;
  private semaphore = new Semaphore(maxConcurrentRequests);

  constructor(private configService: ConfigService) {
    super();
    const desiredLogLevelNames = getDesiredLogLevelNames(
      this.configService.get('LOG_LEVEL'),
    );
    this.setLogLevels(desiredLogLevelNames);
    this.logFilesProcessor = new LogFilesProcessor({
      baseDirectory: path.resolve(process.cwd(), 'logs'),
      maxLogFileSizeInKb: Number(
        this.configService.get('MAX_LOG_FILE_SIZE_IN_KB'),
      ),
      maxLogFilesCount: Number(this.configService.get('MAX_LOG_FILES_COUNT')),
    });
  }

  private getFormattedFileLogMessage(message: any, timestamp: string): string {
    return `${timestamp} - ${message}\r\n`;
  }

  private async writeMessageInFile(logLevel: string, message: any) {
    return await this.semaphore.runExclusive(async () => {
      try {
        const formattedMessage: string = this.getFormattedFileLogMessage(
          message,
          this.getTimestamp(),
        );
        await this.logFilesProcessor.writeMessageInLogFile(
          logLevel,
          formattedMessage,
        );
      } catch (error) {
        super.error(message);
      }
    });
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any/*, ...optionalParams: any[]*/) {
    // writing to console
    super.log(message);
    // writing to log file
    this.writeMessageInFile('log', message);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any/*, ...optionalParams: any[]*/) {
    // writing to console
    super.error(message);
    // writing to log file
    this.writeMessageInFile('error', message);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any/*, ...optionalParams: any[]*/) {
    // writing to console
    super.warn(message);
    // writing to log file
    this.writeMessageInFile('warn', message);
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any/*, ...optionalParams: any[]*/) {
    // writing to console
    super.debug(message);
    // writing to log file
    this.writeMessageInFile('debug', message);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: any/*, ...optionalParams: any[]*/) {
    // writing to console
    super.verbose(message);
    // writing to log file
    this.writeMessageInFile('verbose', message);
  }
}
