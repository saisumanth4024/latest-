import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  StarHalf, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Mock product data with realistic details
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Ultra Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with 40-hour battery life.",
    price: 299.99,
    image: "https://i.imgur.com/jNNT4LE.jpg",
    rating: 4.7,
    category: "electronics",
    brand: "SoundMax",
    inStock: true,
    discount: 15,
    tags: ["wireless", "audio", "premium"],
    reviews: 128,
    priceRange: "200-500"
  },
  {
    id: "2",
    name: "Premium Running Shoes",
    description: "Lightweight and responsive running shoes with advanced cushioning technology.",
    price: 149.95,
    image: "https://i.imgur.com/3oXaiBI.jpg",
    rating: 4.5,
    category: "clothing",
    brand: "SpeedStep",
    inStock: true,
    discount: 0,
    tags: ["running", "sports", "footwear"],
    reviews: 94,
    priceRange: "100-200"
  },
  {
    id: "3",
    name: "Smart Watch Pro",
    description: "Advanced fitness tracking with heart rate monitor and GPS.",
    price: 349.99,
    image: "https://i.imgur.com/J6MinJn.jpg",
    rating: 4.8,
    category: "electronics",
    brand: "TechFit",
    inStock: true,
    discount: 10,
    tags: ["smartwatch", "fitness", "wearable"],
    reviews: 215,
    priceRange: "200-500"
  },
  {
    id: "4",
    name: "Designer Sunglasses",
    description: "UV-protected, polarized lenses in a classic style.",
    price: 189.99,
    image: "https://i.imgur.com/KFojrGE.jpg",
    rating: 4.3,
    category: "accessories",
    brand: "VueChic",
    inStock: false,
    discount: 5,
    tags: ["sunglasses", "fashion", "summer"],
    reviews: 63,
    priceRange: "100-200"
  },
  {
    id: "5",
    name: "Wireless Earbuds",
    description: "True wireless earbuds with active noise cancellation and waterproof design.",
    price: 159.95,
    image: "https://i.imgur.com/2r1in9o.jpg",
    rating: 4.6,
    category: "electronics",
    brand: "SoundMax",
    inStock: true,
    discount: 0,
    tags: ["earbuds", "wireless", "audio"],
    reviews: 102,
    priceRange: "100-200"
  },
  {
    id: "6",
    name: "Ultrabook Laptop 15\"",
    description: "Ultra-thin and lightweight laptop with 12-hour battery life.",
    price: 1299.99,
    image: "https://i.imgur.com/D5yJDGJ.jpg",
    rating: 4.9,
    category: "electronics",
    brand: "TechBook",
    inStock: true,
    discount: 0,
    tags: ["laptop", "computer", "ultrabook"],
    reviews: 87,
    priceRange: "1000+"
  },
  {
    id: "7",
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with customizable switches.",
    price: 129.95,
    image: "https://i.imgur.com/K0mTULv.jpg",
    rating: 4.4,
    category: "electronics",
    brand: "TypeMaster",
    inStock: true,
    discount: 0,
    tags: ["keyboard", "gaming", "mechanical"],
    reviews: 56,
    priceRange: "100-200"
  },
  {
    id: "8",
    name: "Noise-Cancelling Headset",
    description: "Professional-grade headset with crystal clear microphone.",
    price: 249.99,
    image: "https://i.imgur.com/jNNT4LE.jpg",
    rating: 4.7,
    category: "electronics",
    brand: "ClearSound",
    inStock: true,
    discount: 0,
    tags: ["headset", "audio", "professional"],
    reviews: 43,
    priceRange: "200-500"
  },
  {
    id: "9",
    name: "Performance Athletic Shoes",
    description: "High-performance athletic shoes with responsive cushioning.",
    price: 179.95,
    image: "https://i.imgur.com/3oXaiBI.jpg",
    rating: 4.6,
    category: "clothing",
    brand: "AthleticEdge",
    inStock: true,
    discount: 20,
    tags: ["shoes", "athletic", "sports"],
    reviews: 77,
    priceRange: "100-200"
  },
  {
    id: "10",
    name: "Ergonomic Office Chair",
    description: "Fully adjustable ergonomic chair with lumbar support.",
    price: 399.99,
    image: "https://i.imgur.com/NtIYVLj.jpg",
    rating: 4.8,
    category: "home",
    brand: "ComfortPlus",
    inStock: true,
    discount: 10,
    tags: ["chair", "office", "ergonomic"],
    reviews: 64,
    priceRange: "200-500"
  },
  {
    id: "11",
    name: "4K Ultra HD Monitor",
    description: "32-inch 4K monitor with HDR support and eye-care technology.",
    price: 449.99,
    image: "https://i.imgur.com/MN89wsx.jpg",
    rating: 4.7,
    category: "electronics",
    brand: "VisualPro",
    inStock: true,
    discount: 5,
    tags: ["monitor", "4k", "computer"],
    reviews: 38,
    priceRange: "200-500"
  },
  {
    id: "12",
    name: "Smartphone Pro Max",
    description: "Latest flagship smartphone with advanced camera system and all-day battery.",
    price: 1099.99,
    image: "https://i.imgur.com/hrnS6zr.jpg",
    rating: 4.9,
    category: "electronics",
    brand: "TechGiant",
    inStock: true,
    discount: 0,
    tags: ["smartphone", "mobile", "camera"],
    reviews: 156,
    priceRange: "1000+"
  },
  {
    id: "13",
    name: "Wireless Gaming Mouse",
    description: "Ultra-responsive wireless gaming mouse with customizable buttons.",
    price: 89.99,
    image: "https://i.imgur.com/3TH8sj2.jpg",
    rating: 4.5,
    category: "electronics",
    brand: "GameTech",
    inStock: true,
    discount: 0,
    tags: ["mouse", "gaming", "wireless"],
    reviews: 92,
    priceRange: "50-100"
  },
  {
    id: "14",
    name: "Smart Home Speaker",
    description: "Voice-controlled smart speaker with premium sound quality.",
    price: 199.99,
    image: "https://i.imgur.com/8QGW9wq.jpg",
    rating: 4.6,
    category: "electronics",
    brand: "HomeSmart",
    inStock: true,
    discount: 15,
    tags: ["speaker", "smart home", "voice control"],
    reviews: 81,
    priceRange: "100-200"
  },
  {
    id: "15",
    name: "Digital Drawing Tablet",
    description: "Professional drawing tablet with pressure sensitivity and wireless connectivity.",
    price: 349.99,
    image: "https://i.imgur.com/ZXBCcPX.jpg",
    rating: 4.7,
    category: "electronics",
    brand: "ArtPro",
    inStock: true,
    discount: 0,
    tags: ["tablet", "drawing", "digital art"],
    reviews: 47,
    priceRange: "200-500"
  },
  {
    id: "16",
    name: "Portable Bluetooth Speaker",
    description: "Waterproof, durable Bluetooth speaker with 24-hour battery life.",
    price: 129.99,
    image: "https://i.imgur.com/8QGW9wq.jpg",
    rating: 4.4,
    category: "electronics",
    brand: "SoundMax",
    inStock: true,
    discount: 10,
    tags: ["speaker", "bluetooth", "portable"],
    reviews: 118,
    priceRange: "100-200"
  },
  {
    id: "17",
    name: "Professional Hair Dryer",
    description: "Salon-quality hair dryer with ionic technology and multiple heat settings.",
    price: 149.99,
    image: "https://i.imgur.com/2kcGbfY.jpg",
    rating: 4.3,
    category: "beauty",
    brand: "StylePro",
    inStock: true,
    discount: 0,
    tags: ["hair dryer", "beauty", "styling"],
    reviews: 73,
    priceRange: "100-200"
  },
  {
    id: "18",
    name: "Multi-Function Blender",
    description: "High-powered blender with multiple attachments for various food preparation tasks.",
    price: 199.95,
    image: "https://i.imgur.com/MxHuebH.jpg",
    rating: 4.6,
    category: "home",
    brand: "KitchenPro",
    inStock: true,
    discount: 5,
    tags: ["blender", "kitchen", "appliance"],
    reviews: 65,
    priceRange: "100-200"
  },
  {
    id: "19",
    name: "Robot Vacuum Cleaner",
    description: "Smart robot vacuum with mapping technology and automated cleaning schedules.",
    price: 399.99,
    image: "https://i.imgur.com/JfcFHPv.jpg",
    rating: 4.7,
    category: "home",
    brand: "CleanTech",
    inStock: true,
    discount: 15,
    tags: ["vacuum", "robot", "smart home"],
    reviews: 89,
    priceRange: "200-500"
  },
  {
    id: "20",
    name: "Premium Coffee Maker",
    description: "Programmable coffee maker with built-in grinder and temperature control.",
    price: 249.99,
    image: "https://i.imgur.com/rOxSB2J.jpg",
    rating: 4.8,
    category: "home",
    brand: "BrewMaster",
    inStock: true,
    discount: 0,
    tags: ["coffee maker", "kitchen", "appliance"],
    reviews: 103,
    priceRange: "200-500"
  }
];

