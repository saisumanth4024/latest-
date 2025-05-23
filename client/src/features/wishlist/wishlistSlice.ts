import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import type { RootState } from '@/app/store';
import type { CartItem } from '@/types/cart';

// Define wishlist item interface
export interface WishlistItem {
  id: string | number;
  productId: string | number;
  product: Partial<any>; // Using the same product type from cart
  variantId?: string | number;
  variant?: Partial<any>;
  addedAt: Date | string;
  notes?: string;
  isPublic: boolean; 
}

// Define wishlist interface
export interface Wishlist {
  id: string;
  userId?: string | number;
  name: string;
  items: WishlistItem[];
  isPublic: boolean;
  shareableLink?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Define wishlist state
export interface WishlistState {
  wishlists: Wishlist[];
  activeWishlistId: string | null;
  isLoading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
}

// Helper function to create a share link
const generateShareLink = (wishlistId: string): string => {
  return `${window.location.origin}/wishlist/shared/${wishlistId}`;
};

// Helper function to load wishlists from localStorage
const loadWishlistsFromStorage = (): Wishlist[] => {
  try {
    const storedWishlists = localStorage.getItem('wishlists');
    if (storedWishlists) {
      return JSON.parse(storedWishlists);
    }
    return [];
  } catch (error) {
    console.error('Failed to load wishlists from storage:', error);
    return [];
  }
};

// Helper function to save wishlists to localStorage
const saveWishlistsToStorage = (wishlists: Wishlist[]): void => {
  try {
    localStorage.setItem('wishlists', JSON.stringify(wishlists));
  } catch (error) {
    console.error('Failed to save wishlists to storage:', error);
  }
};

// Create default wishlist
const createDefaultWishlist = (): Wishlist => ({
  id: nanoid(),
  name: 'My Wishlist',
  items: [],
  isPublic: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Initial state
const initialState: WishlistState = {
  wishlists: loadWishlistsFromStorage(),
  activeWishlistId: null,
  isLoading: false,
  error: null,
  hasUnsavedChanges: false,
};

// Async thunk for syncing wishlists with server (for logged-in users)
export const syncWishlistsWithServer = createAsyncThunk(
  'wishlist/syncWithServer',
  async (userId: string | number, { getState, rejectWithValue }) => {
    try {
      const { wishlists } = (getState() as RootState).wishlist;

      // This would be an API call to sync wishlists with server
      // For now, simulate with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return wishlists with user ID
      return wishlists.map(wishlist => ({
        ...wishlist,
        userId,
        updatedAt: new Date(),
      }));
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create the wishlist slice
export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Initialize with default wishlist if none exist
    initializeWishlists: (state) => {
      if (state.wishlists.length === 0) {
        const defaultWishlist = createDefaultWishlist();
        state.wishlists.push(defaultWishlist);
        state.activeWishlistId = defaultWishlist.id;
        saveWishlistsToStorage(state.wishlists);
      } else if (!state.activeWishlistId && state.wishlists.length > 0) {
        state.activeWishlistId = state.wishlists[0].id;
      }
    },
    
    // Create a new wishlist
    createWishlist: (state, action: PayloadAction<{ name: string; isPublic?: boolean }>) => {
      const { name, isPublic = false } = action.payload;
      const newWishlist: Wishlist = {
        id: nanoid(),
        name,
        items: [],
        isPublic,
        shareableLink: isPublic ? generateShareLink(nanoid()) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      state.wishlists.push(newWishlist);
      state.activeWishlistId = newWishlist.id;
      state.hasUnsavedChanges = true;
      saveWishlistsToStorage(state.wishlists);
    },
    
    // Delete a wishlist
    deleteWishlist: (state, action: PayloadAction<string>) => {
      const wishlistId = action.payload;
      state.wishlists = state.wishlists.filter(list => list.id !== wishlistId);
      
      // If active wishlist was deleted, set a new active wishlist
      if (state.activeWishlistId === wishlistId) {
        state.activeWishlistId = state.wishlists.length > 0 ? state.wishlists[0].id : null;
      }
      
      state.hasUnsavedChanges = true;
      saveWishlistsToStorage(state.wishlists);
    },
    
    // Set active wishlist
    setActiveWishlist: (state, action: PayloadAction<string>) => {
      const wishlistId = action.payload;
      if (state.wishlists.some(list => list.id === wishlistId)) {
        state.activeWishlistId = wishlistId;
      }
    },
    
    // Update wishlist properties
    updateWishlist: (state, action: PayloadAction<{
      wishlistId: string;
      name?: string;
      isPublic?: boolean;
    }>) => {
      const { wishlistId, name, isPublic } = action.payload;
      const wishlistIndex = state.wishlists.findIndex(list => list.id === wishlistId);
      
      if (wishlistIndex >= 0) {
        const wishlist = state.wishlists[wishlistIndex];
        
        if (name !== undefined) {
          wishlist.name = name;
        }
        
        if (isPublic !== undefined) {
          wishlist.isPublic = isPublic;
          
          // Update shareable link based on public status
          if (isPublic && !wishlist.shareableLink) {
            wishlist.shareableLink = generateShareLink(wishlist.id as string);
          } else if (!isPublic) {
            wishlist.shareableLink = undefined;
          }
        }
        
        wishlist.updatedAt = new Date();
        state.hasUnsavedChanges = true;
        saveWishlistsToStorage(state.wishlists);
      }
    },
    
    // Add item to wishlist
    addToWishlist: (state, action: PayloadAction<{
      wishlistId?: string;
      item: Omit<WishlistItem, 'id' | 'addedAt' | 'isPublic'>;
    }>) => {
      const { wishlistId, item } = action.payload;
      const targetWishlistId = wishlistId || state.activeWishlistId;
      
      if (!targetWishlistId) {
        // Create default wishlist if none exists
        const defaultWishlist = createDefaultWishlist();
        state.wishlists.push(defaultWishlist);
        state.activeWishlistId = defaultWishlist.id;
        
        const newItem: WishlistItem = {
          id: nanoid(),
          addedAt: new Date(),
          isPublic: true,
          ...item,
        };
        
        defaultWishlist.items.push(newItem);
      } else {
        const wishlistIndex = state.wishlists.findIndex(list => list.id === targetWishlistId);
        
        if (wishlistIndex >= 0) {
          // Check for duplicate items
          const isDuplicate = state.wishlists[wishlistIndex].items.some(
            existingItem => existingItem.productId === item.productId && 
                          existingItem.variantId === item.variantId
          );
          
          if (!isDuplicate) {
            const newItem: WishlistItem = {
              id: nanoid(),
              addedAt: new Date(),
              isPublic: true,
              ...item,
            };
            
            state.wishlists[wishlistIndex].items.push(newItem);
            state.wishlists[wishlistIndex].updatedAt = new Date();
          }
        }
      }
      
      state.hasUnsavedChanges = true;
      saveWishlistsToStorage(state.wishlists);
    },
    
    // Remove item from wishlist
    removeFromWishlist: (state, action: PayloadAction<{
      wishlistId?: string;
      itemId: string | number;
    }>) => {
      const { wishlistId, itemId } = action.payload;
      const targetWishlistId = wishlistId || state.activeWishlistId;
      
      if (targetWishlistId) {
        const wishlistIndex = state.wishlists.findIndex(list => list.id === targetWishlistId);
        
        if (wishlistIndex >= 0) {
          state.wishlists[wishlistIndex].items = state.wishlists[wishlistIndex].items.filter(
            item => item.id !== itemId
          );
          state.wishlists[wishlistIndex].updatedAt = new Date();
          state.hasUnsavedChanges = true;
          saveWishlistsToStorage(state.wishlists);
        }
      }
    },
    
    // Move item from one wishlist to another
    moveItemBetweenWishlists: (state, action: PayloadAction<{
      fromWishlistId: string;
      toWishlistId: string;
      itemId: string | number;
    }>) => {
      const { fromWishlistId, toWishlistId, itemId } = action.payload;
      
      const fromWishlistIndex = state.wishlists.findIndex(list => list.id === fromWishlistId);
      const toWishlistIndex = state.wishlists.findIndex(list => list.id === toWishlistId);
      
      if (fromWishlistIndex >= 0 && toWishlistIndex >= 0) {
        const fromWishlist = state.wishlists[fromWishlistIndex];
        const toWishlist = state.wishlists[toWishlistIndex];
        
        // Find the item to move
        const itemIndex = fromWishlist.items.findIndex(item => item.id === itemId);
        
        if (itemIndex >= 0) {
          const itemToMove = { ...fromWishlist.items[itemIndex] };
          
          // Remove from source wishlist
          fromWishlist.items.splice(itemIndex, 1);
          fromWishlist.updatedAt = new Date();
          
          // Add to target wishlist
          toWishlist.items.push(itemToMove);
          toWishlist.updatedAt = new Date();
          
          state.hasUnsavedChanges = true;
          saveWishlistsToStorage(state.wishlists);
        }
      }
    },
    
    // Move item to cart
    moveToCart: (state, action: PayloadAction<{
      wishlistId?: string;
      itemId: string | number;
    }>) => {
      // This is handled in the cart slice, we just remove from wishlist here
      const { wishlistId, itemId } = action.payload;
      const targetWishlistId = wishlistId || state.activeWishlistId;
      
      if (targetWishlistId) {
        const wishlistIndex = state.wishlists.findIndex(list => list.id === targetWishlistId);
        
        if (wishlistIndex >= 0) {
          state.wishlists[wishlistIndex].items = state.wishlists[wishlistIndex].items.filter(
            item => item.id !== itemId
          );
          state.wishlists[wishlistIndex].updatedAt = new Date();
          state.hasUnsavedChanges = true;
          saveWishlistsToStorage(state.wishlists);
        }
      }
    },
    
    // Update an item in a wishlist
    updateWishlistItem: (state, action: PayloadAction<{
      wishlistId?: string;
      itemId: string | number;
      updates: Partial<WishlistItem>;
    }>) => {
      const { wishlistId, itemId, updates } = action.payload;
      const targetWishlistId = wishlistId || state.activeWishlistId;
      
      if (targetWishlistId) {
        const wishlistIndex = state.wishlists.findIndex(list => list.id === targetWishlistId);
        
        if (wishlistIndex >= 0) {
          const itemIndex = state.wishlists[wishlistIndex].items.findIndex(item => item.id === itemId);
          
          if (itemIndex >= 0) {
            state.wishlists[wishlistIndex].items[itemIndex] = {
              ...state.wishlists[wishlistIndex].items[itemIndex],
              ...updates,
            };
            state.wishlists[wishlistIndex].updatedAt = new Date();
            state.hasUnsavedChanges = true;
            saveWishlistsToStorage(state.wishlists);
          }
        }
      }
    },
    
    // Add item from cart to wishlist
    addFromCart: (state, action: PayloadAction<{
      wishlistId?: string;
      cartItem: CartItem;
    }>) => {
      const { wishlistId, cartItem } = action.payload;
      const targetWishlistId = wishlistId || state.activeWishlistId;
      
      if (!targetWishlistId) {
        // Create default wishlist if none exists
        const defaultWishlist = createDefaultWishlist();
        state.wishlists.push(defaultWishlist);
        state.activeWishlistId = defaultWishlist.id;
        
        const newItem: WishlistItem = {
          id: nanoid(),
          productId: cartItem.productId,
          product: cartItem.product,
          variantId: cartItem.variantId,
          variant: cartItem.variant,
          addedAt: new Date(),
          isPublic: true,
        };
        
        defaultWishlist.items.push(newItem);
      } else {
        const wishlistIndex = state.wishlists.findIndex(list => list.id === targetWishlistId);
        
        if (wishlistIndex >= 0) {
          // Check for duplicate items
          const isDuplicate = state.wishlists[wishlistIndex].items.some(
            item => item.productId === cartItem.productId && 
                   item.variantId === cartItem.variantId
          );
          
          if (!isDuplicate) {
            const newItem: WishlistItem = {
              id: nanoid(),
              productId: cartItem.productId,
              product: cartItem.product,
              variantId: cartItem.variantId,
              variant: cartItem.variant,
              addedAt: new Date(),
              isPublic: true,
            };
            
            state.wishlists[wishlistIndex].items.push(newItem);
            state.wishlists[wishlistIndex].updatedAt = new Date();
          }
        }
      }
      
      state.hasUnsavedChanges = true;
      saveWishlistsToStorage(state.wishlists);
    },
    
    // Generate new shareable link for a wishlist
    regenerateShareableLink: (state, action: PayloadAction<string>) => {
      const wishlistId = action.payload;
      const wishlistIndex = state.wishlists.findIndex(list => list.id === wishlistId);
      
      if (wishlistIndex >= 0 && state.wishlists[wishlistIndex].isPublic) {
        state.wishlists[wishlistIndex].shareableLink = generateShareLink(wishlistId);
        state.wishlists[wishlistIndex].updatedAt = new Date();
        state.hasUnsavedChanges = true;
        saveWishlistsToStorage(state.wishlists);
      }
    },
  },
  extraReducers: (builder) => {
    // Syncing wishlists with server
    builder.addCase(syncWishlistsWithServer.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(syncWishlistsWithServer.fulfilled, (state, action) => {
      state.isLoading = false;
      
      if (action.payload) {
        state.wishlists = action.payload;
        saveWishlistsToStorage(state.wishlists);
      }
      
      state.hasUnsavedChanges = false;
    });
    builder.addCase(syncWishlistsWithServer.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to sync wishlists';
    });
  },
});

// Export actions
export const {
  initializeWishlists,
  createWishlist,
  deleteWishlist,
  setActiveWishlist,
  updateWishlist,
  addToWishlist,
  removeFromWishlist,
  moveItemBetweenWishlists,
  moveToCart,
  updateWishlistItem,
  addFromCart,
  regenerateShareableLink,
} = wishlistSlice.actions;

// Export selectors
export const selectWishlists = (state: RootState) => state.wishlist.wishlists;
export const selectActiveWishlistId = (state: RootState) => state.wishlist.activeWishlistId;
export const selectActiveWishlist = (state: RootState) => {
  const activeId = state.wishlist.activeWishlistId;
  return activeId ? state.wishlist.wishlists.find(list => list.id === activeId) : null;
};
export const selectWishlistById = (state: RootState, id: string) => 
  state.wishlist.wishlists.find(list => list.id === id) || null;
export const selectWishlistItems = (state: RootState, wishlistId?: string) => {
  const targetId = wishlistId || state.wishlist.activeWishlistId;
  if (!targetId) return [];
  
  const wishlist = state.wishlist.wishlists.find(list => list.id === targetId);
  return wishlist ? wishlist.items : [];
};
export const selectIsWishlistLoading = (state: RootState) => state.wishlist.isLoading;
export const selectWishlistError = (state: RootState) => state.wishlist.error;
export const selectTotalWishlistItems = (state: RootState) => 
  state.wishlist.wishlists.reduce((total, list) => total + list.items.length, 0);

export default wishlistSlice.reducer;