import React, { useState } from 'react';
import { useParams, Link } from 'wouter';
import { useSelector, useDispatch } from 'react-redux';
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
  Award,
  Check,
  ChevronLeft,
  ChevronRight
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  
  // Generate product images using category and name
  const productImages = [
    `https://source.unsplash.com/random/600x600/?${product.category.toLowerCase()},${product.name.toLowerCase().replace(' ', '-')}`,
    `https://source.unsplash.com/random/600x600/?${product.subcategory.toLowerCase()},premium`,
    `https://source.unsplash.com/random/600x600/?${product.category.toLowerCase()},luxury`
  ];
  
  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };
  
  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };
  
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center text-sm font-medium text-primary hover:underline mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow">
          <div className="relative h-[400px] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden group">
            <img 
              src={productImages[activeImageIndex]} 
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
            
            {/* Image navigation arrows */}
            <button 
              onClick={handlePrevImage}
              className="absolute left-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
            </button>
            
            <button 
              onClick={handleNextImage}
              className="absolute right-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
          
          <div className="flex mt-4 gap-2">
            {productImages.map((image, index) => (
              <div 
                key={index} 
                className={`w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center cursor-pointer overflow-hidden ${
                  activeImageIndex === index ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img 
                  src={image} 
                  alt={`${product.name} - view ${index + 1}`}
                  className="object-cover w-full h-full hover:opacity-90 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800 dark:text-gray-100 font-serif">{product.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= Math.round(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} 
                    />
                  ))}
                  <span className="ml-1 font-medium text-yellow-700 dark:text-yellow-400">{product.rating}</span>
                </div>
                <span className="text-gray-500 dark:text-gray-400 hover:underline cursor-pointer">
                  {product.reviewCount} reviews
                </span>
                <Badge variant="outline" className="capitalize bg-primary/10">
                  {product.category}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors duration-300"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors duration-300"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mb-6 bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
              <p className="text-sm line-through text-gray-400">${(product.price * 1.2).toFixed(2)}</p>
              <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                20% OFF
              </Badge>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 flex items-center">
              <span className={product.stock > 5 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
                {product.stock > 5 ? "In Stock" : "Low Stock"}: {product.stock} units
              </span>
              <span className="mx-2">|</span>
              <span>SKU: <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{product.sku}</span></span>
            </p>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-base">
            {product.description}
          </p>
          
          <div className="mb-6">
            <p className="font-medium mb-2 text-gray-800 dark:text-gray-200">Select Color</p>
            <div className="flex gap-2">
              {product.colors.map((color, index) => (
                <div 
                  key={index} 
                  className={`border ${selectedColor === color 
                    ? 'border-primary ring-2 ring-primary/30' 
                    : 'border-gray-300 dark:border-gray-600'} 
                  rounded-md px-4 py-2 cursor-pointer hover:border-primary transition-all duration-200`}
                  onClick={() => setSelectedColor(color)}
                >
                  <div className="flex items-center gap-2">
                    {selectedColor === color && <Check className="h-3 w-3 text-primary" />}
                    {color}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <p className="font-medium mb-2 text-gray-800 dark:text-gray-200">Quantity</p>
            <div className="flex items-center w-36 h-10">
              <button 
                className="w-10 h-full border border-gray-300 dark:border-gray-600 rounded-l-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <div className="flex-1 h-full border-t border-b border-gray-300 dark:border-gray-600 flex items-center justify-center font-medium">
                {quantity}
              </div>
              <button 
                className="w-10 h-full border border-gray-300 dark:border-gray-600 rounded-r-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 mb-8">
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-white py-6 rounded-md shadow-lg hover:shadow-xl transition-all duration-300">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10 py-6 rounded-md transition-colors duration-300">
              Buy Now
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/60 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="p-2 bg-primary/10 rounded-full">
                <Truck className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/60 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="p-2 bg-primary/10 rounded-full">
                <RotateCcw className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">30-Day Returns</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/60 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="p-2 bg-primary/10 rounded-full">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">2-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/60 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="p-2 bg-primary/10 rounded-full">
                <Award className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Authentic Product</span>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="details" className="mt-12">
        <TabsList className="mb-4 w-full max-w-2xl mx-auto bg-gray-100 dark:bg-gray-800/80 p-1 rounded-lg">
          <TabsTrigger value="details" className="text-sm font-medium px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-md transition-all">
            Details
          </TabsTrigger>
          <TabsTrigger value="specs" className="text-sm font-medium px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-md transition-all">
            Specifications
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-sm font-medium px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-md transition-all">
            Reviews <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-primary/20 text-primary rounded-full">{product.reviewCount}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 border-b pb-3">Product Features</h3>
          <ul className="list-none space-y-4 mb-6">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">
                  <Check className="h-3 w-3" />
                </div>
                <p className="text-gray-700 dark:text-gray-300">{feature}</p>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Why Choose {product.brand}</h4>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {product.brand} is known for exceptional quality and innovation in the {product.category} industry. 
              With a focus on premium materials and cutting-edge technology, our products deliver an unparalleled 
              experience for discerning customers who demand the best.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="specs" className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 border-b pb-3">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="border border-gray-100 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <p className="font-medium capitalize text-gray-500 dark:text-gray-400 text-sm">{key.replace(/([A-Z])/g, ' $1')}</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{value}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex items-center justify-center">
            <a href="#" className="inline-flex items-center text-primary hover:underline">
              <span>Download Full Specifications PDF</span>
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Customer Reviews</h3>
              <Button variant="outline" className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Write a Review
              </Button>
            </div>
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-5 w-5 ${star <= Math.round(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="ml-2 text-lg font-bold text-gray-800 dark:text-gray-200">{product.rating}</span>
              <span className="mx-2 text-gray-500">|</span>
              <span className="text-gray-600 dark:text-gray-400">{product.reviewCount} reviews</span>
            </div>
          </div>
          
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