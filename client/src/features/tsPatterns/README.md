# TypeScript Advanced Patterns

This module demonstrates advanced TypeScript patterns used in enterprise React applications. These patterns enable better type safety, code reusability, and maintainable architecture.

## Generic Components

### `List<T>`
A generic list component that can display any type of data while maintaining full type safety.

**Real-world usage:**
- Data tables with different entity types (users, products, orders)
- Dropdowns for various data types
- Selection components with different value types

### `Dropdown<T>`
A type-safe dropdown component that works with any data type while providing intellisense for item properties.

**Real-world usage:**
- Form select fields
- Filter components
- Multi-step form selection fields

## Discriminated Unions

Discriminated unions allow TypeScript to narrow down types based on a discriminator property.

**Examples:**
- `NotificationType`: Different notification types (toast, modal, in-app)
- `ApiResponse<T>`: Type-safe API responses with success/error discrimination
- `UiStateType`: Different UI states (loading, error, success, empty)

**Real-world usage:**
- State management
- API response handling
- Complex UI workflows
- Event handling systems

## Utility Types

TypeScript provides powerful utility types for transforming existing types.

### Built-in Utility Types
- `Partial<T>`: Makes all properties of T optional
- `Required<T>`: Makes all properties of T required
- `Record<K,V>`: Creates a type with properties of type K and values of type V
- `Pick<T,K>`: Creates a type by picking a set of properties from T
- `Omit<T,K>`: Creates a type by omitting a set of properties from T
- `Readonly<T>`: Makes all properties of T readonly

### Custom Utility Types
- `DeepPartial<T>`: Recursively makes all properties optional
- `Nullable<T>`: Makes all properties nullable
- `ValueOf<T>`: Extracts the value type from a Record/object type

## Mapped Types

Mapped types allow creating new types based on existing ones by transforming properties.

**Examples:**
- `FormErrors<T>`: Derives error types from form field types
- `ApiParams<T>`: Transforms model fields into API parameters
- `ReadonlyDeep<T>`: Makes all properties and nested properties readonly

## Type Guards and Assertions

Functions that help TypeScript narrow down types at runtime.

**Examples:**
- `isSuccess<T>`: Checks if an API response is successful
- `isUserRole`: Checks if a user has a specific role
- `assertNonNullable`: Ensures a value is not null or undefined

## Template Literal Types

Creating new string types based on existing ones.

**Examples:**
- `RouteParams<Route>`: Extracts route parameters from route strings
- `CssProperty`: Type-safe CSS property names
- `HttpMethod`: Strict HTTP method types

## Demo

The demo page shows practical applications of these patterns in a real-world React application.