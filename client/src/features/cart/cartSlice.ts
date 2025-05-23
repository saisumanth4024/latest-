import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { Cart, CartItem, CartTotals, CartCoupon, ShippingOption } from '@/types/cart';
import { v4 as uuidv4 } from 'uuid';

// Define cart state
interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

// Calculate cart totals
const calculateTotals = (items: CartItem[]): CartTotals => {
  // Calculate subtotal (before discounts)
  const subtotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  
  // Calculate discount total
  const discountTotal = items.reduce((total, item) => total + item.discountTotal, 0);
  
  // Default tax rate (in a real app, this would be configured or fetched)
  const taxRate = 0.07; // 7%
  
  // Calculate tax total
  const taxableAmount = subtotal - discountTotal;
  const taxTotal = Math.round(taxableAmount * taxRate * 100) / 100;
  
  // Calculate shipping total (can be based on rules or set by ShippingOption)
  // For now, shipping is free for orders over $50, otherwise $5.99
  const shippingTotal = subtotal - discountTotal > 50 ? 0 : 5.99;
  
  // Calculate final total
  const total = subtotal - discountTotal + taxTotal + shippingTotal;
  
  return {
    subtotal,
    discountTotal,
    taxTotal,
    shippingTotal,
    total,
    currency: 'USD',
  };
};

// Recalculate item totals
const recalculateItemTotals = (item: CartItem): CartItem => {
  const subtotal = item.unitPrice * item.quantity;
  const total = subtotal - item.discountTotal;
  
  return {
    ...item,
    subtotal,
    total,
  };
};

// Recalculate all items and cart totals
const recalculateCart = (cart: Cart): Cart => {
  // Recalculate each item's totals
  const updatedItems = cart.items.map(recalculateItemTotals);
  
  // Recalculate cart totals
  const totals = calculateTotals(updatedItems);
  
  return {
    ...cart,
    items: updatedItems,
    totals,
    updatedAt: new Date().toISOString(),
  };
};

// Process coupon code
const applyCouponCode = (code: string, cart: Cart): CartCoupon | null => {
  // Simple demo coupons (in a real app, these would be stored in the database)
  const demoCoupons: Record<string, Partial<CartCoupon>> = {
    'WELCOME10': {
      type: 'percentage',
      value: 10,
      description: '10% off your order',
    },
    'SAVE20': {
      type: 'percentage',
      value: 20,
      description: '20% off your order',
    },
    'FREESHIP': {
      type: 'free_shipping',
      value: 0,
      description: 'Free shipping on your order',
    },
  };
  
  // Check if coupon exists
  const coupon = demoCoupons[code.toUpperCase()];
  
  if (!coupon) {
    return null;
  }

  // Calculate discount amount
  let discountAmount = 0;
  
  if (coupon.type === 'percentage' && coupon.value) {
    // Percentage discount on subtotal
    discountAmount = Math.round(cart.totals.subtotal * (coupon.value / 100) * 100) / 100;
  } else if (coupon.type === 'fixed' && coupon.value) {
    // Fixed amount discount
    discountAmount = Math.min(coupon.value, cart.totals.subtotal);
  } else if (coupon.type === 'free_shipping') {
    // Free shipping
    discountAmount = cart.totals.shippingTotal;
  }
  
  // Return full coupon object
  return {
    code: code.toUpperCase(),
    type: coupon.type as 'percentage' | 'fixed' | 'free_shipping',
    value: coupon.value || 0,
    discountAmount,
    description: coupon.description || '',
    appliedAt: new Date().toISOString(),
  };
};

// Apply coupon to items and recalculate
const applyCouponToCart = (cart: Cart, coupon: CartCoupon): Cart => {
  let updatedItems = [...cart.items];
  
  // Apply discount to items
  if (coupon.type === 'percentage' || coupon.type === 'fixed') {
    // For percentage or fixed discounts, distribute proportionally across items
    const totalValue = cart.totals.subtotal;
    
    updatedItems = updatedItems.map(item => {
      // Calculate proportion of this item to total
      const proportion = (item.subtotal / totalValue);
      
      // Calculate this item's share of the discount
      const itemDiscount = Math.round(coupon.discountAmount * proportion * 100) / 100;
      
      // Update item with discount
      return {
        ...item,
        discountTotal: item.discountTotal + itemDiscount,
        total: item.subtotal - (item.discountTotal + itemDiscount),
      };
    });
  }
  
  // Add coupon to cart
  const updatedCoupons = [...cart.coupons, coupon];
  
  // Return updated cart
  const updatedCart: Cart = {
    ...cart,
    items: updatedItems,
    coupons: updatedCoupons,
    updatedAt: new Date().toISOString(),
  };
  
  // Recalculate all totals
  return recalculateCart(updatedCart);
};

