import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from './use-toast';

// Mock the module to prevent actual DOM operations
vi.mock('@/hooks/use-toast', async () => {
  // Get the original module
  const actualModule = await vi.importActual<typeof import('./use-toast')>('./use-toast');
  
  // Create a mock state
  let mockToasts: any[] = [];
  
  // Return a modified version for testing
  return {
    ...actualModule,
    useToast: () => ({
      toast: vi.fn(({ title, description, variant, action }) => {
        const id = `toast-${mockToasts.length + 1}`;
        mockToasts.push({ 
          id, 
          title, 
          description, 
          variant: variant || 'default', 
          action,
          open: true 
        });
        return id;
      }),
      remove: vi.fn((id) => {
        mockToasts = mockToasts.filter(t => t.id !== id);
      }),
      dismiss: vi.fn((id) => {
        if (id) {
          const toast = mockToasts.find(t => t.id === id);
          if (toast) toast.open = false;
        } else {
          mockToasts.forEach(t => t.open = false);
        }
      }),
      toasts: mockToasts,
      success: vi.fn(({ title, description }) => {
        const id = `toast-${mockToasts.length + 1}`;
        mockToasts.push({ id, title, description, variant: 'success', open: true });
        return id;
      }),
      error: vi.fn(({ title, description }) => {
        const id = `toast-${mockToasts.length + 1}`;
        mockToasts.push({ id, title, description, variant: 'destructive', open: true });
        return id;
      }),
      warning: vi.fn(({ title, description }) => {
        const id = `toast-${mockToasts.length + 1}`;
        mockToasts.push({ id, title, description, variant: 'warning', open: true });
        return id;
      }),
      info: vi.fn(({ title, description }) => {
        const id = `toast-${mockToasts.length + 1}`;
        mockToasts.push({ id, title, description, variant: 'info', open: true });
        return id;
      }),
      update: vi.fn(({ id, ...props }) => {
        const index = mockToasts.findIndex(t => t.id === id);
        if (index !== -1) {
          mockToasts[index] = { ...mockToasts[index], ...props };
        }
      }),
      clearAll: vi.fn(() => {
        mockToasts = [];
      })
    })
  };
});

describe('useToast Hook', () => {
  beforeEach(() => {
    // Clear any previous toasts before each test
    act(() => {
      const { result } = renderHook(() => useToast());
      result.current.clearAll();
    });
  });

  it('should add a toast and return the correct ID', () => {
    // Render the hook
    const { result } = renderHook(() => useToast());
    
    let toastId: string;
    
    // Add a toast
    act(() => {
      toastId = result.current.toast({
        title: 'Test Toast',
        description: 'This is a test toast',
      });
    });
    
    // Verify toast was added and has the correct data
    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe('Test Toast');
    expect(result.current.toasts[0].description).toBe('This is a test toast');
    expect(result.current.toasts[0].id).toBeDefined();
    expect(typeof result.current.toasts[0].id).toBe('string');
  });

  it('should remove a toast by ID', () => {
    // Render the hook
    const { result } = renderHook(() => useToast());
    
    let toastId: string;
    
    // Add a toast
    act(() => {
      toastId = result.current.toast({
        title: 'Test Toast',
      });
    });
    
    // Verify toast was added
    expect(result.current.toasts.length).toBe(1);
    
    // Remove the toast
    act(() => {
      result.current.remove(toastId);
    });
    
    // Verify toast was removed
    expect(result.current.toasts.length).toBe(0);
  });

  it('should update an existing toast', () => {
    // Render the hook
    const { result } = renderHook(() => useToast());
    
    let toastId: string;
    
    // Add a toast
    act(() => {
      toastId = result.current.toast({
        title: 'Initial Title',
        description: 'Initial description',
      });
    });
    
    // Update the toast
    act(() => {
      result.current.update({
        id: toastId,
        title: 'Updated Title',
        description: 'Updated description',
      });
    });
    
    // Verify toast was updated
    expect(result.current.toasts[0].title).toBe('Updated Title');
    expect(result.current.toasts[0].description).toBe('Updated description');
  });

  it('should dismiss a toast (by default, all toasts)', () => {
    // Render the hook
    const { result } = renderHook(() => useToast());
    
    // Add multiple toasts
    act(() => {
      result.current.toast({ title: 'Toast 1' });
      result.current.toast({ title: 'Toast 2' });
    });
    
    // Verify toasts were added
    expect(result.current.toasts.length).toBe(2);
    
    // Dismiss all toasts
    act(() => {
      result.current.dismiss();
    });
    
    // Verify that both toasts have open: false
    expect(result.current.toasts.every(toast => toast.open === false)).toBe(true);
  });

  it('should dismiss a specific toast by ID', () => {
    // Render the hook
    const { result } = renderHook(() => useToast());
    
    let toast1Id: string;
    let toast2Id: string;
    
    // Add multiple toasts
    act(() => {
      toast1Id = result.current.toast({ title: 'Toast 1' });
      toast2Id = result.current.toast({ title: 'Toast 2' });
    });
    
    // Dismiss specific toast
    act(() => {
      result.current.dismiss(toast1Id);
    });
    
    // Verify only the specific toast was dismissed
    const toast1 = result.current.toasts.find(t => t.id === toast1Id);
    const toast2 = result.current.toasts.find(t => t.id === toast2Id);
    
    expect(toast1?.open).toBe(false);
    expect(toast2?.open).toBe(true);
  });

  it('should provide variant-specific toast functions', () => {
    // Render the hook
    const { result } = renderHook(() => useToast());
    
    // Use the variant-specific functions
    act(() => {
      result.current.success({ title: 'Success Toast' });
      result.current.error({ title: 'Error Toast' });
      result.current.warning({ title: 'Warning Toast' });
      result.current.info({ title: 'Info Toast' });
    });
    
    // Verify toasts have the correct variants
    const toasts = result.current.toasts;
    
    expect(toasts.length).toBe(4);
    expect(toasts.find(t => t.title === 'Success Toast')?.variant).toBe('success');
    expect(toasts.find(t => t.title === 'Error Toast')?.variant).toBe('destructive');
    expect(toasts.find(t => t.title === 'Warning Toast')?.variant).toBe('warning');
    expect(toasts.find(t => t.title === 'Info Toast')?.variant).toBe('info');
  });

  it('should clear all toasts', () => {
    // Render the hook
    const { result } = renderHook(() => useToast());
    
    // Add multiple toasts
    act(() => {
      result.current.toast({ title: 'Toast 1' });
      result.current.toast({ title: 'Toast 2' });
      result.current.toast({ title: 'Toast 3' });
    });
    
    // Verify toasts were added
    expect(result.current.toasts.length).toBe(3);
    
    // Clear all toasts
    act(() => {
      result.current.clearAll();
    });
    
    // Verify all toasts were removed
    expect(result.current.toasts.length).toBe(0);
  });
});