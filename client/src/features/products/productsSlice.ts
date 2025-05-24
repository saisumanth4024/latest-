import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UploadedImage } from './components/ImageUploader';
import { RootState } from '@/app/store';

// Define filters interface
export interface ProductFilters {
  category: string | null;
  priceRange: string | null;
  rating: string | null;
  sort: string;
  brand: string[] | null;
  colors: string[] | null;
  tags: string[] | null;
  discount: boolean | null;
  inStock: boolean | null;
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
}

// Define the state type
interface ProductsState {
  imageUpload: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    uploadedImageUrls: string[];
  };
  filters: ProductFilters;
}

// Define the initial state
const initialState: ProductsState = {
  imageUpload: {
    status: 'idle',
    error: null,
    uploadedImageUrls: [],
  },
  filters: {
    category: null,
    priceRange: null,
    rating: null,
    sort: 'newest',
    brand: null,
    colors: null,
    tags: null,
    discount: null,
    inStock: null,
    minPrice: null,
    maxPrice: null,
    minRating: null
  }
};

// Mock API call to upload images
export const uploadProductImages = createAsyncThunk(
  'products/uploadImages',
  async (payload: { productId: number; images: UploadedImage[] }, { rejectWithValue }) => {
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Normally this would send the actual files to a server endpoint
      // Here we're just returning the local URLs for demonstration
      const uploadedUrls = payload.images.map(img => URL.createObjectURL(img.file));
      
      return { 
        productId: payload.productId,
        imageUrls: uploadedUrls 
      };
    } catch (error) {
      return rejectWithValue('Failed to upload images. Please try again.');
    }
  }
);

// Create the slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearImageUploadState: (state) => {
      state.imageUpload = {
        status: 'idle',
        error: null,
        uploadedImageUrls: []
      };
    },
    setFilter: (state, action: PayloadAction<{ key: keyof ProductFilters; value: string | null }>) => {
      const { key, value } = action.payload;
      // Ensure type safety by checking for each specific key
      if (key === 'category' || key === 'priceRange' || key === 'rating') {
        state.filters[key] = value;
      } else if (key === 'sort' && typeof value === 'string') {
        state.filters.sort = value;
      }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadProductImages.pending, (state) => {
        state.imageUpload.status = 'loading';
        state.imageUpload.error = null;
      })
      .addCase(uploadProductImages.fulfilled, (state, action) => {
        state.imageUpload.status = 'succeeded';
        state.imageUpload.uploadedImageUrls = action.payload.imageUrls;
      })
      .addCase(uploadProductImages.rejected, (state, action) => {
        state.imageUpload.status = 'failed';
        state.imageUpload.error = action.payload as string || 'An unknown error occurred';
      });
  }
});

// Selectors
export const selectFilters = (state: RootState) => state.products.filters;

// Export actions and reducer
export const { clearImageUploadState, setFilter, resetFilters } = productsSlice.actions;
export default productsSlice.reducer;