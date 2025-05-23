import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { FixedSizeGrid, FixedSizeGridProps, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { setVisibleRange, selectViewMode } from '../productsSlice';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string;
  className?: string;
}

const ProductGrid = ({ products, loading, error, className }: ProductGridProps) => {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(selectViewMode);
  const gridRef = useRef<FixedSizeGrid>(null);
  const [columnCount, setColumnCount] = useState(4);
  
  // Determine the number of columns based on the viewport width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) { // sm
        setColumnCount(1);
      } else if (width < 768) { // md
        setColumnCount(2);
      } else if (width < 1024) { // lg
        setColumnCount(3);
      } else if (width < 1280) { // xl
        setColumnCount(4);
      } else { // 2xl and above
        setColumnCount(5);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Reset the grid scroll position when the products change
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTo({ scrollTop: 0 });
    }
  }, [products]);
  
  // Track the visible items range for analytics and optimization
  const handleItemsRendered = ({ visibleRowStartIndex, visibleRowStopIndex, visibleColumnStartIndex, visibleColumnStopIndex }: any) => {
    const startIndex = visibleRowStartIndex * columnCount + visibleColumnStartIndex;
    const endIndex = visibleRowStopIndex * columnCount + visibleColumnStopIndex;
    
    dispatch(setVisibleRange({ startIndex, endIndex }));
  };
  
  // Display grid or list view based on viewMode
  if (viewMode === 'list') {
    return (
      <div className={cn('space-y-4', className)}>
        {loading && <div className="text-center py-8">Loading products...</div>}
        {error && <div className="text-center py-8 text-red-500">{error}</div>}
        {!loading && products.length === 0 && (
          <div className="text-center py-8">No products found. Try a different search or filter.</div>
        )}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} view="list" />
        ))}
      </div>
    );
  }

  // Memoized product card to optimize rendering performance
  const MemoizedProductCard = React.memo(({ data, rowIndex, columnIndex, style }: any) => {
    const { products, columnCount } = data;
    const index = rowIndex * columnCount + columnIndex;
    
    if (index >= products.length) {
      return null;
    }
    
    const product = products[index];
    
    return (
      <div style={{ ...style, padding: 8 }}>
        <ProductCard product={product} />
      </div>
    );
  }, areEqual);

  // Calculate required grid dimensions based on the products and column count
  const rowCount = Math.ceil(products.length / columnCount);
  
  return (
    <div className={cn('relative w-full h-full min-h-[500px]', className)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2">Loading products...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-red-500 p-4">
            <p>Error loading products: {error}</p>
            <button 
              className="mt-2 text-white bg-primary px-4 py-2 rounded hover:bg-primary/90"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {!loading && products.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            <p>No products found. Try a different search or filter.</p>
          </div>
        </div>
      )}
      
      {products.length > 0 && (
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => (
            <FixedSizeGrid
              ref={gridRef}
              columnCount={columnCount}
              columnWidth={width / columnCount}
              height={height}
              rowCount={rowCount}
              rowHeight={400} // Fixed height for each product card
              width={width}
              onItemsRendered={handleItemsRendered}
              itemData={{ products, columnCount }}
            >
              {MemoizedProductCard}
            </FixedSizeGrid>
          )}
        </AutoSizer>
      )}
    </div>
  );
};

export default ProductGrid;