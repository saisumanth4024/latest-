import { ApiError } from './api';
import logger from './logger';

/**
 * Interface for standardized error format
 */
export interface ParsedError {
  /** Unique error code or identifier */
  code: string;
  /** User-friendly error message */
  message: string;
  /** Technical details (for logging, not user display) */
  details?: Record<string, any>;
  /** HTTP status code if applicable */
  status?: number;
  /** Original error object */
  originalError?: any;
}

/**
 * Error code categories
 */
export enum ErrorCategory {
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Common error codes with standardized messages
 */
export const ErrorCodes = {
  // Authentication errors
  [ErrorCategory.AUTH]: {
    UNAUTHORIZED: 'User is not authorized',
    FORBIDDEN: 'Access denied',
    SESSION_EXPIRED: 'Your session has expired',
    INVALID_CREDENTIALS: 'Invalid username or password',
  },
  
  // Validation errors
  [ErrorCategory.VALIDATION]: {
    REQUIRED_FIELD: 'Required field is missing',
    INVALID_FORMAT: 'Invalid format',
    ALREADY_EXISTS: 'Item already exists',
    NOT_FOUND: 'Item not found',
  },
  
  // Network errors
  [ErrorCategory.NETWORK]: {
    OFFLINE: 'You are offline',
    TIMEOUT: 'Request timed out',
    CORS: 'Cross-origin request blocked',
    ABORTED: 'Request was aborted',
  },
  
  // Server errors
  [ErrorCategory.SERVER]: {
    INTERNAL: 'Server error',
    SERVICE_UNAVAILABLE: 'Service unavailable',
    DATABASE: 'Database error',
    RATE_LIMITED: 'Too many requests',
  },
  
  // Client errors
  [ErrorCategory.CLIENT]: {
    UNSUPPORTED_BROWSER: 'Browser not supported',
    JAVASCRIPT_ERROR: 'Application error',
    STORAGE_FULL: 'Local storage is full',
    UNHANDLED_EXCEPTION: 'Unexpected error',
  },
  
  // Fallback
  [ErrorCategory.UNKNOWN]: {
    DEFAULT: 'An error occurred',
  },
};

/**
 * Maps HTTP status codes to error categories and codes
 */
const HTTP_STATUS_MAP: Record<number, { category: ErrorCategory; code: string }> = {
  400: { category: ErrorCategory.VALIDATION, code: 'INVALID_REQUEST' },
  401: { category: ErrorCategory.AUTH, code: 'UNAUTHORIZED' },
  403: { category: ErrorCategory.AUTH, code: 'FORBIDDEN' },
  404: { category: ErrorCategory.VALIDATION, code: 'NOT_FOUND' },
  409: { category: ErrorCategory.VALIDATION, code: 'CONFLICT' },
  422: { category: ErrorCategory.VALIDATION, code: 'VALIDATION_ERROR' },
  429: { category: ErrorCategory.SERVER, code: 'RATE_LIMITED' },
  500: { category: ErrorCategory.SERVER, code: 'INTERNAL' },
  502: { category: ErrorCategory.SERVER, code: 'BAD_GATEWAY' },
  503: { category: ErrorCategory.SERVER, code: 'SERVICE_UNAVAILABLE' },
  504: { category: ErrorCategory.NETWORK, code: 'TIMEOUT' },
};

/**
 * Parse an error of any type into a standardized format
 * 
 * @param error - The error to parse
 * @param options - Additional options for parsing
 * @returns A standardized error object
 * 
 * @example
 * ```typescript
 * try {
 *   // Code that might throw an error
 * } catch (error) {
 *   const parsedError = parseError(error);
 *   console.log(parsedError.code, parsedError.message);
 *   
 *   // Show appropriate UI feedback
 *   if (parsedError.code === 'AUTH_UNAUTHORIZED') {
 *     // Redirect to login
 *   } else {
 *     // Show generic error message
 *   }
 * }
 * ```
 */
export function parseError(
  error: any,
  options: {
    defaultMessage?: string;
    prefixCode?: string;
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
  } = {}
): ParsedError {
  const {
    defaultMessage = ErrorCodes[ErrorCategory.UNKNOWN].DEFAULT,
    prefixCode = '',
    logLevel = 'error',
  } = options;
  
  // Log the error based on the specified level
  switch (logLevel) {
    case 'debug':
      logger.debug('Error caught', { error });
      break;
    case 'info':
      logger.info('Error caught', { error });
      break;
    case 'warn':
      logger.warn('Error caught', { error });
      break;
    case 'error':
    default:
      logger.error('Error caught', error);
  }
  
  try {
    // Handle ApiError from our API utility
    if (error instanceof ApiError) {
      const { status, statusText, data, message } = error;
      const statusMapping = HTTP_STATUS_MAP[status];
      
      const category = statusMapping?.category || ErrorCategory.SERVER;
      const code = statusMapping?.code || 'UNKNOWN_API_ERROR';
      
      return {
        code: `${prefixCode}${category}_${code}`,
        message: data?.message || message || statusText || defaultMessage,
        details: data,
        status,
        originalError: error,
      };
    }
    
    // Handle Fetch API errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return {
        code: `${prefixCode}${ErrorCategory.NETWORK}_OFFLINE`,
        message: ErrorCodes[ErrorCategory.NETWORK].OFFLINE,
        details: { type: 'fetch', message: error.message },
        originalError: error,
      };
    }
    
