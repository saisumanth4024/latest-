import { describe, it, expect } from 'vitest';
import productsReducer, {
  clearImageUploadState,
  setFilter,
  resetFilters,
  uploadProductImages,
  selectFilters
} from './productsSlice';

const initialState = productsReducer(undefined, { type: 'init' });

describe('productsSlice reducers', () => {
  it('clears image upload state', () => {
    const modified = {
      ...initialState,
      imageUpload: { status: 'loading', error: 'e', uploadedImageUrls: ['a'] }
    } as any;

    const state = productsReducer(modified, clearImageUploadState());
    expect(state.imageUpload).toEqual({ status: 'idle', error: null, uploadedImageUrls: [] });
  });

  it('sets filter values', () => {
    const state = productsReducer(
      initialState,
      setFilter({ key: 'category', value: 'books' })
    );
    expect(state.filters.category).toBe('books');
  });

  it('resets filters', () => {
    const mod = productsReducer(initialState, setFilter({ key: 'category', value: 'books' }));
    const state = productsReducer(mod, resetFilters());
    expect(state.filters).toEqual(initialState.filters);
  });
});

describe('productsSlice extra reducers', () => {
  it('handles uploadProductImages lifecycle', () => {
    let state = productsReducer(initialState, { type: uploadProductImages.pending.type });
    expect(state.imageUpload.status).toBe('loading');

    state = productsReducer(state, {
      type: uploadProductImages.fulfilled.type,
      payload: { imageUrls: ['one', 'two'] }
    });
    expect(state.imageUpload.status).toBe('succeeded');
    expect(state.imageUpload.uploadedImageUrls).toEqual(['one', 'two']);

    state = productsReducer(state, {
      type: uploadProductImages.rejected.type,
      payload: 'err'
    });
    expect(state.imageUpload.status).toBe('failed');
    expect(state.imageUpload.error).toBe('err');
  });
});

describe('productsSlice selectors', () => {
  it('selects filters', () => {
    const root = { products: initialState } as any;
    expect(selectFilters(root)).toEqual(initialState.filters);
  });
});
