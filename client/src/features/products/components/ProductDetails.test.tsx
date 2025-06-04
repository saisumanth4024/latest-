import { describe, it, expect, vi } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/react';
import ProductDetails from './ProductDetails';
import { renderWithProviders } from '@/test/test-utils';
import * as api from '../productsApi';
import * as hooks from '@/app/hooks';
import { useToast } from '@/hooks/use-toast';
import * as wouter from 'wouter';

vi.mock('../productsApi');
vi.mock('@/app/hooks');
vi.mock('@/hooks/use-toast');
vi.mock('wouter');

describe('ProductDetails', () => {
  it('adds item to cart when button is clicked', async () => {
    (wouter.useParams as unknown as vi.Mock).mockReturnValue({ id: '1' });

    (api.useGetProductByIdQuery as unknown as vi.Mock).mockReturnValue({
      data: { id: 1, name: 'Test', price: 10, sku: 'sku1', brand: 'Brand', inStock: true },
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

    const { getByText } = renderWithProviders(<ProductDetails />, { route: '/products/1' });
    fireEvent.click(getByText(/add to cart/i));

    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
    expect(mockToast).toHaveBeenCalled();
  });
});
