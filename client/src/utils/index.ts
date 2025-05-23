// Utils Barrel Export

// API Utilities
export { 
  apiRequest,
  get,
  post,
  put,
  patch,
  default as api
} from './api';
export type { 
  ApiResponse,
  RequestOptions,
  ApiError
} from './api';

// Debounce Utility
export { debounce } from './debounce';

// Throttle Utility
export { throttle } from './throttle';

// Logger Utility
export { 
  createLogger,
  logger,
  LogLevel
} from './logger';
export type { 
  LoggerConfig
} from './logger';

// Storage Utility
export {
  createStorage,
  localStorage,
  sessionStorage,
  default as storage
} from './storage';
export type {
  StorageOptions,
  StorageType
} from './storage';

// DateTime Utility
export {
  formatDate,
  formatRelativeTime,
  addTime,
  getDateDiff,
  isDateBetween,
  formatShortDate,
  parseDate,
  default as dateTime
} from './dateTime';
export type {
  DateFormatOptions
} from './dateTime';

// Error Parser Utility
export {
  parseError,
  formatErrorMessage,
  ErrorCategory,
  ErrorCodes,
  default as errorParser
} from './errorParser';
export type {
  ParsedError,
  ValidationError
} from './errorParser';

// Validator Utility
export {
  validate,
  validateSafe,
  createFormValidator,
  formatZodError,
  formatZodErrorMap,
  CommonSchemas,
  default as validator
} from './validator';
export type {
  ValidationResult
} from './validator';

// Analytics Utility
export {
  createAnalytics,
  analytics,
  EventCategory,
  default as analyticsUtils
} from './analytics';
export type {
  AnalyticsEvent,
  PageViewData,
  UserProperties
} from './analytics';