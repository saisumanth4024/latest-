import React from 'react';
import { Entity } from '../types/advancedTypes';

/**
 * Props for the GenericList component
 * T is a generic type parameter that extends Entity
 */
export interface GenericListProps<T extends Entity> {
  /** The items to display in the list */
  items: T[];
  /** Function to render each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Optional loading state */
  isLoading?: boolean;
  /** Optional error message */
  error?: string;
  /** Optional empty state message */
  emptyMessage?: string;
  /** Optional CSS class name */
  className?: string;
  /** Optional callback for when an item is clicked */
  onItemClick?: (item: T) => void;
  /** Optional key selector function */
  keySelector?: (item: T) => string | number;
  /** Optional header content */
  header?: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
}

/**
 * A generic list component that can work with any data type
 * that extends Entity (has an id field)
 */
function GenericList<T extends Entity>({
  items,
  renderItem,
  isLoading = false,
  error,
  emptyMessage = "No items found",
  className = "",
  onItemClick,
  keySelector = (item) => item.id,
  header,
  footer,
}: GenericListProps<T>) {
  // If there's an error, display it
  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  // If loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If no items, show empty message
  if (items.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Optional header */}
      {header && <div className="mb-2">{header}</div>}
      
      {/* List items */}
      <ul className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <li 
            key={keySelector(item)}
            onClick={onItemClick ? () => onItemClick(item) : undefined}
            className={onItemClick ? "cursor-pointer hover:bg-gray-50" : ""}
          >
            {renderItem(item, index)}
          </li>
        ))}
      </ul>

      {/* Optional footer */}
      {footer && <div className="mt-2">{footer}</div>}
    </div>
  );
}

export default GenericList;