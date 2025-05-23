import logger from './logger';

/**
 * Event categories for analytics tracking
 */
export enum EventCategory {
  PAGE_VIEW = 'page_view',
  USER_ACTION = 'user_action',
  FORM = 'form',
  PERFORMANCE = 'performance',
  ERROR = 'error',
  ENGAGEMENT = 'engagement',
}

/**
 * Interface for analytics event data
 */
export interface AnalyticsEvent {
  /** Event category */
  category: EventCategory;
  /** Event action */
  action: string;
  /** Event label (optional) */
  label?: string;
  /** Event value (optional) */
  value?: number;
  /** Additional event properties */
  properties?: Record<string, any>;
}

/**
 * Interface for user properties
 */
export interface UserProperties {
  /** User ID if available */
  userId?: string | number;
  /** Anonymous ID if user is not logged in */
  anonymousId?: string;
  /** User role or permission level */
  role?: string;
  /** Additional properties */
  [key: string]: any;
}

/**
 * Interface for page view data
 */
export interface PageViewData {
  /** Page path */
  path: string;
  /** Page title */
  title?: string;
  /** Referrer information */
  referrer?: string;
  /** Additional properties */
  properties?: Record<string, any>;
}

/**
 * Interface for analytics provider configuration
 */
export interface AnalyticsConfig {
  /** Provider API key or token */
  apiKey?: string;
  /** Whether tracking is enabled */
  enabled: boolean;
  /** User consent status */
  hasConsent: boolean;
  /** Additional provider-specific options */
  options?: Record<string, any>;
}

/**
 * Abstract class for analytics providers
 */
abstract class AnalyticsProvider {
  protected config: AnalyticsConfig;
  
  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
      enabled: true,
      hasConsent: false,
      ...config,
    };
  }
  
  /**
   * Initialize the analytics provider
   */
  abstract initialize(): Promise<boolean>;
  
  /**
   * Track an event
   */
  abstract trackEvent(event: AnalyticsEvent): void;
  
  /**
   * Track a page view
   */
  abstract trackPageView(data: PageViewData): void;
  
  /**
   * Identify a user
   */
  abstract identifyUser(properties: UserProperties): void;
  
  /**
   * Clear user identity
   */
  abstract clearUser(): void;
}

/**
 * Console implementation of analytics provider for development
 */
class ConsoleAnalyticsProvider extends AnalyticsProvider {
  async initialize(): Promise<boolean> {
    logger.info('Initializing console analytics provider');
    return true;
  }
  
  trackEvent(event: AnalyticsEvent): void {
    if (!this.shouldTrack()) return;
    
    logger.info('Analytics Event Tracked', event);
  }
  
  trackPageView(data: PageViewData): void {
    if (!this.shouldTrack()) return;
    
    logger.info('Analytics Page View', data);
  }
  
  identifyUser(properties: UserProperties): void {
    if (!this.shouldTrack()) return;
    
    logger.info('Analytics User Identified', properties);
  }
  
  clearUser(): void {
    if (!this.config.enabled) return;
    
    logger.info('Analytics User Cleared');
  }
  
  private shouldTrack(): boolean {
    return this.config.enabled && this.config.hasConsent;
  }
}

/**
 * Google Analytics implementation (stub)
 */
class GoogleAnalyticsProvider extends AnalyticsProvider {
  async initialize(): Promise<boolean> {
    if (!this.config.apiKey) {
      logger.warn('Google Analytics initialization failed: No API key provided');
      return false;
    }
    
    try {
      // In a real implementation, this would load the GA script
      logger.info('Google Analytics initialized with tracking ID', { trackingId: this.config.apiKey });
      return true;
    } catch (error) {
      logger.error('Failed to initialize Google Analytics', error);
      return false;
    }
  }
  
  trackEvent(event: AnalyticsEvent): void {
    if (!this.shouldTrack()) return;
    
    // In a real implementation, this would call the GA tracking API
    logger.info('GA Event Tracked', event);
  }
  
  trackPageView(data: PageViewData): void {
    if (!this.shouldTrack()) return;
    
    // In a real implementation, this would call the GA tracking API
    logger.info('GA Page View', data);
  }
  
  identifyUser(properties: UserProperties): void {
    if (!this.shouldTrack()) return;
    
    // In a real implementation, this would set GA user properties
    logger.info('GA User Identified', properties);
  }
  
  clearUser(): void {
    if (!this.config.enabled) return;
    
    // In a real implementation, this would clear GA user properties
    logger.info('GA User Cleared');
  }
  
  private shouldTrack(): boolean {
    return this.config.enabled && this.config.hasConsent;
  }
}

/**
 * Custom implementation for a first-party analytics solution
 */
class CustomAnalyticsProvider extends AnalyticsProvider {
  private endpoint: string;
  
  constructor(config: Partial<AnalyticsConfig> & { endpoint?: string } = {}) {
    super(config);
    this.endpoint = config.endpoint || '/api/analytics';
  }
  
  async initialize(): Promise<boolean> {
    try {
      // In a real implementation, this might check if the API is available
      logger.info('Custom analytics provider initialized');
      return true;
    } catch (error) {
      logger.error('Failed to initialize custom analytics provider', error);
      return false;
    }
  }
  
  trackEvent(event: AnalyticsEvent): void {
    if (!this.shouldTrack()) return;
    
    // In a real implementation, this would send the event to the backend
    this.sendToBackend('/event', event);
  }
  
  trackPageView(data: PageViewData): void {
    if (!this.shouldTrack()) return;
    
    // In a real implementation, this would send the page view to the backend
    this.sendToBackend('/pageview', data);
  }
  
