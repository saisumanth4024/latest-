import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
// Use a more specific product type or create a basic interface
interface Product {
  id: string | number;
  name?: string;
  price?: number;
  sku?: string;
  imageUrl?: string;
  isDigital?: boolean;
  requiresShipping?: boolean;
  [key: string]: any;
}
import { v4 as uuidv4 } from 'uuid';

// Define types for wishlist items and wishlists
export interface WishlistItem {
  id: string;
  productId: string | number;
  variantId?: string | number;
  product: Partial<Product>;
  variant?: Partial<any>;
  addedAt: string;
}

export interface Wishlist {
  id: string | number;
  name: string;
  items: WishlistItem[];
  isPublic: boolean;
  shareableLink?: string;
  createdAt: string;
  updatedAt: string;
}

// Define wishlist state
interface WishlistState {
  wishlists: Wishlist[];
  activeWishlistId: string | null;
  isLoading: boolean;
  error: string | null;
}

// Initialize wishlist state
const initialState: WishlistState = {
  wishlists: [],
  activeWishlistId: null,
  isLoading: false,
  error: null,
};

// Generate a shareable link
const generateShareableLink = (wishlistId: string) => {
  return `${window.location.origin}/shared-wishlist/${wishlistId}`;
};

// Thunks for async operations

// Initialize wishlists (load from localStorage or server)
export const initializeWishlists = createAsyncThunk(
  'wishlist/initialize',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, you'd fetch from API for logged-in users
      // For now, we'll use localStorage
      const savedWishlists = localStorage.getItem('wishlists');
      
      if (savedWishlists) {
        return JSON.parse(savedWishlists) as Wishlist[];
      }
      
      // If no saved wishlists, create a default one
      const defaultWishlist: Wishlist = {
        id: uuidv4(),
        name: 'My Wishlist',
        items: [],
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return [defaultWishlist];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load wishlists');
    }
  }
);

// Create the wishlist slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Set active wishlist
    setActiveWishlist: (state, action: PayloadAction<string>) => {
      state.activeWishlistId = action.payload;
    },
    
    // Create a new wishlist
    createWishlist: (state, action: PayloadAction<{ name: string }>) => {
      const newWishlist: Wishlist = {
        id: uuidv4(),
        name: action.payload.name,
        items: [],
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      state.wishlists.push(newWishlist);
      state.activeWishlistId = newWishlist.id as string;
      
      // Save to localStorage
      localStorage.setItem('wishlists', JSON.stringify(state.wishlists));
    },
    
    // Update wishlist settings
    updateWishlist: (state, action: PayloadAction<{
      wishlistId: string;
      name: string;
      isPublic: boolean;
    }>) => {
      const { wishlistId, name, isPublic } = action.payload;
      const wishlist = state.wishlists.find(w => w.id === wishlistId);
      
      if (wishlist) {
        wishlist.name = name;
        
        // If wishlist is becoming public, generate a shareable link if it doesn't have one
        if (isPublic && !wishlist.isPublic && !wishlist.shareableLink) {
          wishlist.shareableLink = generateShareableLink(wishlistId);
        }
        
        wishlist.isPublic = isPublic;
        wishlist.updatedAt = new Date().toISOString();
        
        // Save to localStorage
        localStorage.setItem('wishlists', JSON.stringify(state.wishlists));
      }
    },
    
    // Delete a wishlist
    deleteWishlist: (state, action: PayloadAction<string>) => {
      const wishlistId = action.payload;
      const index = state.wishlists.findIndex(w => w.id === wishlistId);
      
      if (index !== -1) {
        state.wishlists.splice(index, 1);
        
        // If the deleted wishlist was the active one, set a new active wishlist
        if (state.activeWishlistId === wishlistId) {
          state.activeWishlistId = state.wishlists.length > 0 ? state.wishlists[0].id as string : null;
        }
        
        // Save to localStorage
        localStorage.setItem('wishlists', JSON.stringify(state.wishlists));
      }
    },
    
    // Add item to wishlist
    addToWishlist: (state, action: PayloadAction<{
      wishlistId: string;
      item: Omit<WishlistItem, 'id'>;
    }>) => {
      const { wishlistId, item } = action.payload;
      const wishlist = state.wishlists.find(w => w.id === wishlistId);
      
      if (wishlist) {
        // Check if item already exists in wishlist
        const existingItemIndex = wishlist.items.findIndex(
          i => i.productId === item.productId && 
               ((!i.variantId && !item.variantId) || i.variantId === item.variantId)
        );
        
        if (existingItemIndex === -1) {
          // Add new item to wishlist
          const newItem: WishlistItem = {
            ...item,
            id: uuidv4(),
            addedAt: new Date().toISOString(),
          };
          
          wishlist.items.push(newItem);
          wishlist.updatedAt = new Date().toISOString();
          
          // Save to localStorage
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
      const wishlist = state.wishlists.find(w => w.id === wishlistId);
      
      if (wishlist) {
        const index = wishlist.items.findIndex(item => item.id === itemId);
        
        if (index !== -1) {
          wishlist.items.splice(index, 1);
          wishlist.updatedAt = new Date().toISOString();
          
          // Save to localStorage
          localStorage.setItem('wishlists', JSON.stringify(state.wishlists));
        }
      }
    },
    
    // Move to cart (used when an item is moved from wishlist to cart)
    moveToCart: (state, action: PayloadAction<{
      wishlistId: string;
      itemId: string;
    }>) => {
      const { wishlistId, itemId } = action.payload;
      const wishlist = state.wishlists.find(w => w.id === wishlistId);
      
      if (wishlist) {
        const index = wishlist.items.findIndex(item => item.id === itemId);
        
        if (index !== -1) {
          wishlist.items.splice(index, 1);
          wishlist.updatedAt = new Date().toISOString();
          
          // Save to localStorage
          localStorage.setItem('wishlists', JSON.stringify(state.wishlists));
        }
      }
    },
    
    // Regenerate shareable link
    regenerateShareableLink: (state, action: PayloadAction<string>) => {
      const wishlistId = action.payload;
      const wishlist = state.wishlists.find(w => w.id === wishlistId);
      
      if (wishlist && wishlist.isPublic) {
        wishlist.shareableLink = generateShareableLink(wishlistId);
        wishlist.updatedAt = new Date().toISOString();
        
        // Save to localStorage
        localStorage.setItem('wishlists', JSON.stringify(state.wishlists));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeWishlists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeWishlists.fulfilled, (state, action) => {
        state.wishlists = action.payload;
        state.activeWishlistId = action.payload.length > 0 ? action.payload[0].id as string : null;
        state.isLoading = false;
      })
      .addCase(initializeWishlists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setActiveWishlist,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
  regenerateShareableLink,
} = wishlistSlice.actions;

// Export selectors
export const selectWishlists = (state: RootState) => state.wishlist.wishlists;
export const selectActiveWishlistId = (state: RootState) => state.wishlist.activeWishlistId;
export const selectActiveWishlist = (state: RootState) => {
  return state.wishlist.activeWishlistId 
    ? state.wishlist.wishlists.find(w => w.id === state.wishlist.activeWishlistId)
    : undefined;
};
export const selectIsWishlistLoading = (state: RootState) => state.wishlist.isLoading;
export const selectWishlistError = (state: RootState) => state.wishlist.error;

// Export reducer
export default wishlistSlice.reducer;