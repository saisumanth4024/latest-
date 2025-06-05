import React, { useState, useEffect } from 'react';
import { useRoute } from '@/router/wouterCompat';
import { useGetProductByIdQuery } from '../productsApi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { uploadProductImages, clearImageUploadState } from '../productsSlice';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Heart, ShoppingCart, Truck, ShieldCheck, ArrowLeft, ChevronRight, ImageIcon, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import ImageUploader, { UploadedImage } from './ImageUploader';

const ProductDetailPage: React.FC = () => {
  const [match, params] = useRoute('/products/:productId');
  const productId = parseInt(params?.productId || '0');
  
  const dispatch = useAppDispatch();
  const { status: uploadStatus, error: uploadError } = useAppSelector(
    (state) => state.products.imageUpload
  );
  const { toast } = useToast();
  
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Reset upload state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearImageUploadState());
    };
  }, [dispatch]);
  
  // Handle successful image upload
  useEffect(() => {
    if (uploadStatus === 'succeeded') {
      toast({
        title: 'Images Uploaded Successfully',
        description: 'Your product images have been updated.',
        variant: 'success',
      });
      setIsEditMode(false);
      dispatch(clearImageUploadState());
    } else if (uploadStatus === 'failed' && uploadError) {
      toast({
        title: 'Upload Failed',
        description: uploadError,
        variant: 'destructive',
      });
    }
  }, [uploadStatus, uploadError, toast, dispatch]);
  
  // Handle the save action for uploaded images
  const handleSaveImages = () => {
    if (uploadedImages.length > 0) {
      dispatch(uploadProductImages({
        productId,
        images: uploadedImages
      }));
    } else {
      toast({
        title: 'No Images Selected',
        description: 'Please select at least one image to upload',
        variant: 'warning',
      });
    }
  };

  // Placeholder images for demo
  const demoImages = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000'
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg w-3/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg w-1/2"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg w-1/3"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Error Loading Product</h2>
          <p className="mt-2 text-red-500 dark:text-red-300">
            There was a problem loading this product. Please try again later.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Placeholder data for demo purposes
  const demoProduct = {
    id: productId,
    name: "Premium Wireless Headphones",
    description: "Experience exceptional sound quality with our premium wireless headphones. Featuring advanced noise cancellation technology, comfortable ear cushions, and 30-hour battery life. Perfect for music enthusiasts and professionals alike.",
    price: 199.99,
    discountPrice: 149.99,
    image: demoImages[0],
    category: "Electronics",
    brand: "SoundMaster",
    rating: 4.8,
    reviews: 128,
    inStock: true,
    isNew: true,
    tags: ["wireless", "noise-cancellation", "premium-audio", "bluetooth"],
    specs: {
      connectivity: "Bluetooth 5.0",
      batteryLife: "30 hours",
      noiseCancel: true,
      waterResistant: true,
      weight: "250g"
    },
    colors: ["Black", "Silver", "Blue"],
    images: demoImages
  };

  // Use demo data for the UI
  const displayProduct = product || demoProduct;
  
  // Handle quantity changes
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  // For managing the selected image
  const handleImageChange = (index: number) => setSelectedImage(index);
  
  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          <a href="/" className="hover:text-primary">Home</a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <a href="/products" className="hover:text-primary">Products</a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <a href={`/products/category/${displayProduct.category}`} className="hover:text-primary">{displayProduct.category}</a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-800 dark:text-gray-200">{displayProduct.name}</span>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Product Images */}
          <div className="w-full lg:w-3/5">
            <div className="flex flex-col">
              {/* Main image */}
              <div className="relative h-96 bg-white dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
                <img 
                  src={displayProduct.images?.[selectedImage] || displayProduct.image} 
                  alt={displayProduct.name}
                  className="w-full h-full object-contain"
                />
                {displayProduct.isNew && (
                  <Badge className="absolute top-4 left-4 bg-primary text-white">New</Badge>
                )}
                {displayProduct.discountPrice && (
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                    {Math.round(((displayProduct.price - displayProduct.discountPrice) / displayProduct.price) * 100)}% OFF
                  </Badge>
                )}
              </div>
              
              {/* Thumbnail images */}
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {(displayProduct.images || [displayProduct.image]).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${displayProduct.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="w-full lg:w-2/5">
            <div className="space-y-6">
              {/* Title and rating */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{displayProduct.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star 
                        key={index}
                        className={`h-4 w-4 ${
                          index < Math.floor(displayProduct.rating) 
                            ? 'text-yellow-500 fill-yellow-500' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {displayProduct.rating} ({displayProduct.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Price */}
              <div className="flex items-end gap-2">
                {displayProduct.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-50">${displayProduct.discountPrice}</span>
                    <span className="text-xl text-gray-500 dark:text-gray-400 line-through">${displayProduct.price}</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-50">${displayProduct.price}</span>
                )}
              </div>
              
              {/* Availability */}
              <div>
                <p className="text-sm font-medium">
                  Availability: 
                  <span className={`ml-1 ${displayProduct.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {displayProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </p>
              </div>
              
              {/* Color options */}
              {displayProduct.colors && displayProduct.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</h3>
                  <div className="flex gap-2">
                    {displayProduct.colors.map((color, index) => (
                      <button
                        key={index}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        style={{ background: color.toLowerCase() }}
                        aria-label={color}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity selector */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</h3>
                <div className="flex items-center w-32">
                  <button
                    onClick={decreaseQuantity}
                    className="flex-1 h-10 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-l-md hover:bg-gray-200 dark:hover:bg-gray-700"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    className="flex-1 h-10 border-0 bg-gray-100 dark:bg-gray-800 text-center text-gray-700 dark:text-gray-300"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="flex-1 h-10 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-4">
                <Button className="flex-1 h-12" disabled={!displayProduct.inStock}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="h-12 w-12">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Shipping info */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <Truck className="h-4 w-4 mr-2 text-primary" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product details */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="images">
                <ImageIcon className="h-4 w-4 mr-2" />
                Images
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="p-4">
              <div className="prose dark:prose-invert max-w-none">
                <p>{displayProduct.description}</p>
                <ul className="mt-4">
                  {displayProduct.tags.map((tag, index) => (
                    <li key={index}>{tag.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="p-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <table className="w-full text-left">
                  <tbody>
                    {displayProduct.specs && Object.entries(displayProduct.specs).map(([key, value]) => (
                      <tr key={key} className="border-b dark:border-gray-700">
                        <td className="py-3 text-gray-700 dark:text-gray-300 font-medium w-1/3">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </td>
                        <td className="py-3 text-gray-800 dark:text-gray-200">
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="p-4">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">Customer Reviews</h3>
                  <Button>Write a Review</Button>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    This is a demo product. Reviews will be available in the production version.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="images" className="p-4">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">Product Images</h3>
                  <Button 
                    variant="outline"
                    onClick={() => setIsEditMode(!isEditMode)}
                  >
                    {isEditMode ? 'Cancel Editing' : 'Edit Images'}
                  </Button>
                </div>
                
                {isEditMode ? (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                    <ImageUploader 
                      onImagesChange={setUploadedImages}
                      existingImages={(displayProduct.images || [displayProduct.image])}
                      maxImages={8}
                      label="Product Images"
                      helpText="Upload high-quality images of your product. First image will be used as the main product image."
                    />
                    
                    {/* Upload status message */}
                    {uploadStatus === 'loading' && (
                      <Alert className="mt-4">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        <AlertTitle>Uploading Images...</AlertTitle>
                        <AlertDescription>
                          Please wait while your images are being processed.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditMode(false)}
                        disabled={uploadStatus === 'loading'}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveImages}
                        disabled={uploadedImages.length === 0 || uploadStatus === 'loading'}
                      >
                        {uploadStatus === 'loading' ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Save Images
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {(displayProduct.images || [displayProduct.image]).map((image, index) => (
                      <div key={index} className="aspect-square rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img 
                          src={image} 
                          alt={`${displayProduct.name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="p-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {index === 0 ? 'Main Image' : `Image ${index + 1}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProductDetailPage;