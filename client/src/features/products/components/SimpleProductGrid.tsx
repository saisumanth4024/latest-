import React from 'react';
import { useLocation } from 'wouter';
import { formatCurrency } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, StarHalf } from 'lucide-react';

// Basic product data structure
const PRODUCTS = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 299.99,
    image: "https://source.unsplash.com/random/400x300?headphones",
    rating: 4.8,
    category: "Electronics",
    brand: "Sony",
    discount: 10
  },
  {
    id: "2",
    name: "Men's Casual Shirt",
    description: "Comfortable cotton shirt for everyday wear",
    price: 49.99,
    image: "https://source.unsplash.com/random/400x300?shirt",
    rating: 4.2,
    category: "Clothing",
    brand: "Nike",
    discount: 0
  },
  {
    id: "3",
    name: "Smart 4K TV",
    description: "55-inch 4K Smart TV with HDR",
    price: 699.99,
    image: "https://source.unsplash.com/random/400x300?tv",
    rating: 4.6,
    category: "Electronics",
    brand: "Samsung",
    discount: 15
  },
  {
    id: "4",
    name: "Premium Coffee Maker",
    description: "Automatic coffee maker with timer",
    price: 129.99,
    image: "https://source.unsplash.com/random/400x300?coffee-maker",
    rating: 4.3,
    category: "Home & Kitchen",
    brand: "KitchenAid",
    discount: 0
  },
  {
    id: "5",
    name: "Running Shoes",
    description: "Lightweight running shoes",
    price: 89.99,
    image: "https://source.unsplash.com/random/400x300?running-shoes",
    rating: 4.5,
    category: "Sports & Outdoors",
    brand: "Adidas",
    discount: 5
  },
  {
    id: "6",
    name: "Smartphone",
    description: "Latest model smartphone with high-resolution camera",
    price: 899.99,
    image: "https://source.unsplash.com/random/400x300?smartphone",
    rating: 4.7,
    category: "Electronics",
    brand: "Apple",
    discount: 0
  }
];

// Interface for the component props
interface SimpleProductGridProps {
  searchQuery?: string;
}

const SimpleProductGrid: React.FC<SimpleProductGridProps> = ({ searchQuery = "" }) => {
  const [, setLocation] = useLocation();
  
  // Filter products based on search query
  const filteredProducts = searchQuery 
    ? PRODUCTS.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : PRODUCTS;

  // Handle product click
  const handleProductClick = (productId: string) => {
    setLocation(`/products/${productId}`);
  };

  // Render rating stars
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Products count */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredProducts.length} products
        </p>
      </div>
      
      {/* If no products found */}
      {filteredProducts.length === 0 && (
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center mb-6">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try a different search term.</p>
        </div>
      )}
      
      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <Card 
            key={product.id} 
            className="overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="relative aspect-w-4 aspect-h-3 bg-gray-100 dark:bg-gray-800">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-48"
                loading="lazy"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src =
                    "https://placehold.co/400x300/e2e8f0/1e293b?text=Product+Image";
                }}
              />
              {product.discount > 0 && (
                <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                  -{product.discount}%
                </Badge>
              )}
            </div>
            
            <CardContent className="flex-grow p-4">
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex justify-between items-center mt-auto">
                <div>
                  <p className="font-bold text-lg">
                    {product.discount > 0 ? (
                      <>
                        <span className="text-red-500">{formatCurrency(product.price * (1 - product.discount / 100))}</span>
                        <span className="text-gray-400 text-sm line-through ml-2">{formatCurrency(product.price)}</span>
                      </>
                    ) : (
                      formatCurrency(product.price)
                    )}
                  </p>
                  <div className="mt-1">
                    {renderRating(product.rating)}
                  </div>
                </div>
                <Badge variant="outline">{product.category}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SimpleProductGrid;