/**
 * Format options for date/time formatting
 */
export interface DateFormatOptions {
  /** Whether to include the time in the formatted output */
  includeTime?: boolean;
  /** Whether to use 12-hour format for the time */
  use12Hour?: boolean;
  /** Whether to include seconds in the time */
  includeSeconds?: boolean;
  /** Custom locale for formatting (defaults to browser locale) */
  locale?: string;
  /** Whether to show relative time (e.g., "3 days ago") */
  relative?: boolean;
}

/**
 * Default date format options
 */
const defaultOptions: DateFormatOptions = {
  includeTime: false,
  use12Hour: false,
  includeSeconds: false,
  locale: undefined,
  relative: false,
};

/**
 * Get the browser's locale or use provided locale
 */
function getLocale(locale?: string): string {
  if (locale) return locale;
  return typeof navigator !== 'undefined' ? navigator.language : 'en-US';
}

/**
 * Format a date according to the provided options
 * 
 * @param date - The date to format
 * @param options - Formatting options
 * @returns Formatted date string
 * 
 * @example
 * ```typescript
 * // Format a date
 * const formatted = formatDate(new Date(), { includeTime: true });
 * console.log(formatted); // e.g., "May 15, 2023, 10:30 AM"
 * ```
 */
export function formatDate(date: Date | string | number, options: DateFormatOptions = {}): string {
  const opts = { ...defaultOptions, ...options };
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date provided to formatDate:', date);
    return 'Invalid date';
  }
  
  if (opts.relative) {
    return formatRelativeTime(dateObj);
  }
  
  const locale = getLocale(opts.locale);
  
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  if (opts.includeTime) {
    dateFormatOptions.hour = opts.use12Hour ? 'numeric' : '2-digit';
    dateFormatOptions.minute = '2-digit';
    dateFormatOptions.second = opts.includeSeconds ? '2-digit' : undefined;
    dateFormatOptions.hour12 = opts.use12Hour;
  }
  
  try {
    return new Intl.DateTimeFormat(locale, dateFormatOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    // Fallback to ISO string
    return dateObj.toISOString().split('T')[0];
  }
}

/**
 * Format a date as a relative time (e.g., "3 days ago", "just now")
 * 
 * @param date - The date to format
 * @returns Formatted relative time string
 * 
 * @example
 * ```typescript
 * // Format a date as relative time
 * const relative = formatRelativeTime(new Date(Date.now() - 3600000));
 * console.log(relative); // "1 hour ago"
 * ```
 */
export function formatRelativeTime(date: Date | string | number): string {
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date provided to formatRelativeTime:', date);
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  // Future date
  if (diffInSeconds < 0) {
    const absDiff = Math.abs(diffInSeconds);
    
    if (absDiff < 60) return 'in a few seconds';
    if (absDiff < 3600) return `in ${Math.floor(absDiff / 60)} minutes`;
    if (absDiff < 86400) return `in ${Math.floor(absDiff / 3600)} hours`;
    if (absDiff < 604800) return `in ${Math.floor(absDiff / 86400)} days`;
    if (absDiff < 2592000) return `in ${Math.floor(absDiff / 604800)} weeks`;
    if (absDiff < 31536000) return `in ${Math.floor(absDiff / 2592000)} months`;
    return `in ${Math.floor(absDiff / 31536000)} years`;
  }
  
  // Past date
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

/**
 * Add a specified amount of time to a date
 * 
 * @param date - The base date
 * @param amount - The amount to add
 * @param unit - The unit of time
 * @returns A new date with the added time
 * 
 * @example
 * ```typescript
 * // Add 3 days to the current date
 * const futureDate = addTime(new Date(), 3, 'days');
 * ```
 */
export function addTime(
  date: Date | string | number,
  amount: number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'
): Date {
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date provided to addTime:', date);
    return new Date();
  }
  
  const result = new Date(dateObj);
  
  switch (unit) {
    case 'seconds':
      result.setSeconds(result.getSeconds() + amount);
      break;
    case 'minutes':
      result.setMinutes(result.getMinutes() + amount);
      break;
    case 'hours':
      result.setHours(result.getHours() + amount);
      break;
    case 'days':
      result.setDate(result.getDate() + amount);
      break;
    case 'weeks':
      result.setDate(result.getDate() + amount * 7);
      break;
    case 'months':
      result.setMonth(result.getMonth() + amount);
      break;
    case 'years':
      result.setFullYear(result.getFullYear() + amount);
      break;
    default:
      console.error('Invalid unit provided to addTime:', unit);
  }
  
  return result;
}

