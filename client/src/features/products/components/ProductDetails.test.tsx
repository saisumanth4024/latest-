import { describe, it, expect, vi } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/react';
import ProductDetails from './ProductDetails';
import { renderWithProviders } from '@/test/test-utils';
import * as api from '../productsApi';
import * as hooks from '@/app/hooks';
import { useToast } from '@/hooks/use-toast';
import * as wouter from 'wouter';
import React from 'react';
import ProductRecommendations from './ProductRecommendations';

vi.mock('../productsApi');
vi.mock('@/app/hooks');
vi.mock('@/hooks/use-toast');
vi.mock('wouter', async () => {
  const actual = await vi.importActual<typeof import('wouter')>('wouter');
  return {
    ...actual,
    useParams: vi.fn(),
  };
});
vi.mock('./ProductRecommendations', () => ({
  __esModule: true,
  default: () => <div />,
}));

describe('ProductDetails', () => {
  it('adds item to cart when button is clicked', async () => {
    (wouter.useParams as unknown as vi.Mock).mockReturnValue({ id: '1' });

    (api.useGetProductByIdQuery as unknown as vi.Mock).mockReturnValue({
      data: {
        id: 1,
        name: 'Test',
        price: 10,
        sku: 'sku1',
        brand: 'Brand',
        inStock: true,
        rating: 4.5,
        reviews: 10,
        tags: [],
      },
      isLoading: false,
    });
    (api.useGetProductsQuery as unknown as vi.Mock).mockReturnValue({
      data: { products: [] },
      isLoading: false,
    });

    const mockDispatch = vi.fn();
    (hooks.useAppDispatch as unknown as vi.Mock).mockReturnValue(mockDispatch);

    const mockToast = vi.fn();
    (useToast as unknown as vi.Mock).mockReturnValue({ toast: mockToast });

    const { getByText } = renderWithProviders(<ProductDetails />, { route: '/product/1' });
    fireEvent.click(getByText(/add to cart/i));

    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
    expect(mockToast).toHaveBeenCalled();
  });
});
