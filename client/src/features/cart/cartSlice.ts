import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import type { RootState } from '@/app/store';
import type { Cart, CartItem, CartCoupon } from '@/types/cart';

// Define a cart state interface
export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  mergeInProgress: boolean;
  hasUnsavedChanges: boolean;
  appliedPromoCode: string | null;
  isPromoCodeValid: boolean | null;
  promoCodeError: string | null;
}

// Create initial cart structure
const createEmptyCart = (): Cart => ({
  id: nanoid(),
  items: [],
  totals: {
    subtotal: 0,
    discountTotal: 0,
    taxTotal: 0,
    shippingTotal: 0,
    total: 0,
    currency: 'USD',
  },
  coupons: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  isDigitalOnly: true,
  convertedToOrder: false,
});

// Helper function to load cart from localStorage
const loadCartFromStorage = (): Cart | null => {
  try {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      return JSON.parse(storedCart);
    }
    return null;
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
    return null;
  }
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cart: Cart): void => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
};

// Define initial state
const initialState: CartState = {
  cart: loadCartFromStorage() || null,
  isLoading: false,
  error: null,
  mergeInProgress: false,
  hasUnsavedChanges: false,
  appliedPromoCode: null,
  isPromoCodeValid: null,
  promoCodeError: null,
};

// Helper function to recalculate cart totals
const recalculateCartTotals = (cart: Cart): Cart => {
  // Calculate subtotal from items
  const subtotal = cart.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  
  // Calculate discount total from coupons and item discounts
  const itemDiscounts = cart.items.reduce((sum, item) => sum + (item.discountTotal || 0), 0);
  const couponDiscounts = cart.coupons.reduce((sum, coupon) => sum + (coupon.discountAmount || 0), 0);
  const discountTotal = itemDiscounts + couponDiscounts;
  
  // Apply shipping costs if available
  const shippingTotal = cart.selectedShipping?.cost || 0;
  
  // Simple tax calculation (could be more complex in real system)
  const taxableAmount = subtotal - discountTotal;
  const taxRate = 0.07; // Example tax rate (7%)
  const taxTotal = cart.isDigitalOnly ? 0 : Math.round((taxableAmount * taxRate) * 100) / 100;
  
  // Calculate total
  const total = Math.max(0, subtotal - discountTotal + shippingTotal + taxTotal);
  
  return {
    ...cart,
    totals: {
      ...cart.totals,
      subtotal,
      discountTotal,
      taxTotal,
      shippingTotal,
      total,
    },
    isDigitalOnly: cart.items.every(item => item.isDigital),
  };
};