/**
 * Get the difference between two dates in the specified unit
 * 
 * @param date1 - The first date
 * @param date2 - The second date
 * @param unit - The unit of time to return the difference in
 * @returns The difference between the dates in the specified unit
 * 
 * @example
 * ```typescript
 * // Get the difference in days
 * const daysDiff = getDateDiff(
 *   new Date('2023-01-01'),
 *   new Date('2023-01-15'),
 *   'days'
 * );
 * console.log(daysDiff); // 14
 * ```
 */
export function getDateDiff(
  date1: Date | string | number,
  date2: Date | string | number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'
): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    console.error('Invalid date(s) provided to getDateDiff:', { date1, date2 });
    return 0;
  }
  
  const diffMs = d2.getTime() - d1.getTime();
  
  switch (unit) {
    case 'seconds':
      return Math.floor(diffMs / 1000);
    case 'minutes':
      return Math.floor(diffMs / (1000 * 60));
    case 'hours':
      return Math.floor(diffMs / (1000 * 60 * 60));
    case 'days':
      return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    case 'weeks':
      return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
    case 'months': {
      // This is an approximation and may not be exact for all date pairs
      const yearDiff = d2.getFullYear() - d1.getFullYear();
      const monthDiff = d2.getMonth() - d1.getMonth();
      return yearDiff * 12 + monthDiff;
    }
    case 'years':
      // Simple implementation - doesn't account for leap years, etc.
      return d2.getFullYear() - d1.getFullYear();
    default:
      console.error('Invalid unit provided to getDateDiff:', unit);
      return 0;
  }
}

/**
 * Check if a date is between two other dates
 * 
 * @param date - The date to check
 * @param startDate - The start of the range
 * @param endDate - The end of the range
 * @param inclusive - Whether to include the start and end dates in the range
 * @returns Whether the date is within the range
 */
export function isDateBetween(
  date: Date | string | number,
  startDate: Date | string | number,
  endDate: Date | string | number,
  inclusive = true
): boolean {
  const d = new Date(date).getTime();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  
  if (isNaN(d) || isNaN(start) || isNaN(end)) {
    console.error('Invalid date(s) provided to isDateBetween:', { date, startDate, endDate });
    return false;
  }
  
  if (inclusive) {
    return d >= start && d <= end;
  }
  
  return d > start && d < end;
}

/**
 * Format a date into a short, standardized format
 * 
 * @param date - The date to format
 * @param separator - The separator to use between date parts
 * @returns The formatted date string
 */
export function formatShortDate(
  date: Date | string | number,
  separator = '/'
): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    console.error('Invalid date provided to formatShortDate:', date);
    return 'Invalid date';
  }
  
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${month}${separator}${day}${separator}${year}`;
}

/**
 * Parse a date string into a Date object
 * 
 * @param dateString - The date string to parse
 * @param format - The format of the date string (limited support)
 * @returns A Date object, or null if parsing fails
 */
export function parseDate(
  dateString: string,
  format = 'MM/DD/YYYY'
): Date | null {
  try {
    if (!dateString) return null;
    
    // Try standard parsing first
    const standardDate = new Date(dateString);
    if (!isNaN(standardDate.getTime())) {
      return standardDate;
    }
    
    // Simple format parser for common formats
    if (format === 'MM/DD/YYYY') {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const month = parseInt(parts[0], 10) - 1;
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        
        if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
          return new Date(year, month, day);
        }
      }
    } else if (format === 'YYYY-MM-DD') {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
          return new Date(year, month, day);
        }
      }
    }
    
    // Fallback to more robust parsing with date-fns or similar would go here
    
    console.error('Failed to parse date string:', dateString);
    return null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
}

export default {
  formatDate,
  formatRelativeTime,
  addTime,
  getDateDiff,
  isDateBetween,
  formatShortDate,
  parseDate,
};