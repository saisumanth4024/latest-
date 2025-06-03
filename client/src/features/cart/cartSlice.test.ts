import { describe, it, expect, beforeEach } from 'vitest';
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  selectCartItemsCount,
  selectCartTotal,
} from './cartSlice';

const baseCart = {
  id: 'cart1',
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
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  isDigitalOnly: true,
  convertedToOrder: false,
};

const initialState = {
  cart: { ...baseCart },
  status: 'idle',
  error: null,
  savedItems: [],
};

beforeEach(() => {
  localStorage.clear();
});

describe('cartSlice reducers', () => {
  it('adds items to the cart', () => {
    const state = cartReducer(
      initialState,
      addToCart({
        productId: 'p1',
        product: { name: 'Test', brand: { id: 'b', name: 'Brand', slug: 'b' } },
        quantity: 2,
        unitPrice: 10,
        discountTotal: 0,
        sku: 'sku1',
        isDigital: false,
        requiresShipping: true,
        isTaxExempt: false,
        weight: 1,
      })
    );

    expect(state.cart.items.length).toBe(1);
    expect(state.cart.totals.subtotal).toBe(20);
  });

  it('updates item quantity', () => {
    let state = cartReducer(
      initialState,
      addToCart({
        productId: 'p1',
        product: { name: 'Test', brand: { id: 'b', name: 'Brand', slug: 'b' } },
        quantity: 1,
        unitPrice: 5,
        discountTotal: 0,
        sku: 'sku1',
        isDigital: false,
        requiresShipping: true,
        isTaxExempt: false,
        weight: 1,
      })
    );
    const id = state.cart.items[0].id;
    state = cartReducer(state, updateQuantity({ id, quantity: 3 }));
    expect(state.cart.items[0].quantity).toBe(3);
  });

  it('removes items from the cart', () => {
    let state = cartReducer(
      initialState,
      addToCart({
        productId: 'p1',
        product: { name: 'Test', brand: { id: 'b', name: 'Brand', slug: 'b' } },
        quantity: 1,
        unitPrice: 5,
        discountTotal: 0,
        sku: 'sku1',
        isDigital: false,
        requiresShipping: true,
        isTaxExempt: false,
        weight: 1,
      })
    );
    const id = state.cart.items[0].id;
    state = cartReducer(state, removeFromCart(id));
    expect(state.cart.items.length).toBe(0);
  });
});

describe('cartSlice selectors', () => {
  it('selects totals and counts', () => {
    const state = cartReducer(
      initialState,
      addToCart({
        productId: 'p1',
        product: { name: 'Test', brand: { id: 'b', name: 'Brand', slug: 'b' } },
        quantity: 2,
        unitPrice: 10,
        discountTotal: 0,
        sku: 'sku1',
        isDigital: false,
        requiresShipping: true,
        isTaxExempt: false,
        weight: 1,
      })
    );

    const rootState: any = { cart: state };
    expect(selectCartItemsCount(rootState)).toBe(1);
    expect(selectCartTotal(rootState)).toBeCloseTo(21.6, 1);
  });
});