// Async thunk for syncing cart with server (for logged-in users)
export const syncCartWithServer = createAsyncThunk(
  'cart/syncWithServer',
  async (userId: string | number, { getState, rejectWithValue }) => {
    try {
      const { cart } = (getState() as RootState).cart;
      if (!cart) return null;

      // Send cart to server and get back potentially merged cart
      // This is where you'd make an API call to your backend
      // For now we'll just simulate this by returning the same cart with the userId
      
      // Mock API response with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        ...cart,
        userId,
        updatedAt: new Date(),
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for applying a promo code
export const applyPromoCode = createAsyncThunk(
  'cart/applyPromoCode',
  async (code: string, { getState, rejectWithValue }) => {
    try {
      const { cart } = (getState() as RootState).cart;
      if (!cart) return rejectWithValue('No active cart');

      // Validate promo code (this would be an API call in a real app)
      // For now, let's simulate some validation logic
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Accept some demo codes
      const validCodes = ['WELCOME10', 'SAVE20', 'FREESHIP'];
      if (!validCodes.includes(code)) {
        return rejectWithValue('Invalid or expired promo code');
      }
      
      // Create coupon based on the code
      const newCoupon: CartCoupon = {
        code,
        type: code === 'FREESHIP' ? 'free_shipping' : 'percentage',
        value: code === 'WELCOME10' ? 10 : 20,
        discountAmount: 0, // Will be calculated
        appliedAt: new Date(),
        description: code === 'FREESHIP' 
          ? 'Free shipping on your order'
          : `${code === 'WELCOME10' ? '10%' : '20%'} off your order`,
      };
      
      // Calculate discount amount
      const subtotal = cart.totals.subtotal;
      if (newCoupon.type === 'percentage') {
        newCoupon.discountAmount = Math.round((subtotal * (newCoupon.value / 100)) * 100) / 100;
      } else if (newCoupon.type === 'free_shipping') {
        newCoupon.discountAmount = cart.totals.shippingTotal;
      }
      
      return newCoupon;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create the cart slice
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Initialize cart if it doesn't exist
    initializeCart: (state) => {
      if (!state.cart) {
        state.cart = createEmptyCart();
        saveCartToStorage(state.cart);
      }
    },
    
    // Add item to cart
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'id' | 'subtotal' | 'total' | 'addedAt' | 'updatedAt'>>) => {
      // Initialize cart if needed
      if (!state.cart) {
        state.cart = createEmptyCart();
      }
      
      const { productId, variantId, quantity, unitPrice, ...itemData } = action.payload;
      
      // Check if item already exists in cart
      const existingItemIndex = state.cart.items.findIndex(item => 
        item.productId === productId && 
        ((!variantId && !item.variantId) || (variantId && item.variantId === variantId))
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const existingItem = state.cart.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        state.cart.items[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          subtotal: unitPrice * newQuantity,
          total: unitPrice * newQuantity - (existingItem.discountTotal || 0),
          updatedAt: new Date(),
        };
      } else {
        // Add new item
        const subtotal = unitPrice * quantity;
        
        const newItem: CartItem = {
          id: nanoid(),
          productId,
          variantId,
          quantity,
          unitPrice,
          subtotal,
          discountTotal: 0,
          total: subtotal,
          addedAt: new Date(),
          updatedAt: new Date(),
          ...itemData,
        };
        
        state.cart.items.push(newItem);
      }
      
      // Recalculate totals
      state.cart = recalculateCartTotals(state.cart);
      state.hasUnsavedChanges = true;
      
      // Save to localStorage
      if (state.cart) {
        saveCartToStorage(state.cart);
      }
    },
    
    // Update item quantity in cart
    updateCartItemQuantity: (state, action: PayloadAction<{
      itemId: string | number;
      quantity: number;
    }>) => {
      if (!state.cart) return;
      
      const { itemId, quantity } = action.payload;
      const itemIndex = state.cart.items.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        const item = state.cart.items[itemIndex];
        
        if (quantity <= 0) {
          // Remove item if quantity is zero or negative
          state.cart.items.splice(itemIndex, 1);
        } else {
          // Update quantity
          state.cart.items[itemIndex] = {
            ...item,
            quantity,
            subtotal: item.unitPrice * quantity,
            total: (item.unitPrice * quantity) - (item.discountTotal || 0),
            updatedAt: new Date(),
          };
        }
        
        // Recalculate totals
        state.cart = recalculateCartTotals(state.cart);
        state.hasUnsavedChanges = true;
        
        // Save to localStorage
        saveCartToStorage(state.cart);
      }
    },
    
    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      if (!state.cart) return;
      
      const itemId = action.payload;
      state.cart.items = state.cart.items.filter(item => item.id !== itemId);
      
      // Recalculate totals
      state.cart = recalculateCartTotals(state.cart);
      state.hasUnsavedChanges = true;
      
      // Save to localStorage
      if (state.cart) {
        saveCartToStorage(state.cart);
      }
    },
    
    // Clear the entire cart
    clearCart: (state) => {
      state.cart = createEmptyCart();
      state.hasUnsavedChanges = true;
      
      // Save to localStorage
      saveCartToStorage(state.cart);
    },
    
    // Remove a coupon from the cart
    removeCoupon: (state, action: PayloadAction<string>) => {
      if (!state.cart) return;
      
      const couponCode = action.payload;
      state.cart.coupons = state.cart.coupons.filter(coupon => coupon.code !== couponCode);
      
      // Reset promo code state if it matches the removed coupon
      if (state.appliedPromoCode === couponCode) {
        state.appliedPromoCode = null;
        state.isPromoCodeValid = null;
        state.promoCodeError = null;
      }
      
      // Recalculate totals
      state.cart = recalculateCartTotals(state.cart);
      state.hasUnsavedChanges = true;
      
      // Save to localStorage
      if (state.cart) {
        saveCartToStorage(state.cart);
      }
    },
    
    // Move item to wishlist (this just removes it from cart, actual addition happens in wishlistSlice)
    moveToWishlist: (state, action: PayloadAction<string | number>) => {
      if (!state.cart) return;
      
      const itemId = action.payload;
      state.cart.items = state.cart.items.filter(item => item.id !== itemId);
      
      // Recalculate totals
      state.cart = recalculateCartTotals(state.cart);
      state.hasUnsavedChanges = true;
      
      // Save to localStorage
      if (state.cart) {
        saveCartToStorage(state.cart);
      }
    },
    
    // Save for later (moved to a separate "saved items" list)
    saveForLater: (state, action: PayloadAction<string | number>) => {
      // This would normally move items to a separate "saved for later" list
      // For now, we'll just remove from cart since we're implementing this in the wishlistSlice
      if (!state.cart) return;
      
      const itemId = action.payload;
      state.cart.items = state.cart.items.filter(item => item.id !== itemId);
      
      // Recalculate totals
      state.cart = recalculateCartTotals(state.cart);
      state.hasUnsavedChanges = true;
      
      // Save to localStorage
      if (state.cart) {
        saveCartToStorage(state.cart);
      }
    },
    
    // Clear promo code state
    clearPromoCode: (state) => {
      state.appliedPromoCode = null;
      state.isPromoCodeValid = null;
      state.promoCodeError = null;
    },
  },
  extraReducers: (builder) => {
    // Syncing cart with server
    builder.addCase(syncCartWithServer.pending, (state) => {
      state.isLoading = true;
      state.mergeInProgress = true;
      state.error = null;
    });
    builder.addCase(syncCartWithServer.fulfilled, (state, action) => {
      state.isLoading = false;
      state.mergeInProgress = false;
      
      if (action.payload) {
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      }
      
      state.hasUnsavedChanges = false;
    });
    builder.addCase(syncCartWithServer.rejected, (state, action) => {
      state.isLoading = false;
      state.mergeInProgress = false;
      state.error = action.payload as string || 'Failed to sync cart';
    });
    
    // Applying promo code
    builder.addCase(applyPromoCode.pending, (state) => {
      state.isLoading = true;
      state.promoCodeError = null;
      state.isPromoCodeValid = null;
    });
    builder.addCase(applyPromoCode.fulfilled, (state, action) => {
      state.isLoading = false;
      
      if (state.cart && action.meta.arg) {
        // Add the coupon to cart
        const newCoupon = action.payload as CartCoupon;
        
        // Remove any existing coupon with the same code
        state.cart.coupons = state.cart.coupons.filter(coupon => coupon.code !== newCoupon.code);
        
        // Add new coupon
        state.cart.coupons.push(newCoupon);
        
        // Update promo code state
        state.appliedPromoCode = newCoupon.code;
        state.isPromoCodeValid = true;
        
        // Recalculate totals
        state.cart = recalculateCartTotals(state.cart);
        saveCartToStorage(state.cart);
      }
    });
    builder.addCase(applyPromoCode.rejected, (state, action) => {
      state.isLoading = false;
      state.promoCodeError = action.payload as string || 'Failed to apply promo code';
      state.isPromoCodeValid = false;
    });
  },
});

// Export actions
export const {
  initializeCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  removeCoupon,
  moveToWishlist,
  saveForLater,
  clearPromoCode,
} = cartSlice.actions;

// Export selectors
export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartItems = (state: RootState) => state.cart.cart?.items || [];
export const selectCartTotals = (state: RootState) => state.cart.cart?.totals;
export const selectCartItemCount = (state: RootState) => 
  state.cart.cart?.items.reduce((count, item) => count + item.quantity, 0) || 0;
export const selectCartIsEmpty = (state: RootState) => 
  !state.cart.cart || state.cart.cart.items.length === 0;
export const selectCartIsLoading = (state: RootState) => state.cart.isLoading;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;