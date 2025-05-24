import React from 'react';
import { useParams, Link } from 'wouter';
import { useSelector } from 'react-redux';
import { ReviewsPage } from '@/features/reviews/pages';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck,
  RotateCcw, 
  Shield, 
  Award 
} from 'lucide-react';

// Mock product data - in a real app this would come from an API or Redux store
const getProductData = (id: string) => ({
  id,
  name: 'Premium Wireless Headphones',
  price: 299.99,
  description: 'Experience crystal-clear sound with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design.',
  rating: 4.7,
  reviewCount: 284,
  images: [
    '/images/headphones-main.jpg',
    '/images/headphones-side.jpg',
    '/images/headphones-case.jpg',
  ],
  colors: ['Black', 'Silver', 'Navy Blue'],
  features: [
    'Active Noise Cancellation',
    '30-hour Battery Life',
    'Bluetooth 5.2',
    'Quick Charge (10 min charge = 5 hours playback)',
    'High-Resolution Audio',
    'Built-in Microphone Array',
    'Touch Controls',
    'App Integration',
  ],
  stock: 15,
  sku: 'WH-1000XM5',
  brand: 'SoundMasters',
  category: 'Electronics',
  subcategory: 'Headphones',
  tags: ['wireless', 'noise-cancellation', 'premium', 'over-ear'],
  warranty: '2 Year Limited Warranty',
  specs: {
    weight: '250g',
    dimensions: '7.3 x 3.2 x 9.4 inches',
    connectivity: 'Bluetooth 5.2, 3.5mm audio cable',
    driverSize: '40mm',
    frequencyResponse: '4Hz-40,000Hz',
    impedance: '47 ohms',
  }
});

const ProductDetailPage = () => {
  const { productId = '1' } = useParams();
  const product = getProductData(productId);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow">
          <div className="h-[400px] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src={`https://source.unsplash.com/random/600x600/?${product.category.toLowerCase()},${product.name.toLowerCase().replace(' ', '-')}`} 
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex mt-4 gap-2">
            {[1, 2, 3].map((_, index) => (
              <div 
                key={index} 
                className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center cursor-pointer overflow-hidden"
              >
                <img 
                  src={`https://source.unsplash.com/random/200x200/?${product.category.toLowerCase()},${product.subcategory.toLowerCase()}`} 
                  alt={`${product.name} - view ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 font-medium">{product.rating}</span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">({product.reviewCount} reviews)</span>
                <span className="text-gray-500 dark:text-gray-400">|</span>
                <Badge variant="outline" className="capitalize">
                  {product.category}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-2xl font-bold text-primary mb-1">${product.price}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              In Stock: {product.stock} units | SKU: {product.sku}
            </p>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {product.description}
          </p>
          
          <div className="mb-6">
            <p className="font-medium mb-2">Color</p>
            <div className="flex gap-2">
              {product.colors.map((color, index) => (
                <div 
                  key={index} 
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 cursor-pointer hover:border-primary"
                >
                  {color}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4 mb-8">
            <Button className="flex-1">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" className="flex-1">
              Buy Now
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-gray-500" />
              <span className="text-sm">30-Day Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="text-sm">2-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Authentic Product</span>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="details" className="mt-12">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Product Features</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            {product.features.map((feature, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{feature}</li>
            ))}
          </ul>
        </TabsContent>
        
        <TabsContent value="specs" className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="border-b pb-2">
                <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                <p className="text-gray-600 dark:text-gray-400">{value}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="reviews">
          <ReviewsPage
            contentType="product"
            contentId={productId}
            title="Customer Reviews"
            description={`${product.reviewCount} reviews for ${product.name}`}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetailPage;