import { z } from 'zod';
import { ZodError, ZodIssue } from 'zod';
import logger from './logger';

/**
 * Interface for validation result
 */
export interface ValidationResult<T> {
  /** Whether the validation was successful */
  success: boolean;
  /** Validated data (only present if success is true) */
  data?: T;
  /** Validation errors (only present if success is false) */
  errors?: ValidationError[];
  /** Raw ZodError if available */
  zodError?: ZodError;
}

/**
 * Interface for validation error
 */
export interface ValidationError {
  /** Path to the field with the error */
  path: string[];
  /** Error message */
  message: string;
  /** Error code */
  code?: string;
}

/**
 * Common validation schemas
 */
export const CommonSchemas = {
  /**
   * Schema for validating email addresses
   */
  email: z.string().email(),
  
  /**
   * Schema for validating passwords
   * Requires 8+ characters, including at least one uppercase, lowercase, number, and special character
   */
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      (value) => /[A-Z]/.test(value),
      'Password must contain at least one uppercase letter'
    )
    .refine(
      (value) => /[a-z]/.test(value),
      'Password must contain at least one lowercase letter'
    )
    .refine(
      (value) => /[0-9]/.test(value),
      'Password must contain at least one number'
    )
    .refine(
      (value) => /[^A-Za-z0-9]/.test(value),
      'Password must contain at least one special character'
    ),
  
  /**
   * Schema for validating usernames
   * Allows alphanumeric characters and underscores, 3-20 characters
   */
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),
  
  /**
   * Schema for validating phone numbers
   * Basic validation - more complex validation would depend on country format
   */
  phoneNumber: z
    .string()
    .regex(
      /^\+?[0-9]{10,15}$/,
      'Phone number must be between 10 and 15 digits'
    ),
  
  /**
   * Schema for validating URLs
   */
  url: z.string().url(),
  
  /**
   * Schema for validating dates
   */
  date: z.coerce.date(),
  
  /**
   * Schema for validating UUIDs
   */
  uuid: z.string().uuid(),
  
  /**
   * Schema for validating positive integers
   */
  positiveInteger: z.number().int().positive(),
  
  /**
   * Schema for validating non-negative integers
   */
  nonNegativeInteger: z.number().int().nonnegative(),
  
  /**
   * Schema for validating postal/ZIP codes
   * Basic format - would need to be adjusted for specific country formats
   */
  postalCode: z
    .string()
    .regex(/^[a-zA-Z0-9 -]{3,10}$/, 'Invalid postal code format'),
};

/**
 * Format a ZodError into a more user-friendly format
 * 
 * @param zodError - The ZodError to format
 * @returns An array of formatted validation errors
 */
export function formatZodError(zodError: ZodError): ValidationError[] {
  return zodError.errors.map((error: ZodIssue) => ({
    path: error.path,
    message: error.message,
    code: error.code,
  }));
}

/**
 * Format a ZodError into a map of field paths to error messages
 * 
 * @param zodError - The ZodError to format
 * @returns A map of field paths to error messages
 */
export function formatZodErrorMap(zodError: ZodError): Record<string, string> {
  const errorMap: Record<string, string> = {};
  
  zodError.errors.forEach((error: ZodIssue) => {
    const path = error.path.join('.');
    errorMap[path] = error.message;
  });
  
  return errorMap;
}

/**
 * Validate data against a Zod schema
 * 
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns A validation result
 * 
 * @example
 * ```typescript
 * const userSchema = z.object({
 *   username: CommonSchemas.username,
 *   email: CommonSchemas.email,
 *   password: CommonSchemas.password,
 * });
 * 
 * const result = validate(userSchema, {
 *   username: 'john_doe',
 *   email: 'invalid-email',
 *   password: 'weak',
 * });
 * 
 * if (!result.success) {
 *   console.log(result.errors);
 *   // [
 *   //   { path: ['email'], message: 'Invalid email', code: 'invalid_string' },
 *   //   { path: ['password'], message: 'Password must be at least 8 characters', code: 'too_small' },
 *   // ]
 * }
 * ```
 */
export function validate<T>(schema: z.ZodType<T>, data: unknown): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.debug('Validation failed', { error });
      
      return {
        success: false,
        errors: formatZodError(error),
        zodError: error,
      };
    }
    
    // If it's not a ZodError, something unexpected happened
    logger.error('Unexpected validation error', error);
    
    return {
      success: false,
      errors: [
        {
          path: [],
          message: 'An unexpected validation error occurred',
        },
      ],
    };
  }
}

/**
 * Validate data against a Zod schema, returning null instead of throwing
 * 
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns The validated data or null if validation fails
 */
export function validateSafe<T>(schema: z.ZodType<T>, data: unknown): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    logger.debug('Validation failed', { error });
    return null;
  }
}

/**
 * Create a form validator function for use with react-hook-form
 * 
 * @param schema - The Zod schema to validate against
 * @returns A validation resolver for react-hook-form
 */
export function createFormValidator<T extends z.ZodType<any, any>>(schema: T) {
  return async (data: any) => {
    try {
      const validatedData = await schema.parseAsync(data);
      return {
        values: validatedData,
        errors: {},
      };
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMap = formatZodErrorMap(error);
        const errors = Object.entries(errorMap).reduce(
          (acc, [path, message]) => {
            const pathArray = path.split('.');
            let current = acc;
            
            // Navigate to the nested property
            for (let i = 0; i < pathArray.length - 1; i++) {
              const key = pathArray[i];
              if (!current[key]) {
                current[key] = {};
              }
              current = current[key];
            }
            
            // Set the error message on the leaf property
            const leafKey = pathArray[pathArray.length - 1];
            current[leafKey] = {
              message,
              type: 'validation',
            };
            
            return acc;
          },
          {} as Record<string, any>
        );
        
        return {
          values: {},
          errors,
        };
      }
      
      // If it's not a ZodError, something unexpected happened
      logger.error('Unexpected validation error', error);
      
      return {
        values: {},
        errors: {
          root: {
            message: 'An unexpected validation error occurred',
            type: 'validation',
          },
        },
      };
    }
  };
}

export default {
  validate,
  validateSafe,
  createFormValidator,
  formatZodError,
  formatZodErrorMap,
  CommonSchemas,
};