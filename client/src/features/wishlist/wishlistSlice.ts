import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { Product } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Define types for wishlist items and wishlists
export interface WishlistItem {
  id: string;
  productId: string | number;
  variantId?: string | number;
  product: Partial<Product>;
  variant?: Partial<any>;
  addedAt: string;
  notes?: string;
}

export interface Wishlist {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  isPublic: boolean;
  shareUrl?: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

interface WishlistState {
  wishlists: Wishlist[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  activeWishlistId?: string;
}

// Async thunk for fetching wishlists
export const fetchWishlists = createAsyncThunk(
  'wishlist/fetchWishlists',
  async (_, { rejectWithValue }) => {
    try {
      // For demo purposes, we'll retrieve from localStorage or create a default wishlist
      const storedWishlists = localStorage.getItem('wishlists');
      if (storedWishlists) {
        return JSON.parse(storedWishlists) as Wishlist[];
      }
      
      // Create a default wishlist
      const defaultWishlist: Wishlist = {
        id: uuidv4(),
        name: 'My Wishlist',
        description: 'Default wishlist',
        isDefault: true,
        isPublic: false,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('wishlists', JSON.stringify([defaultWishlist]));
      return [defaultWishlist];
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Initial state
const initialState: WishlistState = {
  wishlists: [],
  status: 'idle',
  error: null,
  activeWishlistId: undefined
};

// Create the wishlist slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Set active wishlist
    setActiveWishlist: (state, action: PayloadAction<string>) => {
      state.activeWishlistId = action.payload;
    },
    // Add item to wishlist
    addToWishlist: (state, action: PayloadAction<{
      wishlistId: string;
      productId: string | number;
      variantId?: string | number;
      product: Partial<Product>;
      variant?: Partial<any>;
      notes?: string;
    }>) => {
      const { wishlistId, productId, variantId, product, variant, notes } = action.payload;
      const wishlistIndex = state.wishlists.findIndex(list => list.id === wishlistId);
      
      if (wishlistIndex !== -1) {
        // Check if the item already exists in this wishlist
        const existingItemIndex = state.wishlists[wishlistIndex].items.findIndex(
          item => item.productId === productId && item.variantId === variantId
        );
        
        // If the item doesn't exist, add it
        if (existingItemIndex === -1) {
          const newItem: WishlistItem = {
            id: uuidv4(),
            productId,
            variantId,
            product,
            variant,
            notes,
            addedAt: new Date().toISOString()
          };
          
          state.wishlists[wishlistIndex].items.push(newItem);
          state.wishlists[wishlistIndex].updatedAt = new Date().toISOString();
          
          // Update localStorage
          localStorage.setItem('wishlists', JSON.stringify(state.wishlists));
        }
      }
    },
    
    // Remove item from wishlist
    removeFromWishlist: (state, action: PayloadAction<{
      wishlistId: string;
      itemId: string;
    }>) => {
      const { wishlistId, itemId } = action.payload;
      const wishlistIndex = state.wishlists.findIndex(list => list.id === wishlistId);
      
      if (wishlistIndex !== -1) {
        state.wishlists[wishlistIndex].items = state.wishlists[wishlistIndex].items.filter(
          item => item.id !== itemId
        );
        state.wishlists[wishlistIndex].updatedAt = new Date().toISOString();
        
        // Update localStorage
        localStorage.setItem('wishlists', JSON.stringify(state.wishlists));
      }
    },
    
    // Create new wishlist
    createWishlist: (state, action: PayloadAction<{
      name: string;
      description?: string;
      isPublic?: boolean;
    }>) => {
      const { name, description, isPublic = false } = action.payload;
      
      const newWishlist: Wishlist = {
        id: uuidv4(),
        name,
        description,
        isDefault: state.wishlists.length === 0,
        isPublic,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      state.wishlists.push(newWishlist);
      
      // Update localStorage
      localStorage.setItem('wishlists', JSON.stringify(state.wishlists));
    },
    
    // Update wishlist settings
    updateWishlist: (state, action: PayloadAction<{
      wishlistId: string;
      name?: string;
      description?: string;
      isPublic?: boolean;
    }>) => {
      const { wishlistId, name, description, isPublic } = action.payload;
      const wishlistIndex = state.wishlists.findIndex(list => list.id === wishlistId);
      
      if (wishlistIndex !== -1) {
        if (name !== undefined) {
          state.wishlists[wishlistIndex].name = name;
        }
        
        if (description !== undefined) {
          state.wishlists[wishlistIndex].description = description;
        }
        
        if (isPublic !== undefined) {
          state.wishlists[wishlistIndex].isPublic = isPublic;
        }
        
        state.wishlists[wishlistIndex].updatedAt = new Date().toISOString();
        
        // Update localStorage
        localStorage.setItem('wishlists', JSON.stringify(state.wishlists));
      }
    },
    
    // Delete wishlist
    deleteWishlist: (state, action: PayloadAction<string>) => {
      const wishlistId = action.payload;
      const wishlistIndex = state.wishlists.findIndex(list => list.id === wishlistId);
      
      if (wishlistIndex !== -1) {
        // Don't delete if it's the only wishlist
        if (state.wishlists.length > 1) {
          // If deleting the default wishlist, make another one default
          if (state.wishlists[wishlistIndex].isDefault && state.wishlists.length > 1) {
            const newDefaultIndex = wishlistIndex === 0 ? 1 : 0;
            state.wishlists[newDefaultIndex].isDefault = true;
          }
          
          // Remove the wishlist
          state.wishlists = state.wishlists.filter(list => list.id !== wishlistId);
          
          // Update localStorage
          localStorage.setItem('wishlists', JSON.stringify(state.wishlists));
        }
      }
    },
    
    // Set default wishlist
    setDefaultWishlist: (state, action: PayloadAction<string>) => {
      const wishlistId = action.payload;
      
      // Reset all to non-default
      state.wishlists.forEach(list => {
        list.isDefault = false;
      });
      
      // Set the new default
      const wishlistIndex = state.wishlists.findIndex(list => list.id === wishlistId);
      if (wishlistIndex !== -1) {
        state.wishlists[wishlistIndex].isDefault = true;
        
        // Update localStorage
        localStorage.setItem('wishlists', JSON.stringify(state.wishlists));
      }
    },
    
    // Update item notes
    updateItemNotes: (state, action: PayloadAction<{
      wishlistId: string;
      itemId: string;
      notes: string;
    }>) => {
      const { wishlistId, itemId, notes } = action.payload;
      const wishlistIndex = state.wishlists.findIndex(list => list.id === wishlistId);
      
      if (wishlistIndex !== -1) {
        const itemIndex = state.wishlists[wishlistIndex].items.findIndex(
          item => item.id === itemId
        );
        
        if (itemIndex !== -1) {
          state.wishlists[wishlistIndex].items[itemIndex].notes = notes;
          state.wishlists[wishlistIndex].updatedAt = new Date().toISOString();
          
          // Update localStorage
          localStorage.setItem('wishlists', JSON.stringify(state.wishlists));
        }
      }
    },
    
    // Move item between wishlists
    moveItem: (state, action: PayloadAction<{
      fromWishlistId: string;
      toWishlistId: string;
      itemId: string;
    }>) => {
      const { fromWishlistId, toWishlistId, itemId } = action.payload;
      
      // Find source and target wishlists
      const sourceIndex = state.wishlists.findIndex(list => list.id === fromWishlistId);
      const targetIndex = state.wishlists.findIndex(list => list.id === toWishlistId);
      
      if (sourceIndex !== -1 && targetIndex !== -1 && fromWishlistId !== toWishlistId) {
        // Find the item in the source wishlist
        const itemIndex = state.wishlists[sourceIndex].items.findIndex(
          item => item.id === itemId
        );
        
        if (itemIndex !== -1) {
          // Get the item
          const item = { ...state.wishlists[sourceIndex].items[itemIndex] };
          
          // Check if the item already exists in the target wishlist
          const existingInTarget = state.wishlists[targetIndex].items.findIndex(
            i => i.productId === item.productId && i.variantId === item.variantId
          );
          
          // Only move if the item doesn't exist in the target
          if (existingInTarget === -1) {
            // Remove from source
            state.wishlists[sourceIndex].items.splice(itemIndex, 1);
            state.wishlists[sourceIndex].updatedAt = new Date().toISOString();
            
            // Add to target
            state.wishlists[targetIndex].items.push(item);
            state.wishlists[targetIndex].updatedAt = new Date().toISOString();
            
            // Update localStorage
            localStorage.setItem('wishlists', JSON.stringify(state.wishlists));
          }
        }
      }
    },
    
    // Clear wishlist
    clearWishlist: (state, action: PayloadAction<string>) => {
      const wishlistId = action.payload;
      const wishlistIndex = state.wishlists.findIndex(list => list.id === wishlistId);
      
      if (wishlistIndex !== -1) {
        state.wishlists[wishlistIndex].items = [];
        state.wishlists[wishlistIndex].updatedAt = new Date().toISOString();
        
        // Update localStorage
        localStorage.setItem('wishlists', JSON.stringify(state.wishlists));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlists.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wishlists = action.payload;
        state.error = null;
      })
      .addCase(fetchWishlists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

// Export actions
export const {
  addToWishlist,
  removeFromWishlist,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  setDefaultWishlist,
  updateItemNotes,
  moveItem,
  clearWishlist,
  setActiveWishlist
} = wishlistSlice.actions;

// Initialize wishlists (middleware action for app start)
export const initializeWishlists = () => (dispatch: any) => {
  dispatch(fetchWishlists());
};

// Generate a shareable link for a wishlist
export const regenerateShareableLink = (wishlistId: string) => (dispatch: any, getState: () => RootState) => {
  const state = getState();
  const wishlist = state.wishlist.wishlists.find(list => list.id === wishlistId);
  
  if (wishlist) {
    const shareUrl = `${window.location.origin}/wishlist/shared/${wishlistId}?t=${Date.now()}`;
    
    dispatch(updateWishlist({
      wishlistId,
      name: wishlist.name,
      description: wishlist.description,
      isPublic: true
    }));
    
    return shareUrl;
  }
  
  return null;
};

// Set active wishlist
export const setActiveWishlist = (wishlistId: string) => ({
  type: 'wishlist/setActiveWishlist',
  payload: wishlistId
});

// Selectors
export const selectWishlists = (state: RootState) => state.wishlist.wishlists;
export const selectDefaultWishlist = (state: RootState) => 
  state.wishlist.wishlists.find(list => list.isDefault);
export const selectWishlistById = (id: string) => (state: RootState) => 
  state.wishlist.wishlists.find(list => list.id === id);
export const selectWishlistStatus = (state: RootState) => state.wishlist.status;
export const selectWishlistError = (state: RootState) => state.wishlist.error;
export const selectActiveWishlistId = (state: RootState) => 
  state.wishlist.activeWishlistId || state.wishlist.wishlists.find(list => list.isDefault)?.id;
export const selectActiveWishlist = (state: RootState) => {
  const activeId = selectActiveWishlistId(state);
  return state.wishlist.wishlists.find(list => list.id === activeId);
};
export const selectIsWishlistLoading = (state: RootState) => state.wishlist.status === 'loading';

// Export reducer
export default wishlistSlice.reducer;