// Create empty cart
const createEmptyCart = (): Cart => {
  return {
    id: uuidv4(),
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
    isDigitalOnly: true,
    convertedToOrder: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Initialize state
const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

// Thunks for async operations

// Initialize cart (load from localStorage or API)
export const initializeCart = createAsyncThunk(
  'cart/initialize',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, we would fetch from API for logged-in users
      // For now, we'll use localStorage
      const savedCart = localStorage.getItem('cart');
      
      if (savedCart) {
        return JSON.parse(savedCart) as Cart;
      }
      
      // If no saved cart, create an empty one
      return createEmptyCart();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load cart');
    }
  }
);

// Apply a promo code to the cart
export const applyPromoCode = createAsyncThunk(
  'cart/applyPromoCode',
  async (code: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const cart = state.cart.cart;
      
      if (!cart) {
        return rejectWithValue('Cart not initialized');
      }
      
      // Check if code is already applied
      if (cart.coupons.some(coupon => coupon.code === code.toUpperCase())) {
        return rejectWithValue('This promo code has already been applied');
      }
      
      // Process coupon code (this simulates an API call)
      const coupon = applyCouponCode(code, cart);
      
      if (!coupon) {
        return rejectWithValue('Invalid promo code');
      }
      
      // Apply coupon to cart
      return coupon;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to apply promo code');
    }
  }
);