    // Handle DOMException for aborted requests
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        code: `${prefixCode}${ErrorCategory.NETWORK}_ABORTED`,
        message: ErrorCodes[ErrorCategory.NETWORK].ABORTED,
        details: { type: 'aborted', message: error.message },
        originalError: error,
      };
    }
    
    // Handle standard JS Error objects
    if (error instanceof Error) {
      const { name, message, stack } = error;
      const errorType = name || 'Error';
      
      // Default to CLIENT category for JS errors
      const category = ErrorCategory.CLIENT;
      const code = 'JAVASCRIPT_ERROR';
      
      return {
        code: `${prefixCode}${category}_${code}`,
        message: message || defaultMessage,
        details: { 
          type: errorType,
          stack: stack,
          // Include any custom properties on the error
          ...Object.getOwnPropertyNames(error)
            .filter(prop => prop !== 'name' && prop !== 'message' && prop !== 'stack')
            .reduce((obj, prop) => {
              obj[prop] = (error as any)[prop];
              return obj;
            }, {} as Record<string, any>)
        },
        originalError: error,
      };
    }
    
    // Handle string errors
    if (typeof error === 'string') {
      return {
        code: `${prefixCode}${ErrorCategory.UNKNOWN}_STRING_ERROR`,
        message: error || defaultMessage,
        details: { rawMessage: error },
        originalError: new Error(error),
      };
    }
    
    // Handle object errors (e.g., from APIs that return error objects)
    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, any>;
      const message = errorObj.message || errorObj.error || errorObj.errorMessage || defaultMessage;
      const status = errorObj.status || errorObj.statusCode;
      
      let category = ErrorCategory.UNKNOWN;
      let code = 'OBJECT_ERROR';
      
      // Try to categorize based on status if available
      if (status && HTTP_STATUS_MAP[status]) {
        category = HTTP_STATUS_MAP[status].category;
        code = HTTP_STATUS_MAP[status].code;
      }
      
      return {
        code: `${prefixCode}${category}_${code}`,
        message,
        details: { ...errorObj },
        status: typeof status === 'number' ? status : undefined,
        originalError: error,
      };
    }
  } catch (parsingError) {
    // If error parsing itself fails, return a fallback error
    logger.error('Error parser failed', parsingError, { originalError: error });
    
    return {
      code: `${prefixCode}${ErrorCategory.UNKNOWN}_PARSER_ERROR`,
      message: defaultMessage,
      details: { 
        parsingError,
        originalError: error,
      },
      originalError: error,
    };
  }
  
  // Default fallback for unhandled error types
  return {
    code: `${prefixCode}${ErrorCategory.UNKNOWN}_DEFAULT`,
    message: defaultMessage,
    details: { rawError: error },
    originalError: error,
  };
}

/**
 * Format error messages for display to users
 * 
 * @param error - The error to format
 * @param options - Formatting options
 * @returns A user-friendly error message
 */
export function formatErrorMessage(
  error: any,
  options: {
    defaultMessage?: string;
    includeCode?: boolean;
    truncateLength?: number;
  } = {}
): string {
  const {
    defaultMessage = 'An unexpected error occurred',
    includeCode = false,
    truncateLength = 150,
  } = options;
  
  try {
    const parsed = parseError(error, { defaultMessage });
    let message = parsed.message || defaultMessage;
    
    // Add error code if requested
    if (includeCode) {
      message = `[${parsed.code}] ${message}`;
    }
    
    // Truncate if necessary
    if (truncateLength > 0 && message.length > truncateLength) {
      message = `${message.substring(0, truncateLength)}...`;
    }
    
    return message;
  } catch {
    return defaultMessage;
  }
}

export default {
  parseError,
  formatErrorMessage,
  ErrorCategory,
  ErrorCodes,
};