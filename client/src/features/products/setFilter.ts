import { createAction } from '@reduxjs/toolkit';
import { ProductFilters } from './productsSlice';

// Define a properly typed set filter action
export const setFilterTyped = createAction<{
  key: keyof ProductFilters;
  value: string | number | boolean | string[] | null;
}>('products/setFilterTyped');