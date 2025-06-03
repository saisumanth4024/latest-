import React from 'react';
import { sampleProducts, Product } from '../types';

interface ProductListProps {
  products?: Product[];
  // ...other props...
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  // Use sampleProducts if products is undefined or an empty array
  const displayProducts = products && products.length > 0 ? products : sampleProducts;


  return (
    <div>
      <h2>Product List Debug</h2>
      {displayProducts.length === 0 ? (
        <div>No products available.</div>
      ) : (
        <ul>
          {displayProducts.map(product => (
            <li key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <span>${product.price}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;