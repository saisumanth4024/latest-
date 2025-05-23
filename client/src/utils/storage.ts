/**
 * Type for supported storage engines
 */
export type StorageType = 'local' | 'session';

/**
 * Interface for storage options
 */
export interface StorageOptions {
  /** Prefix for all keys to prevent collisions */
  prefix?: string;
  /** Storage engine to use - localStorage or sessionStorage */
  type?: StorageType;
  /** Whether to parse/stringify JSON automatically */
  useJSON?: boolean;
  /** TTL in milliseconds for items */
  ttl?: number;
}

/**
 * Default storage options
 */
const defaultOptions: StorageOptions = {
  prefix: 'app',
  type: 'local',
  useJSON: true,
  ttl: undefined,
};

/**
 * Interface for stored item metadata
 */
interface StoredItemMetadata {
  /** When the item was created */
  createdAt: number;
  /** When the item expires (if TTL is set) */
  expiresAt?: number;
  /** Version of the data schema (for migrations) */
  version?: number;
}

/**
 * Interface for stored item with metadata
 */
interface StoredItem<T> {
  /** The stored data */
  data: T;
  /** Metadata about the stored item */
  meta: StoredItemMetadata;
}

/**
 * A type-safe wrapper for browser storage (localStorage and sessionStorage)
 * with advanced features like TTL, namespacing, and JSON handling.
 * 
 * @example
 * ```typescript
 * // Create a storage instance for user preferences
 * const userPrefs = createStorage<UserPreferences>({
 *   prefix: 'userPrefs',
 *   type: 'local'
 * });
 * 
 * // Set a value
 * userPrefs.set('theme', { mode: 'dark', fontSize: 16 });
 * 
 * // Get a value with type safety
 * const theme = userPrefs.get('theme');
 * if (theme) {
 *   console.log(theme.mode); // TypeScript knows theme has a mode property
 * }
 * 
 * // Remove a value
 * userPrefs.remove('theme');
 * 
 * // Clear all user preferences
 * userPrefs.clear();
 * ```
 */
export class Storage<T extends Record<string, any> = Record<string, any>> {
  private options: StorageOptions;
  
  constructor(options: StorageOptions = {}) {
    this.options = { ...defaultOptions, ...options };
  }
  
  /**
   * Get the storage engine based on the options
   */
  private get storageEngine(): globalThis.Storage {
    if (typeof window === 'undefined') {
      throw new Error('Storage is only available in browser environments');
    }
    
    return this.options.type === 'session'
      ? window.sessionStorage
      : window.localStorage;
  }
  
  /**
   * Get the full key with prefix
   */
  private getKey(key: keyof T & string): string {
    return `${this.options.prefix}:${key}`;
  }
  
  /**
   * Check if an item has expired
   */
  private isExpired(meta: StoredItemMetadata): boolean {
    if (!meta.expiresAt) return false;
    return Date.now() > meta.expiresAt;
  }
  
  /**
   * Set a value in storage
   */
  set<K extends keyof T>(key: K & string, value: T[K], options?: { ttl?: number }): void {
    try {
      const ttl = options?.ttl ?? this.options.ttl;
      
      const item: StoredItem<T[K]> = {
        data: value,
        meta: {
          createdAt: Date.now(),
          expiresAt: ttl ? Date.now() + ttl : undefined,
          version: 1, // Could be used for migrations
        },
      };
      
      const storageValue = this.options.useJSON
        ? JSON.stringify(item)
        : String(item);
      
      this.storageEngine.setItem(this.getKey(key), storageValue);
    } catch (error) {
      console.error('Failed to set storage item:', error);
      // Silently fail in case of quota exceeded or other storage errors
    }
  }
  
  /**
   * Get a value from storage
   */
  get<K extends keyof T>(key: K & string): T[K] | null {
    try {
      const fullKey = this.getKey(key);
      const value = this.storageEngine.getItem(fullKey);
      
      if (value === null) return null;
      
      if (!this.options.useJSON) {
        return value as unknown as T[K];
      }
      
      try {
        const item = JSON.parse(value) as StoredItem<T[K]>;
        
        // Check if the item has expired
        if (this.isExpired(item.meta)) {
          this.remove(key);
          return null;
        }
        
        return item.data;
      } catch (parseError) {
        // If parsing fails, it might be an old format
        // Just return the value directly for backward compatibility
        return value as unknown as T[K];
      }
    } catch (error) {
      console.error('Failed to get storage item:', error);
      return null;
    }
  }
  
  /**
   * Check if a key exists in storage
   */
  has<K extends keyof T>(key: K & string): boolean {
    return this.get(key) !== null;
  }
  
  /**
   * Remove a value from storage
   */
  remove<K extends keyof T>(key: K & string): void {
    try {
      this.storageEngine.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Failed to remove storage item:', error);
    }
  }
  
  /**
   * Clear all values for this storage instance (only with the same prefix)
   */
  clear(): void {
    try {
      // Only clear items with the current prefix
      const prefix = `${this.options.prefix}:`;
      
      // Get all keys with the current prefix
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < this.storageEngine.length; i++) {
        const key = this.storageEngine.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      
      // Remove the keys
      keysToRemove.forEach(key => {
        this.storageEngine.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
  
  /**
   * Get all keys for this storage instance
   */
  keys(): (keyof T & string)[] {
    try {
      const prefix = `${this.options.prefix}:`;
      const keys: (keyof T & string)[] = [];
      
      for (let i = 0; i < this.storageEngine.length; i++) {
        const key = this.storageEngine.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key.slice(prefix.length) as keyof T & string);
        }
      }
      
      return keys;
    } catch (error) {
      console.error('Failed to get storage keys:', error);
      return [];
    }
  }
  
  /**
   * Get all values for this storage instance
   */
  getAll(): Partial<T> {
    try {
      const keys = this.keys();
      return keys.reduce((result, key) => {
        const value = this.get(key);
        if (value !== null) {
          result[key] = value;
        }
        return result;
      }, {} as Partial<T>);
    } catch (error) {
      console.error('Failed to get all storage values:', error);
      return {};
    }
  }
}

/**
 * Create a new storage instance with the provided options
 */
export function createStorage<T extends Record<string, any> = Record<string, any>>(
  options: StorageOptions = {}
): Storage<T> {
  return new Storage<T>(options);
}

/**
 * Default localStorage instance
 */
export const localStorage = createStorage({ type: 'local', prefix: 'app' });

/**
 * Default sessionStorage instance
 */
export const sessionStorage = createStorage({ type: 'session', prefix: 'app' });

export default {
  createStorage,
  localStorage,
  sessionStorage,
};