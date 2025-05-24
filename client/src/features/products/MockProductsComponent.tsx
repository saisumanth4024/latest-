import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useLocation } from 'wouter';

// Generate static mock products for immediate display
const generateMockProducts = (count: number = 12) => {
  const categories = ['electronics', 'clothing', 'home', 'beauty', 'books', 'sports'];
  const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Dell'];
  
  return Array(count).fill(0).map((_, idx) => {
    const id = idx + 1;
    const price = Math.floor(Math.random() * 1000) + 10;
    const hasDiscount = Math.random() > 0.7;
    const discountPrice = hasDiscount ? Math.floor(price * 0.8) : undefined;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const isNew = Math.random() > 0.8;
    
    return {
      id,
      name: `${brand} ${category.charAt(0).toUpperCase() + category.slice(1)} Product ${id}`,
      description: `High-quality ${category} product by ${brand}`,
      price,
      discountPrice,
      image: `https://picsum.photos/seed/product${id}/400/400`,
      category,
      brand,
      rating: (Math.random() * 4 + 1).toFixed(1),
      reviews: Math.floor(Math.random() * 500),
      inStock: Math.random() > 0.2,
      isNew,
      isFeatured: Math.random() > 0.7,
      tags: [category, brand.toLowerCase(), Math.random() > 0.2 ? 'in-stock' : 'out-of-stock'],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString()
    };
  });
};

// Product Card Component
const ProductCard = ({ product, onClick }: { product: any; onClick: (id: number) => void }) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to cart logic would go here
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to wishlist logic would go here
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(product.id)}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img 
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          loading="lazy"
        />
        
        {product.discountPrice && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white font-medium">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </Badge>
        )}
        
        {product.isNew && (
          <Badge className="absolute top-2 left-2 bg-primary text-white font-medium">
            New
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <Badge variant="outline" className="capitalize text-xs bg-primary/10">
            {product.category}
          </Badge>
          
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-xs font-medium">{product.rating}</span>
          </div>
        </div>
        
        <h3 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2 h-12 mb-1">{product.name}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-primary">${product.discountPrice || product.price}</span>
          {product.discountPrice && (
            <span className="text-gray-400 text-sm line-through">${product.price}</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1 py-1 h-8"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">Add</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleAddToWishlist}
          >
            <Heart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Product Grid Component
const MockProductsComponent = ({ 
  title = "Products",
  count = 12,
  columns = 3,
  filters = {},
  searchQuery = ""
}: { 
  title?: string;
  count?: number;
  columns?: 2 | 3 | 4;
  filters?: any;
  searchQuery?: string;
}) => {
  const [, setLocation] = useLocation();
  const products = generateMockProducts(count);
  
  // Get column classes based on requested columns
  const getColumnClass = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };
  
  // Navigate to product detail page
  const handleProductClick = (id: number) => {
    setLocation(`/products/${id}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      
      {searchQuery && (
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Showing results for <span className="font-medium">"{searchQuery}"</span>
          </p>
        </div>
      )}
      
      {/* Display any active filters */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(filters).map(([key, value]) => (
            value && (
              <Badge key={key} variant="secondary" className="px-3 py-1 capitalize">
                {key}: {value}
              </Badge>
            )
          ))}
        </div>
      )}
      
      <div className={`grid ${getColumnClass()} gap-4 md:gap-6`}>
        {products.map(product => (
          <ProductCard 
            key={`product-${product.id}`}
            product={product}
            onClick={handleProductClick}
          />
        ))}
      </div>
    </div>
  );
};

export default MockProductsComponent;