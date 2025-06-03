import React from 'react';
import { sampleProducts, Product } from '../types';
import ProductList from './ProductList';

const MockProductsComponent: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [filters, setFilters] = React.useState<{ [key: string]: any }>({});
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>(sampleProducts);

  React.useEffect(() => {
    let result = [...sampleProducts];

    // Apply search if present
    if (searchQuery.trim() !== '') {
      const lower = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(lower) ||
        product.description.toLowerCase().includes(lower)
      );
    }

    // Apply filters if present
    if (filters && Object.keys(filters).length > 0) {
      if (filters.category) {
        result = result.filter(product => product.category === filters.category);
      }
      // ...add more filter conditions as needed...
    }

    setFilteredProducts(result);
  }, [searchQuery, filters]);

  return (
    <div>
      {/* Search and filter inputs here */}
      <ProductList products={filteredProducts} />
    </div>
  );
};

export default MockProductsComponent;