import React, { useState, useCallback } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Entity, Named } from '../types/advancedTypes';

/**
 * Props for the GenericDropdown component
 * T is a generic type parameter that extends both Entity and Named
 */
export interface GenericDropdownProps<T extends Entity & Named> {
  /** The items to display in the dropdown */
  items: T[];
  /** The currently selected item value */
  value: string;
  /** Callback function for when the selection changes */
  onChange: (value: string, item: T | undefined) => void;
  /** Optional placeholder text */
  placeholder?: string;
  /** Optional CSS class name */
  className?: string;
  /** Optional function to get the display text for an item */
  getDisplayText?: (item: T) => string;
  /** Optional function to get the value for an item */
  getValue?: (item: T) => string;
  /** Optional label for the dropdown */
  label?: string;
  /** Optional flag to indicate if the dropdown is disabled */
  disabled?: boolean;
  /** Optional error message */
  error?: string;
}

/**
 * A generic dropdown component that can work with any data type
 * that extends Entity and Named
 */
function GenericDropdown<T extends Entity & Named>({
  items,
  value,
  onChange,
  placeholder = "Select an option...",
  className = "",
  getDisplayText = (item) => item.name,
  getValue = (item) => String(item.id),
  label,
  disabled = false,
  error,
}: GenericDropdownProps<T>) {
  // Handle selection change
  const handleChange = useCallback((newValue: string) => {
    const selectedItem = items.find(item => getValue(item) === newValue);
    onChange(newValue, selectedItem);
  }, [items, onChange, getValue]);

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <Select
        value={value}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        
        <SelectContent>
          {items.map((item) => (
            <SelectItem 
              key={getValue(item)} 
              value={getValue(item)}
            >
              {getDisplayText(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export default GenericDropdown;