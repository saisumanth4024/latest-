import React, { useState } from 'react';
import { useParams, Link } from 'wouter';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  Star, 
  Truck, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Share2,
  ShoppingCart,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useGetProductByIdQuery, useGetProductsQuery } from '../productsApi';
import ProductImageGallery from './ProductImageGallery';
import ProductReviews from './ProductReviews';
import ProductRecommendations from './ProductRecommendations';
import { Separator } from '@/components/ui/separator';

const ProductDetails: React.FC = () => {
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id, 10);
  const dispatch = useDispatch();
  
  // State for product customization (size, color, quantity)
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  // Fetch product details
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId);
  
  // Fetch recommendations (products in same category)
  const { data: relatedProductsData } = useGetProductsQuery({
    category: product?.category,
    limit: 4,
  }, { skip: !product });
  
  // Get related products excluding the current product
  const relatedProducts = relatedProductsData?.products.filter(p => p.id !== productId) || [];
  
  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  // Get available colors
  const colors = product?.colors || [];
  // Example sizes if not provided by the product data
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  
  // Calculate estimated delivery date (5-7 days from now)
  const getDeliveryEstimate = () => {
    const today = new Date();
    
    const minDelivery = new Date(today);
    minDelivery.setDate(today.getDate() + 5);
    
    const maxDelivery = new Date(today);
    maxDelivery.setDate(today.getDate() + 7);
    
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric', 
      }).format(date);
    };
    
    return `${formatDate(minDelivery)} - ${formatDate(maxDelivery)}`;
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', {
      productId,
      quantity,
      color: selectedColor,
      size: selectedSize
    });
  };
  
  // Star rating component
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <span className="absolute inset-0 overflow-hidden w-[50%]">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </span>
          </span>
        );
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }

    return stars;
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/products" className="flex items-center text-primary hover:underline mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Product Not Found
          </h2>
          <p className="text-red-500 dark:text-red-300 mb-4">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/products">
              View All Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back navigation */}
      <Link href="/products" className="flex items-center text-primary hover:underline mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Products
      </Link>
      
      {/* Product main details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product image gallery */}
        <div>
          <ProductImageGallery 
            mainImage={product.image} 
            images={[product.image]} 
            productName={product.name}
          />
        </div>
        
        {/* Product info */}
        <div className="space-y-6">
          <div>
            {/* Brand */}
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{product.brand}</div>
            
            {/* Product name */}
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-1">
              <div className="flex items-center mr-2">
                {renderRatingStars(product.rating)}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
            
            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.isNew && <Badge variant="default">New Arrival</Badge>}
              {product.isFeatured && <Badge variant="secondary">Featured</Badge>}
              <Badge variant={product.inStock ? "outline" : "destructive"}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
          </div>
          
          {/* Price */}
          <div>
            {product.discountPrice ? (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatPrice(product.discountPrice)}</span>
                <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <Badge variant="destructive" className="ml-2">
                  {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                </Badge>
              </div>
            ) : (
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            )}
          </div>
          
          {/* Short description */}
          <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
          
          {/* Color selection */}
          {colors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color, idx) => (
                  <button
                    key={idx}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color 
                        ? 'border-primary ring-2 ring-primary/30' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    style={{ backgroundColor: color === 'rgb' 
                      ? 'linear-gradient(135deg, #ff0000, #00ff00, #0000ff)' 
                      : color 
                    }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color: ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Size selection */}
          <div>
            <div className="flex justify-between mb-3">
              <h3 className="text-sm font-medium">Size</h3>
              <button className="text-sm text-primary hover:underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`px-3 py-1 border rounded-md text-sm transition-all ${
                    selectedSize === size 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity */}
          <div>
            <h3 className="text-sm font-medium mb-3">Quantity</h3>
            <div className="flex items-center space-x-3">
              <button
                className="w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-md"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                className="w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-md"
                onClick={() => setQuantity(quantity + 1)}
                disabled={!product.inStock}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to cart and wishlist buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1"
              size="lg"
              disabled={!product.inStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </Button>
            <Button variant="outline" size="icon" className="hidden sm:flex" title="Share">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Delivery info */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex">
              <Truck className="h-5 w-5 text-primary mr-3" />
              <div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  For orders over $50
                </p>
              </div>
            </div>
            <div className="flex">
              <Clock className="h-5 w-5 text-primary mr-3" />
              <div>
                <p className="text-sm font-medium">Estimated Delivery</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getDeliveryEstimate()}
                </p>
              </div>
            </div>
            <div className="flex">
              <ShieldCheck className="h-5 w-5 text-primary mr-3" />
              <div>
                <p className="text-sm font-medium">30-Day Returns</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Shop with confidence
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product details tabs */}
      <Tabs defaultValue="details" className="mb-12">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger 
            value="details"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent px-4 py-3 data-[state=active]:bg-transparent"
          >
            Details
          </TabsTrigger>
          <TabsTrigger 
            value="specifications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent px-4 py-3 data-[state=active]:bg-transparent"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger 
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent px-4 py-3 data-[state=active]:bg-transparent"
          >
            Reviews ({product.reviewCount})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-6">
          <div className="prose dark:prose-invert max-w-none">
            <h3>Product Details</h3>
            <p>{product.description}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nisl nisl aliquet nisl, eget aliquet nisl nisl eget nisl. Sed euismod, nisl nec ultricies lacinia, nisl nisl aliquet nisl, eget aliquet nisl nisl eget nisl.</p>
            
            <h4>Features</h4>
            <ul>
              {product.tags.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
              <li>High-quality materials</li>
              <li>Durable construction</li>
              <li>Easy to use and maintain</li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="specifications" className="mt-6">
          <div className="prose dark:prose-invert max-w-none">
            <h3>Technical Specifications</h3>
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Brand</td>
                  <td className="py-2">{product.brand}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Model</td>
                  <td className="py-2">{product.name}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Category</td>
                  <td className="py-2">{product.category}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Tags</td>
                  <td className="py-2">{product.tags.join(', ')}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Release Date</td>
                  <td className="py-2">{new Date(product.createdAt).toLocaleDateString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <ProductReviews productId={product.id} initialCount={product.reviewCount} />
        </TabsContent>
      </Tabs>
      
      {/* Related products / Recommendations */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
        <ProductRecommendations 
          products={relatedProducts} 
          currentProductId={product.id}
        />
      </div>
    </div>
  );
};

export default ProductDetails;