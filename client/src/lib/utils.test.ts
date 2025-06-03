import { describe, it, expect } from 'vitest';
import {
  cn,
  formatNumber,
  formatCurrency,
  formatTimeAgo,
  formatDate,
  formatTime,
  truncateText,
  generateId,
  debounce,
  capitalizeFirstLetter,
  isEmptyObject,
  removeDuplicates
} from './utils';

describe('Utility Functions', () => {
  describe('cn function', () => {
    it('should merge class names properly', () => {
      expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
      expect(cn('text-sm', { 'text-red': true, 'text-blue': false })).toBe('text-sm text-red');
      expect(cn('p-4', undefined, null, 'm-2')).toBe('p-4 m-2');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const isDisabled = false;
      
      expect(cn(
        'btn',
        isActive && 'btn-active',
        isDisabled && 'btn-disabled'
      )).toBe('btn btn-active');
    });

    it('should handle array inputs', () => {
      expect(cn(['flex', 'items-center'], 'justify-between')).toBe('flex items-center justify-between');
    });
  });

  describe('formatNumber function', () => {
    it('should format numbers with commas for thousands', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(1234567.89)).toBe('1,234,567.89');
    });

    it('should handle small numbers', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(99)).toBe('99');
      expect(formatNumber(999)).toBe('999');
    });

    it('should handle negative numbers', () => {
      expect(formatNumber(-1000)).toBe('-1,000');
      expect(formatNumber(-1234567.89)).toBe('-1,234,567.89');
    });
  });

  describe('formatCurrency function', () => {
    it('should format currency in USD by default', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0.99)).toBe('$0.99');
    });

    it('should format currency in specified currency', () => {
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
      expect(formatCurrency(1000, 'GBP')).toBe('£1,000.00');
      expect(formatCurrency(1000, 'JPY')).toBe('¥1,000');
    });

    it('should handle negative amounts', () => {
      expect(formatCurrency(-1000)).toBe('-$1,000.00');
      expect(formatCurrency(-99.99, 'EUR')).toBe('-€99.99');
    });
  });

  describe('formatTimeAgo function', () => {
    it('should format time in seconds ago', () => {
      const now = new Date();
      const tenSecondsAgo = new Date(now.getTime() - 10 * 1000);
      
      expect(formatTimeAgo(tenSecondsAgo)).toBe('10 seconds ago');
    });

    it('should format time in minutes ago', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      expect(formatTimeAgo(fiveMinutesAgo)).toBe('5 minutes ago');
    });

    it('should format time in hours ago', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      
      expect(formatTimeAgo(twoHoursAgo)).toBe('2 hours ago');
    });

    it('should format time in days ago', () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      
      expect(formatTimeAgo(threeDaysAgo)).toBe('3 days ago');
    });

    it('should format time in weeks ago', () => {
      const now = new Date();
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      
      expect(formatTimeAgo(twoWeeksAgo)).toBe('2 weeks ago');
    });

    it('should format time in months ago', () => {
      const now = new Date();
      const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      
      expect(formatTimeAgo(sixMonthsAgo)).toBe('6 months ago');
    });

    it('should format time in years ago', () => {
      const now = new Date();
      const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
      
      expect(formatTimeAgo(twoYearsAgo)).toBe('2 years ago');
    });
  });

  describe('additional utility functions', () => {
    it('formats a date string', () => {
      expect(formatDate('2023-01-01T00:00:00Z')).toBe('January 1, 2023');
    });

    it('formats time', () => {
      const timestamp = Date.parse('2023-01-01T12:00:00Z');
      expect(formatTime(timestamp)).toMatch(/12:00/);
    });

    it('truncates text', () => {
      expect(truncateText('Hello world', 5)).toBe('Hello...');
    });

    it('generates id of length 7', () => {
      expect(generateId()).toMatch(/^[a-z0-9]{7}$/);
    });

    it('debounces function calls', () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced();
      debounced();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });

    it('capitalizes first letter', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
    });

    it('checks empty object', () => {
      expect(isEmptyObject({})).toBe(true);
      expect(isEmptyObject({ a: 1 })).toBe(false);
    });

    it('removes duplicates', () => {
      expect(removeDuplicates([1, 1, 2, 3])).toEqual([1, 2, 3]);
    });
  });
});
