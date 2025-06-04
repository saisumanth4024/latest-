import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial value', 500));
    expect(result.current).toBe('initial value');
  });

  it('should not update the value before the delay has passed', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 500 } }
    );

    // Change the input value
    rerender({ value: 'new value', delay: 500 });

    // Value should still be the initial value before the delay
    expect(result.current).toBe('initial value');

    // Advance timer but not enough to trigger update
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('initial value');
  });

  it('should update the value after the delay has passed', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 500 } }
    );

    // Change the input value
    rerender({ value: 'new value', delay: 500 });

    // Advance timer to trigger update
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // Value should be updated
    expect(result.current).toBe('new value');
  });

  it('should handle multiple value changes within the delay period', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 500 } }
    );

    // First change
    rerender({ value: 'intermediate value', delay: 500 });
    
    // Advance timer but not enough to trigger update
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('initial value');
    
    // Second change before the first completes
    rerender({ value: 'final value', delay: 500 });
    
    // Advance timer but not enough for second change
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('initial value');
    
    // Advance timer to complete the debounce for the second change
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('final value');
  });

  it('should handle changing the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 1000 } }
    );

    // Change value and decrease delay
    rerender({ value: 'new value', delay: 300 });
    
    // Advance timer by the new delay
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('new value');
  });
});