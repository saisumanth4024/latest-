/**
 * Log levels for the application logger
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Configuration for the logger
 */
export interface LoggerConfig {
  level: LogLevel;
  enabled: boolean;
  enableConsole: boolean;
  prefix?: string;
  enableTimestamp: boolean;
}

/**
 * Default configuration for the logger
 */
const defaultConfig: LoggerConfig = {
  level: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
  enabled: true,
  enableConsole: true,
  prefix: 'App',
  enableTimestamp: true,
};

/**
 * A utility for structured logging with configurable levels and formatting
 * 
 * @example
 * ```typescript
 * // Create a logger for a specific module
 * const logger = createLogger({ prefix: 'AuthService' });
 * 
 * // Log at different levels
 * logger.debug('Initializing authentication service');
 * logger.info('User logged in', { userId: 123 });
 * logger.warn('Session about to expire', { userId: 123, expiresIn: '5m' });
 * logger.error('Failed to authenticate user', { userId: 123, error: { code: 'INVALID_CREDENTIALS' } });
 * ```
 */
export class Logger {
  private config: LoggerConfig;
  
  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }
  
  /**
   * Formats a log message with timestamp and prefix
   */
  private format(level: LogLevel, message: string, data?: Record<string, any>): string {
    const parts: string[] = [];
    
    if (this.config.enableTimestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }
    
    if (this.config.prefix) {
      parts.push(`[${this.config.prefix}]`);
    }
    
    parts.push(`[${level.toUpperCase()}]`);
    parts.push(message);
    
    if (data) {
      try {
        parts.push(JSON.stringify(data));
      } catch (e) {
        parts.push('[Circular or non-serializable data]');
      }
    }
    
    return parts.join(' ');
  }
  
  /**
   * Check if logging at the given level is enabled
   */
  private isLevelEnabled(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const configLevelIndex = levels.indexOf(this.config.level);
    const targetLevelIndex = levels.indexOf(level);
    
    return targetLevelIndex >= configLevelIndex;
  }
  
  /**
   * Logs a debug message
   */
  debug(message: string, data?: Record<string, any>): void {
    if (!this.isLevelEnabled(LogLevel.DEBUG)) return;
    
    const formattedMessage = this.format(LogLevel.DEBUG, message, data);
    
    if (this.config.enableConsole) {
      console.debug(formattedMessage);
    }
  }
  
  /**
   * Logs an info message
   */
  info(message: string, data?: Record<string, any>): void {
    if (!this.isLevelEnabled(LogLevel.INFO)) return;
    
    const formattedMessage = this.format(LogLevel.INFO, message, data);
    
    if (this.config.enableConsole) {
      console.info(formattedMessage);
    }
  }
  
  /**
   * Logs a warning message
   */
  warn(message: string, data?: Record<string, any>): void {
    if (!this.isLevelEnabled(LogLevel.WARN)) return;
    
    const formattedMessage = this.format(LogLevel.WARN, message, data);
    
    if (this.config.enableConsole) {
      console.warn(formattedMessage);
    }
  }
  
  /**
   * Logs an error message
   */
  error(message: string, error?: any, data?: Record<string, any>): void {
    if (!this.isLevelEnabled(LogLevel.ERROR)) return;
    
    const errorData = error ? { ...data, error: this.formatError(error) } : data;
    const formattedMessage = this.format(LogLevel.ERROR, message, errorData);
    
    if (this.config.enableConsole) {
      console.error(formattedMessage);
      
      // Log the original error stack for debugging
      if (error && error.stack) {
        console.error(error.stack);
      }
    }
  }
  
  /**
   * Formats an error object for logging
   */
  private formatError(error: any): Record<string, any> {
    if (!error) return { message: 'Unknown error' };
    
    if (error instanceof Error) {
      return {
        message: error.message,
        name: error.name,
        // Don't include the stack trace in the formatted message
        // as it's logged separately
      };
    }
    
    if (typeof error === 'string') {
      return { message: error };
    }
    
    return error;
  }
  
  /**
   * Changes the logger configuration
   */
  setConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Creates a child logger with inherited config and additional prefix
   */
  child(prefix: string): Logger {
    return new Logger({
      ...this.config,
      prefix: this.config.prefix ? `${this.config.prefix}:${prefix}` : prefix,
    });
  }
}

/**
 * Creates a new logger instance with the provided configuration
 */
export function createLogger(config: Partial<LoggerConfig> = {}): Logger {
  return new Logger(config);
}

/**
 * The default application logger
 */
export const logger = createLogger();

export default logger;