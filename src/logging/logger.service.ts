
import { LoggerService, Injectable, Scope, ConsoleLogger } from '@nestjs/common';

// Specifying a transient scope, to ensure that we'll have a unique instance
// of the MyLogger in each feature module
@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger implements LoggerService {
  constructor(context?: string) {
    super();
    this.setLogLevels(['warn', 'error']);
    this.setContext(context || '');
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    super.log(message);
  }

  /**
   * Write a 'fatal' level log.
   */
  fatal(message: any, ...optionalParams: any[]) {
    super.error(message);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    super.error(message);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    super.warn(message);
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any, ...optionalParams: any[]) {
    super.debug(message);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: any, ...optionalParams: any[]) {
    super.verbose(message);
  }
}
