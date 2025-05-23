import { z } from 'zod';

/**
 * Interface for API request options
 */
export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  baseUrl?: string;
  timeout?: number;
}

/**
 * Interface for API response with typed data
 */
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
  statusText: string;
  headers: Headers;
}

/**
 * Error class for API errors with status code and response data
 */
export class ApiError extends Error {
  status: number;
  statusText: string;
  data: any;

  constructor(message: string, status: number, statusText: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

/**
 * Default API configuration
 */
const defaultConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 30000, // 30 seconds default timeout
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Builds a URL with query parameters
 * 
 * @param url - The base URL
 * @param params - Query parameters to add to the URL
 * @returns The URL with query parameters
 */
function buildUrl(url: string, params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return url;
  
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value));
    }
  });
  
  const queryString = queryParams.toString();
  
  if (!queryString) return url;
  
  return `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
}

/**
 * Creates a promise that rejects after a specified timeout
 * 
 * @param ms - Timeout in milliseconds
 * @returns A promise that rejects after the timeout
 */
function timeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });
}

/**
 * Makes an API request with automatic timeout and error handling
 * 
 * @param url - The URL to request
 * @param options - Request options
 * @returns A promise that resolves to the API response
 * 
 * @example
 * ```typescript
 * // GET request with type inference
 * const { data, error } = await apiRequest<User[]>('/api/users');
 * 
 * // POST request with body and validation
 * const userSchema = z.object({
 *   id: z.number(),
 *   name: z.string(),
 *   email: z.string().email()
 * });
 * 
 * const { data, error } = await apiRequest<z.infer<typeof userSchema>>(
 *   '/api/users',
 *   {
 *     method: 'POST',
 *     body: JSON.stringify({ name: 'John', email: 'john@example.com' }),
 *     schema: userSchema // Optional validation schema
 *   }
 * );
 * ```
 */
export async function apiRequest<T = any>(
  url: string,
  options: RequestOptions & { schema?: z.ZodType<T> } = {}
): Promise<ApiResponse<T>> {
  try {
    const {
      params,
      baseUrl = defaultConfig.baseUrl,
      timeout = defaultConfig.timeout,
      headers = {},
      schema,
      ...fetchOptions
    } = options;

    // Merge default headers with provided headers
    const mergedHeaders = {
      ...defaultConfig.headers,
      ...headers,
    };

    // Build the full URL
    const fullUrl = `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
    const urlWithParams = buildUrl(fullUrl, params);

    // Create the request with a timeout
    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Use Promise.race to implement timeout
    const response = await Promise.race([
      fetch(urlWithParams, {
        ...fetchOptions,
        headers: mergedHeaders,
        signal,
      }),
      timeoutPromise(timeout),
    ]);

    clearTimeout(timeoutId);

    // Handle non-OK responses
    if (!response.ok) {
      let errorData;
      try {
        // Try to parse error response as JSON
        errorData = await response.json();
      } catch (e) {
        // If parsing fails, use status text
        errorData = { message: response.statusText };
      }

      throw new ApiError(
        errorData.message || 'API request failed',
        response.status,
        response.statusText,
        errorData
      );
    }

    // Parse the response based on content type
    const contentType = response.headers.get('content-type');
    let data: T | null = null;

    if (contentType?.includes('application/json')) {
      data = await response.json();

      // Validate the response data if schema is provided
      if (schema && data) {
        try {
          data = schema.parse(data);
        } catch (validationError) {
          console.error('Response validation error:', validationError);
          throw new ApiError(
            'Response validation failed',
            200,
            response.statusText,
            { validationError, data }
          );
        }
      }
    } else if (contentType?.includes('text/')) {
      // Handle text responses
      const textData = await response.text();
      data = textData as unknown as T;
    }

    return {
      data,
      error: null,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {
        data: null,
        error: new Error(`Request timed out after ${options.timeout || defaultConfig.timeout}ms`),
        status: 408,
        statusText: 'Request Timeout',
        headers: new Headers(),
      };
    }

    if (error instanceof ApiError) {
      return {
        data: null,
        error,
        status: error.status,
        statusText: error.statusText,
        headers: new Headers(),
      };
    }

    return {
      data: null,
      error,
      status: 500,
      statusText: 'Internal Client Error',
      headers: new Headers(),
    };
  }
}

/**
 * Shorthand for GET requests
 */
export function get<T = any>(url: string, options?: RequestOptions & { schema?: z.ZodType<T> }): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { ...options, method: 'GET' });
}

/**
 * Shorthand for POST requests
 */
export function post<T = any>(url: string, data: any, options?: RequestOptions & { schema?: z.ZodType<T> }): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Shorthand for PUT requests
 */
export function put<T = any>(url: string, data: any, options?: RequestOptions & { schema?: z.ZodType<T> }): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Shorthand for PATCH requests
 */
export function patch<T = any>(url: string, data: any, options?: RequestOptions & { schema?: z.ZodType<T> }): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Shorthand for DELETE requests
 */
export function del<T = any>(url: string, options?: RequestOptions & { schema?: z.ZodType<T> }): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { ...options, method: 'DELETE' });
}

export default {
  request: apiRequest,
  get,
  post,
  put,
  patch,
  delete: del,
};