// Create the cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'id' | 'subtotal' | 'total' | 'addedAt' | 'updatedAt'>>) => {
      if (!state.cart) {
        state.cart = createEmptyCart();
      }
      
      const itemData = action.payload;
      
      // Check if item already exists in cart
      const existingItemIndex = state.cart.items.findIndex(
        item => item.productId === itemData.productId && 
                ((!item.variantId && !itemData.variantId) || item.variantId === itemData.variantId)
      );
      
      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const existingItem = state.cart.items[existingItemIndex];
        const newQuantity = existingItem.quantity + itemData.quantity;
        
        // Limit quantity to 10 items
        const limitedQuantity = Math.min(newQuantity, 10);
        
        state.cart.items[existingItemIndex] = {
          ...existingItem,
          quantity: limitedQuantity,
          updatedAt: new Date().toISOString(),
        };
        
        // Recalculate this item's totals
        state.cart.items[existingItemIndex] = recalculateItemTotals(state.cart.items[existingItemIndex]);
      } else {
        // Add new item
        const newItem: CartItem = {
          id: uuidv4(),
          productId: itemData.productId,
          variantId: itemData.variantId,
          product: itemData.product,
          variant: itemData.variant,
          quantity: Math.min(itemData.quantity, 10), // Limit to 10 items
          unitPrice: itemData.unitPrice,
          subtotal: itemData.unitPrice * itemData.quantity,
          discountTotal: 0,
          total: itemData.unitPrice * itemData.quantity,
          options: itemData.options,
          sku: itemData.sku,
          isDigital: itemData.isDigital,
          requiresShipping: itemData.requiresShipping,
          weight: itemData.weight,
          isTaxExempt: itemData.isTaxExempt,
          giftWrapping: itemData.giftWrapping,
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metadata: itemData.metadata,
        };
        
        state.cart.items.push(newItem);
        
        // Update isDigitalOnly flag based on items
        state.cart.isDigitalOnly = state.cart.items.every(item => item.isDigital);
      }
      
      // Recalculate all cart totals
      state.cart = recalculateCart(state.cart);
      
      // Save cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    
    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      if (!state.cart) return;
      
      const itemId = action.payload;
      const index = state.cart.items.findIndex(item => item.id === itemId);
      
      if (index !== -1) {
        state.cart.items.splice(index, 1);
        
        // Update isDigitalOnly flag based on remaining items
        state.cart.isDigitalOnly = state.cart.items.every(item => item.isDigital);
        
        // Recalculate cart totals
        state.cart = recalculateCart(state.cart);
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },
    
    // Update cart item quantity
    updateCartItemQuantity: (state, action: PayloadAction<{
      itemId: string | number;
      quantity: number;
    }>) => {
      if (!state.cart) return;
      
      const { itemId, quantity } = action.payload;
      
      // Ensure quantity is between 1 and 10
      const limitedQuantity = Math.max(1, Math.min(quantity, 10));
      
      const index = state.cart.items.findIndex(item => item.id === itemId);
      
      if (index !== -1) {
        state.cart.items[index].quantity = limitedQuantity;
        state.cart.items[index].updatedAt = new Date().toISOString();
        
        // Recalculate this item's totals
        state.cart.items[index] = recalculateItemTotals(state.cart.items[index]);
        
        // Recalculate cart totals
        state.cart = recalculateCart(state.cart);
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },
    
    // Clear cart
    clearCart: (state) => {
      state.cart = createEmptyCart();
      
      // Save empty cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    
    // Move item to wishlist
    moveToWishlist: (state, action: PayloadAction<{
      itemId: string | number;
      wishlistId: string;
    }>) => {
      if (!state.cart) return;
      
      const { itemId } = action.payload;
      const index = state.cart.items.findIndex(item => item.id === itemId);
      
      if (index !== -1) {
        // Remove item from cart (the wishlist action will add it)
        state.cart.items.splice(index, 1);
        
        // Update isDigitalOnly flag based on remaining items
        state.cart.isDigitalOnly = state.cart.items.every(item => item.isDigital);
        
        // Recalculate cart totals
        state.cart = recalculateCart(state.cart);
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },
    
    // Remove a coupon
    removeCoupon: (state, action: PayloadAction<string>) => {
      if (!state.cart) return;
      
      const couponCode = action.payload;
      
      // Find and remove coupon
      const couponIndex = state.cart.coupons.findIndex(
        coupon => coupon.code === couponCode
      );
      
      if (couponIndex !== -1) {
        // Remove the coupon
        state.cart.coupons.splice(couponIndex, 1);
        
        // Reset item discounts (this is simplified - a real app would need to track which discounts came from which coupons)
        state.cart.items = state.cart.items.map(item => ({
          ...item,
          discountTotal: 0,
          total: item.subtotal,
        }));
        
        // Re-apply remaining coupons (simplified)
        let updatedCart = {
          ...state.cart,
          totals: calculateTotals(state.cart.items),
        };
        
        for (const coupon of state.cart.coupons) {
          updatedCart = applyCouponToCart(updatedCart, coupon);
        }
        
        state.cart = updatedCart;
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },
    
    // Used to clear promo code input after applying or removing a code
    clearPromoCode: () => {
      // This action doesn't modify state, but is used by the UI
    },
    
    // Update shipping option
    setShippingOption: (state, action: PayloadAction<ShippingOption>) => {
      if (!state.cart) return;
      
      state.cart.selectedShipping = action.payload;
      
      // Recalculate cart totals (this would need to be more complex in a real app)
      state.cart = recalculateCart(state.cart);
      
      // Save cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize cart
      .addCase(initializeCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.isLoading = false;
      })
      .addCase(initializeCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Apply promo code
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        if (state.cart && action.payload) {
          // Apply coupon to cart
          state.cart = applyCouponToCart(state.cart, action.payload);
          
          // Save cart to localStorage
          localStorage.setItem('cart', JSON.stringify(state.cart));
        }
      });
  },
});

// Export actions
export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  moveToWishlist,
  removeCoupon,
  clearPromoCode,
  setShippingOption,
} = cartSlice.actions;

// Export selectors
export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartIsLoading = (state: RootState) => state.cart.isLoading;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectCartItems = (state: RootState) => state.cart.cart?.items || [];
export const selectCartItemCount = (state: RootState) => {
  return state.cart.cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
};
export const selectCartTotal = (state: RootState) => state.cart.cart?.totals.total || 0;

// Export reducer
export default cartSlice.reducer;