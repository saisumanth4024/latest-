import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatRelativeTime,
  addTime,
  getDateDiff,
  isDateBetween,
  formatShortDate,
  parseDate,
} from './dateTime';

describe('dateTime utilities', () => {
  it('formats dates correctly', () => {
    const date = new Date('2023-01-01T00:00:00Z');
    expect(formatDate(date, { locale: 'en-US' })).toBe('January 1, 2023');
  });

  it('returns "Invalid date" for bad input', () => {
    expect(formatDate('not-a-date' as any)).toBe('Invalid date');
  });

  it('formats relative time in the past', () => {
    const past = Date.now() - 3 * 60 * 1000; // 3 minutes ago
    expect(formatRelativeTime(past)).toBe('3 minutes ago');
  });

  it('formats relative time in the future', () => {
    const future = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    expect(formatRelativeTime(future)).toBe('in 5 minutes');
  });

  it('adds time to a date', () => {
    const base = new Date('2023-01-01T00:00:00Z');
    const result = addTime(base, 2, 'days');
    expect(result.getDate()).toBe(3);
  });

  it('computes date differences', () => {
    const start = new Date('2023-01-01T00:00:00Z');
    const end = new Date('2023-01-03T00:00:00Z');
    expect(getDateDiff(start, end, 'days')).toBe(2);
  });

  it('checks dates between range', () => {
    const date = new Date('2023-01-15');
    expect(
      isDateBetween(date, new Date('2023-01-10'), new Date('2023-01-20'))
    ).toBe(true);
  });

  it('formats short date', () => {
    const date = new Date('2023-01-05T00:00:00Z');
    expect(formatShortDate(date)).toBe('01/05/2023');
  });

  it('parses common date formats', () => {
    const d1 = parseDate('01/05/2023');
    const d2 = parseDate('2023-01-05', 'YYYY-MM-DD');
    expect(d1?.getFullYear()).toBe(2023);
    expect(d2?.getDate()).toBe(5);
  });
});