interface MockProductsComponentProps {
  title?: string;
  count?: number;
  columns?: number;
  filters?: {
    category?: string | null;
    priceRange?: string | null;
    rating?: string | null;
    sort?: string;
    price?: string | null; // For search page compatibility
  };
  searchQuery?: string;
}

const MockProductsComponent: React.FC<MockProductsComponentProps> = ({
  title = "Products",
  count = 12,
  columns = 4,
  filters = {},
  searchQuery = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState(MOCK_PRODUCTS);
  const productsPerPage = count;
  
  // Filter and sort products based on criteria
  useEffect(() => {
    let result = [...MOCK_PRODUCTS];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }
    
    // Apply price range filter
    if (filters.priceRange || filters.price) {
      const priceFilter = filters.priceRange || filters.price;
      switch(priceFilter) {
        case '0-50':
        case 'under-25':
        case '25-50':
          result = result.filter(product => product.price < 50);
          break;
        case '50-100':
          result = result.filter(product => product.price >= 50 && product.price < 100);
          break;
        case '100-200':
        case '50-100':
          result = result.filter(product => product.price >= 100 && product.price < 200);
          break;
        case '200-500':
        case '100-200':
          result = result.filter(product => product.price >= 200 && product.price < 500);
          break;
        case '500-1000':
        case 'over-200':
          result = result.filter(product => product.price >= 500 && product.price < 1000);
          break;
        case '1000+':
          result = result.filter(product => product.price >= 1000);
          break;
      }
    }
    
    // Apply rating filter
    if (filters.rating) {
      const ratingValue = filters.rating === '4+' || filters.rating === '4-up' ? 4 :
                         filters.rating === '3+' || filters.rating === '3-up' ? 3 :
                         filters.rating === '2+' || filters.rating === '2-up' ? 2 : 1;
      result = result.filter(product => product.rating >= ratingValue);
    }
    
    // Apply sorting
    if (filters.sort) {
      switch(filters.sort) {
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          // Simulate newest by using the reverse of the ID
          result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
          break;
        case 'popular':
        case 'relevance':
          // Simulate popularity by using review count
          result.sort((a, b) => b.reviews - a.reviews);
          break;
      }
    }
    
    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, filters, count]);
  
  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  
  // Handle page changes
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  // Render stars for rating
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
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      
      {/* Products count */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {currentProducts.length} of {filteredProducts.length} products
        </p>
      </div>
      
      {/* Product grid */}
      {currentProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Try adjusting your filters or search criteria.
          </p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-4`}>
          {currentProducts.map(product => (
            <Card key={product.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative aspect-w-4 aspect-h-3 bg-gray-100 dark:bg-gray-800">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="object-cover w-full h-48"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = "https://placehold.co/400x300/e2e8f0/1e293b?text=Product+Image";
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
                
                <div className="flex items-center mb-2">
                  {renderRating(product.rating)}
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    ({product.reviews})
                  </span>
                </div>
                
                <div className="mt-2">
                  {product.discount > 0 ? (
                    <div className="flex items-center">
                      <span className="text-xl font-bold">
                        {formatCurrency(product.price * (1 - product.discount / 100))}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold">{formatCurrency(product.price)}</span>
                  )}
                </div>
                
                <div className="mt-2">
                  <Badge variant="outline" className="mr-1">
                    {product.category}
                  </Badge>
                  <Badge variant="secondary" className="mr-1">
                    {product.brand}
                  </Badge>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant={product.inStock ? "default" : "outline"} size="sm" disabled={!product.inStock}>
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="mx-2 flex items-center text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockProductsComponent;