import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem, CartCoupon } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Define types for cart slice state
interface CartState {
  cart: Cart | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  savedItems: CartItem[];
}

// Helper function to calculate item subtotal and total
const calculateItemTotals = (item: CartItem): CartItem => {
  const subtotal = item.unitPrice * item.quantity;
  const total = subtotal - item.discountTotal;
  return {
    ...item,
    subtotal,
    total
  };
};

// Helper function to recalculate cart totals
const recalculateCartTotals = (cart: Cart): Cart => {
  const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  const discountTotal = cart.items.reduce((sum, item) => sum + item.discountTotal, 0) +
    (cart.coupons.reduce((sum, coupon) => sum + coupon.discountAmount, 0));
  
  // Calculate tax (simplified - in real app would be more complex)
  const taxRate = 0.08; // 8% tax rate
  const taxableAmount = subtotal - discountTotal;
  const taxTotal = cart.isDigitalOnly ? 0 : taxableAmount * taxRate;
  
  // Shipping calculation (simplified)
  let shippingTotal = 0;
  if (!cart.isDigitalOnly && cart.selectedShipping) {
    shippingTotal = cart.selectedShipping.cost;
  }
  
  const total = subtotal - discountTotal + taxTotal + shippingTotal;
  
  return {
    ...cart,
    totals: {
      subtotal,
      discountTotal,
      taxTotal,
      shippingTotal,
      total,
      currency: 'USD'
    }
  };
};

// Async thunk for fetching cart data
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      // For demo purposes, retrieve from localStorage or create a new cart
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        return JSON.parse(storedCart) as Cart;
      }
      
      // Create a new cart
      const newCart: Cart = {
        id: uuidv4(),
        items: [],
        totals: {
          subtotal: 0,
          discountTotal: 0,
          taxTotal: 0,
          shippingTotal: 0,
          total: 0,
          currency: 'USD'
        },
        coupons: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDigitalOnly: true,
        convertedToOrder: false
      };
      
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Initial state
const initialState: CartState = {
  cart: null,
  status: 'idle',
  error: null,
  savedItems: []
};

// Create the cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'id' | 'subtotal' | 'total' | 'addedAt' | 'updatedAt'>>) => {
      if (!state.cart) return;
      
      const newItem: CartItem = {
        ...action.payload,
        id: uuidv4(),
        subtotal: action.payload.unitPrice * action.payload.quantity,
        total: (action.payload.unitPrice * action.payload.quantity) - action.payload.discountTotal,
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Update digital-only flag
      state.cart.isDigitalOnly = state.cart.isDigitalOnly && newItem.isDigital;
      
      // Add item to cart
      state.cart.items.push(newItem);
      
      // Recalculate totals
      state.cart = recalculateCartTotals(state.cart);
      state.cart.updatedAt = new Date().toISOString();
      
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    
    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      if (!state.cart) return;
      
      // Find and remove the item
      state.cart.items = state.cart.items.filter(item => item.id !== action.payload);
      
      // Check if cart is digital only
      state.cart.isDigitalOnly = state.cart.items.every(item => item.isDigital);
      
      // Recalculate totals
      state.cart = recalculateCartTotals(state.cart);
      state.cart.updatedAt = new Date().toISOString();
      
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    
    // Update item quantity
    updateQuantity: (state, action: PayloadAction<{ id: string | number; quantity: number }>) => {
      if (!state.cart) return;
      
      const { id, quantity } = action.payload;
      const itemIndex = state.cart.items.findIndex(item => item.id === id);
      
      if (itemIndex !== -1 && quantity > 0) {
        state.cart.items[itemIndex].quantity = quantity;
        state.cart.items[itemIndex] = calculateItemTotals(state.cart.items[itemIndex]);
        state.cart.items[itemIndex].updatedAt = new Date().toISOString();
        
        // Recalculate totals
        state.cart = recalculateCartTotals(state.cart);
        state.cart.updatedAt = new Date().toISOString();
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },
    
    // Clear cart
    clearCart: (state) => {
      if (!state.cart) return;
      
      state.cart.items = [];
      state.cart.coupons = [];
      state.cart.isDigitalOnly = true;
      
      // Reset totals
      state.cart.totals = {
        subtotal: 0,
        discountTotal: 0,
        taxTotal: 0,
        shippingTotal: 0,
        total: 0,
        currency: 'USD'
      };
      
      state.cart.updatedAt = new Date().toISOString();
      
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    
    // Save item for later
    saveForLater: (state, action: PayloadAction<string | number>) => {
      if (!state.cart) return;
      
      const itemIndex = state.cart.items.findIndex(item => item.id === action.payload);
      
      if (itemIndex !== -1) {
        // Add to saved items
        state.savedItems.push(state.cart.items[itemIndex]);
        
        // Remove from cart
        state.cart.items.splice(itemIndex, 1);
        
        // Check if cart is digital only
        state.cart.isDigitalOnly = state.cart.items.every(item => item.isDigital);
        
        // Recalculate totals
        state.cart = recalculateCartTotals(state.cart);
        state.cart.updatedAt = new Date().toISOString();
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(state.cart));
        localStorage.setItem('savedItems', JSON.stringify(state.savedItems));
      }
    },
    
    // Move saved item back to cart
    moveToCart: (state, action: PayloadAction<string | number>) => {
      const savedItemIndex = state.savedItems.findIndex(item => item.id === action.payload);
      
      if (savedItemIndex !== -1 && state.cart) {
        // Add to cart
        state.cart.items.push(state.savedItems[savedItemIndex]);
        
        // Remove from saved items
        state.savedItems.splice(savedItemIndex, 1);
        
        // Update digital-only flag
        state.cart.isDigitalOnly = state.cart.items.every(item => item.isDigital);
        
        // Recalculate totals
        state.cart = recalculateCartTotals(state.cart);
        state.cart.updatedAt = new Date().toISOString();
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(state.cart));
        localStorage.setItem('savedItems', JSON.stringify(state.savedItems));
      }
    },
    
    // Apply coupon
    applyCoupon: (state, action: PayloadAction<CartCoupon>) => {
      if (!state.cart) return;
      
      const coupon = action.payload;
      
      // Calculate discount amount
      let discountAmount = 0;
      
      if (coupon.type === 'percentage') {
        discountAmount = state.cart.totals.subtotal * (coupon.value / 100);
      } else if (coupon.type === 'fixed') {
        discountAmount = Math.min(coupon.value, state.cart.totals.subtotal);
      } else if (coupon.type === 'free_shipping') {
        discountAmount = state.cart.totals.shippingTotal;
      }
      
      // Add coupon with calculated discount
      state.cart.coupons.push({
        ...coupon,
        discountAmount
      });
      
      // Recalculate totals
      state.cart = recalculateCartTotals(state.cart);
      state.cart.updatedAt = new Date().toISOString();
      
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    
    // Remove coupon
    removeCoupon: (state, action: PayloadAction<string>) => {
      if (!state.cart) return;
      
      // Remove the coupon
      state.cart.coupons = state.cart.coupons.filter(
        coupon => coupon.code !== action.payload
      );
      
      // Recalculate totals
      state.cart = recalculateCartTotals(state.cart);
      state.cart.updatedAt = new Date().toISOString();
      
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    
    // Update shipping selection
    updateShipping: (state, action: PayloadAction<string | number>) => {
      if (!state.cart) return;
      
      const shippingOption = state.cart.shippingOptions?.find(
        option => option.id === action.payload
      );
      
      if (shippingOption) {
        state.cart.selectedShipping = shippingOption;
        
        // Recalculate totals
        state.cart = recalculateCartTotals(state.cart);
        state.cart.updatedAt = new Date().toISOString();
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload;
        state.error = null;
        
        // Load saved items
        const savedItemsJson = localStorage.getItem('savedItems');
        if (savedItemsJson) {
          state.savedItems = JSON.parse(savedItemsJson);
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

// Export actions
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  saveForLater,
  moveToCart,
  applyCoupon,
  removeCoupon,
  updateShipping
} = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;