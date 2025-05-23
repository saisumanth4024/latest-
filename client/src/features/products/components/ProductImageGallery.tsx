import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  Maximize2,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogClose
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ProductImageGalleryProps {
  mainImage: string;
  images: string[];
  productName: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  mainImage,
  images = [],
  productName
}) => {
  // If no additional images provided, use main image only
  const allImages = images.length > 0 ? [mainImage, ...images] : [mainImage];
  const uniqueImages = [...new Set(allImages)];
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogImageIndex, setDialogImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };
  
  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? uniqueImages.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === uniqueImages.length - 1 ? 0 : prev + 1
    );
  };
  
  const openFullScreenImage = (index: number) => {
    setDialogImageIndex(index);
    setIsDialogOpen(true);
  };
  
  const handleDialogPrevImage = () => {
    setDialogImageIndex((prev) => 
      prev === 0 ? uniqueImages.length - 1 : prev - 1
    );
  };
  
  const handleDialogNextImage = () => {
    setDialogImageIndex((prev) => 
      prev === uniqueImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main image */}
        <div 
          className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
        >
          <img
            src={uniqueImages[selectedImageIndex]}
            alt={`${productName} - Image ${selectedImageIndex + 1}`}
            className={cn(
              "absolute inset-0 w-full h-full object-contain transition-all duration-300",
              isZoomed ? "scale-150" : "scale-100"
            )}
          />
          
          {/* Navigation buttons */}
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-white/70 dark:bg-black/70 rounded-full shadow-md text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-black focus:outline-none"
            onClick={handlePrevImage}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-white/70 dark:bg-black/70 rounded-full shadow-md text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-black focus:outline-none"
            onClick={handleNextImage}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          {/* Control buttons */}
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button
              className="h-8 w-8 flex items-center justify-center bg-white/70 dark:bg-black/70 rounded-full shadow-md text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-black focus:outline-none"
              onClick={() => setIsZoomed(!isZoomed)}
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            
            <button
              className="h-8 w-8 flex items-center justify-center bg-white/70 dark:bg-black/70 rounded-full shadow-md text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-black focus:outline-none"
              onClick={() => openFullScreenImage(selectedImageIndex)}
              aria-label="View full screen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
          
          {/* Image counter */}
          <div className="absolute bottom-2 left-2 bg-white/70 dark:bg-black/70 text-gray-800 dark:text-gray-200 text-xs py-1 px-2 rounded">
            {selectedImageIndex + 1} / {uniqueImages.length}
          </div>
        </div>
        
        {/* Thumbnails */}
        {uniqueImages.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {uniqueImages.map((image, index) => (
              <button
                key={index}
                className={`relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border ${
                  selectedImageIndex === index 
                    ? 'border-primary ring-2 ring-primary/30' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={image}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Fullscreen image dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-screen-xl w-[90vw] h-[90vh] p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <div className="relative w-full h-full flex items-center justify-center">
            <DialogClose className="absolute right-4 top-4 z-10">
              <Button variant="ghost" size="icon">
                <X className="h-6 w-6" />
              </Button>
            </DialogClose>
            
            <img
              src={uniqueImages[dialogImageIndex]}
              alt={`${productName} - Fullscreen Image ${dialogImageIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />
            
            {/* Navigation buttons */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-white/70 dark:bg-black/70 rounded-full shadow-md text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-black focus:outline-none"
              onClick={handleDialogPrevImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-white/70 dark:bg-black/70 rounded-full shadow-md text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-black focus:outline-none"
              onClick={handleDialogNextImage}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-4 bg-white/70 dark:bg-black/70 text-gray-800 dark:text-gray-200 text-sm py-1 px-3 rounded">
              {dialogImageIndex + 1} / {uniqueImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductImageGallery;