import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UploadedImage } from './components/ImageUploader';

// Define the state type
interface ProductsState {
  imageUpload: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    uploadedImageUrls: string[];
  };
}

// Define the initial state
const initialState: ProductsState = {
  imageUpload: {
    status: 'idle',
    error: null,
    uploadedImageUrls: [],
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

// Export actions and reducer
export const { clearImageUploadState } = productsSlice.actions;
export default productsSlice.reducer;