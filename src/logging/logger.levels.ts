import { LogLevel } from '@nestjs/common';

/*
Assuming that:
  verbose - the lowest log level, enable detailed trace logging mainly for application troubleshooting
  debug - used for application debugging purposes and to inspect run-time outcomes in development environments
  log - used for application monitoring and to track request and response details or specific operation results
  warn - used to review potential non-critical, non-friendly operation outcomes
  error - the most helpful, and yet the most unwanted, log level;
          enables detailed error tracking and helps to write error-free applications
*/

export function getDesiredLogLevelNames(desiredLogLevel?: string): LogLevel[] {
  switch (desiredLogLevel) {
    case 'verbose':
      return ['verbose', 'debug', 'log', 'warn', 'error'];
    case 'debug':
      return ['debug', 'log', 'warn', 'error'];
    case 'log':
      return ['log', 'warn', 'error'];
    case 'warn':
      return ['warn', 'error'];
    case 'error':
      return ['error'];
    default:
      return ['log', 'warn', 'error'];
  }
}