  identifyUser(properties: UserProperties): void {
    if (!this.shouldTrack()) return;
    
    // In a real implementation, this would send the user data to the backend
    this.sendToBackend('/identify', properties);
  }
  
  clearUser(): void {
    if (!this.config.enabled) return;
    
    // In a real implementation, this would clear user data on the backend
    this.sendToBackend('/clear-user', {});
  }
  
  private shouldTrack(): boolean {
    return this.config.enabled && this.config.hasConsent;
  }
  
  private sendToBackend(path: string, data: any): void {
    try {
      // Simulated API call
      const endpoint = `${this.endpoint}${path}`;
      logger.debug(`Sending analytics data to ${endpoint}`, data);
      
      // In a real implementation, this would use fetch or axios
      /*
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      */
    } catch (error) {
      logger.error('Failed to send analytics data', error);
    }
  }
}

/**
 * Main analytics service that coordinates multiple providers
 */
class AnalyticsService {
  private providers: AnalyticsProvider[] = [];
  private initialized = false;
  private userProperties: UserProperties = {};
  
  /**
   * Register an analytics provider
   */
  registerProvider(provider: AnalyticsProvider): void {
    this.providers.push(provider);
  }
  
  /**
   * Initialize all registered providers
   */
  async initialize(): Promise<boolean> {
    try {
      const results = await Promise.all(
        this.providers.map(provider => provider.initialize())
      );
      
      this.initialized = results.some(result => result);
      return this.initialized;
    } catch (error) {
      logger.error('Failed to initialize analytics service', error);
      return false;
    }
  }
  
  /**
   * Track an event across all providers
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized) {
      logger.warn('Analytics service not initialized');
      return;
    }
    
    this.providers.forEach(provider => {
      try {
        provider.trackEvent(event);
      } catch (error) {
        logger.error('Error tracking event', error);
      }
    });
  }
  
  /**
   * Track a page view across all providers
   */
  trackPageView(data: PageViewData): void {
    if (!this.initialized) {
      logger.warn('Analytics service not initialized');
      return;
    }
    
    this.providers.forEach(provider => {
      try {
        provider.trackPageView(data);
      } catch (error) {
        logger.error('Error tracking page view', error);
      }
    });
  }
  
  /**
   * Identify a user across all providers
   */
  identifyUser(properties: UserProperties): void {
    if (!this.initialized) {
      logger.warn('Analytics service not initialized');
      return;
    }
    
    this.userProperties = { ...this.userProperties, ...properties };
    
    this.providers.forEach(provider => {
      try {
        provider.identifyUser(this.userProperties);
      } catch (error) {
        logger.error('Error identifying user', error);
      }
    });
  }
  
  /**
   * Clear user identity across all providers
   */
  clearUser(): void {
    if (!this.initialized) {
      logger.warn('Analytics service not initialized');
      return;
    }
    
    this.userProperties = {};
    
    this.providers.forEach(provider => {
      try {
        provider.clearUser();
      } catch (error) {
        logger.error('Error clearing user', error);
      }
    });
  }
  
  /**
   * Shorthand for tracking a user action event
   */
  trackAction(action: string, label?: string, value?: number, properties?: Record<string, any>): void {
    this.trackEvent({
      category: EventCategory.USER_ACTION,
      action,
      label,
      value,
      properties,
    });
  }
  
  /**
   * Shorthand for tracking a form event
   */
  trackForm(action: string, formId: string, properties?: Record<string, any>): void {
    this.trackEvent({
      category: EventCategory.FORM,
      action,
      label: formId,
      properties,
    });
  }
  
  /**
   * Shorthand for tracking an error event
   */
  trackError(action: string, error: any, properties?: Record<string, any>): void {
    this.trackEvent({
      category: EventCategory.ERROR,
      action,
      label: error?.message || 'Unknown error',
      properties: {
        ...properties,
        errorType: error?.name || 'Error',
        errorMessage: error?.message,
        errorStack: error?.stack,
      },
    });
  }
  
  /**
   * Shorthand for tracking a performance event
   */
  trackPerformance(action: string, value: number, properties?: Record<string, any>): void {
    this.trackEvent({
      category: EventCategory.PERFORMANCE,
      action,
      value,
      properties,
    });
  }
}

/**
 * Create and configure the analytics service
 */
export function createAnalytics(config: {
  googleAnalyticsId?: string;
  customEndpoint?: string;
  enabled?: boolean;
  hasConsent?: boolean;
}): AnalyticsService {
  const {
    googleAnalyticsId,
    customEndpoint,
    enabled = process.env.NODE_ENV === 'production',
    hasConsent = false,
  } = config;
  
  const service = new AnalyticsService();
  
  // Always register the console provider for development
  if (process.env.NODE_ENV !== 'production') {
    service.registerProvider(
      new ConsoleAnalyticsProvider({
        enabled: true,
        hasConsent: true, // Always allow console logging in development
      })
    );
  }
  
  // Register Google Analytics if a tracking ID is provided
  if (googleAnalyticsId) {
    service.registerProvider(
      new GoogleAnalyticsProvider({
        apiKey: googleAnalyticsId,
        enabled,
        hasConsent,
      })
    );
  }
  
  // Register custom analytics if an endpoint is provided
  if (customEndpoint) {
    service.registerProvider(
      new CustomAnalyticsProvider({
        endpoint: customEndpoint,
        enabled,
        hasConsent,
      })
    );
  }
  
  // Initialize the service (async, but we don't await it here)
  service.initialize().catch(error => {
    logger.error('Failed to initialize analytics service', error);
  });
  
  return service;
}

/**
 * Default analytics instance
 */
export const analytics = createAnalytics({
  googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  enabled: process.env.NODE_ENV === 'production',
  hasConsent: false, // Should be updated based on user consent
});

export default analytics;