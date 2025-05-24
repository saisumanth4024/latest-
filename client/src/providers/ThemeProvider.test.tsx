import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, ThemeContext } from './ThemeProvider';
import { useContext } from 'react';

// Component that uses theme context for testing
const ThemeConsumer = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <div>
      <div data-testid="current-theme">Current theme: {theme}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeProvider Component', () => {
  let originalMatchMedia: typeof window.matchMedia;
  
  beforeEach(() => {
    // Save original matchMedia
    originalMatchMedia = window.matchMedia;
    
    // Create a mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
      removeItem: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // Reset mocks between tests
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    // Restore original matchMedia
    window.matchMedia = originalMatchMedia;
  });

  it('should provide light theme by default when no preference is stored', () => {
    // Mock localStorage returning null (no stored preference)
    vi.spyOn(window.localStorage, 'getItem').mockReturnValue(null);
    
    // Mock matchMedia to return non-matches for dark mode preference
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    
    // Render theme provider with consumer
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    
    // Should show light theme by default
    expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: light');
  });

  it('should respect dark mode preference from system', () => {
    // Mock localStorage returning null (no stored preference)
    vi.spyOn(window.localStorage, 'getItem').mockReturnValue(null);
    
    // Mock matchMedia to return matches for dark mode preference
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    
    // Render theme provider with consumer
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    
    // Should show dark theme based on system preference
    expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
  });

  it('should respect stored theme preference over system preference', () => {
    // Mock localStorage returning a specific theme
    vi.spyOn(window.localStorage, 'getItem').mockReturnValue('light');
    
    // Mock matchMedia to return matches for dark mode preference
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    
    // Render theme provider with consumer
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    
    // Should show light theme from storage, despite system preferring dark
    expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: light');
  });

  it('should toggle theme when toggle function is called', async () => {
    // Mock localStorage for initial state
    vi.spyOn(window.localStorage, 'getItem').mockReturnValue('light');
    const setItemMock = vi.spyOn(window.localStorage, 'setItem');
    
    // Mock document.documentElement
    const documentElementMock = {
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      }
    };
    
    Object.defineProperty(document, 'documentElement', {
      value: documentElementMock,
      writable: true
    });
    
    const user = userEvent.setup();
    
    // Render theme provider with consumer
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    
    // Initial theme should be light
    expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: light');
    
    // Toggle theme
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(toggleButton);
    
    // Theme should switch to dark
    expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
    
    // Theme should be saved to localStorage
    expect(setItemMock).toHaveBeenCalledWith('theme', 'dark');
    
    // Dark class should be added to document.documentElement
    expect(documentElementMock.classList.add).toHaveBeenCalledWith('dark');
  });

  it('should respond to system preference changes', () => {
    // Mock localStorage returning null (no stored preference)
    vi.spyOn(window.localStorage, 'getItem').mockReturnValue(null);
    
    // Create a mock media query list with an event handler
    let mediaQueryChangeHandler: ((e: MediaQueryListEvent) => void) | null = null;
    
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false, // Initially prefer light
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (event: string, handler: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          mediaQueryChangeHandler = handler;
        }
      },
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    
    // Render theme provider with consumer
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    
    // Initial theme should be light
    expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: light');
    
    // Simulate change in system preference to dark mode
    act(() => {
      if (mediaQueryChangeHandler) {
        mediaQueryChangeHandler({
          matches: true,
          media: '(prefers-color-scheme: dark)',
        } as MediaQueryListEvent);
      }
    });
    
    // Theme should switch to dark following system preference
    expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
  });
});