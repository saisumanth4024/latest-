import React, { useState, useRef, ChangeEvent } from 'react';
import { Trash2, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// Define accepted image types and max file size (5MB)
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const MAX_FILES = 5;

export interface UploadedImage {
  file: File;
  preview: string;
  id: string;
}

interface ImageUploaderProps {
  onImagesChange: (images: UploadedImage[]) => void;
  existingImages?: string[];
  maxImages?: number;
  label?: string;
  helpText?: string;
}

/**
 * Component for uploading and previewing product images
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesChange,
  existingImages = [],
  maxImages = MAX_FILES,
  label = 'Product Images',
  helpText = 'Upload images of your product (JPEG, PNG, WEBP, GIF up to 5MB each)'
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(existingImages);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Generate a unique ID for each uploaded image
  const generateImageId = () => `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Reset error
    setError(null);
    
    // Check if we would exceed the maximum number of images
    if (uploadedImages.length + existingImageUrls.length + selectedFiles.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images`);
      return;
    }

    // Validate file types and sizes
    const validFiles: UploadedImage[] = [];
    const invalidFiles: string[] = [];

    selectedFiles.forEach(file => {
      // Check file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        invalidFiles.push(`${file.name} (invalid type)`);
        return;
      }
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (exceeds 5MB)`);
        return;
      }
      
      // Create preview URL and add to valid files
      const preview = URL.createObjectURL(file);
      validFiles.push({
        file,
        preview,
        id: generateImageId()
      });
    });

    if (invalidFiles.length > 0) {
      setError(`Some files couldn't be added: ${invalidFiles.join(', ')}`);
    }

    if (validFiles.length > 0) {
      const updatedImages = [...uploadedImages, ...validFiles];
      setUploadedImages(updatedImages);
      onImagesChange(updatedImages);
    }

    // Reset the file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove an uploaded image
  const removeUploadedImage = (idToRemove: string) => {
    const updatedImages = uploadedImages.filter(img => img.id !== idToRemove);
    
    // Revoke the URL to avoid memory leaks
    const imageToRemove = uploadedImages.find(img => img.id === idToRemove);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    setUploadedImages(updatedImages);
    onImagesChange(updatedImages);
    
    toast({
      title: "Image removed",
      description: "The image has been removed from the upload queue",
    });
  };

  // Remove an existing image
  const removeExistingImage = (index: number) => {
    const newExistingImages = [...existingImageUrls];
    newExistingImages.splice(index, 1);
    setExistingImageUrls(newExistingImages);
    
    toast({
      title: "Image removed",
      description: "The image has been removed",
    });
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Mock image upload function (in a real app, this would call your backend API)
  const simulateImageUpload = async () => {
    setIsUploading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsUploading(false);
    
    toast({
      title: "Images uploaded successfully",
      description: `${uploadedImages.length} images have been uploaded`,
      variant: "success",
    });
    
    // In a real app, you would get back URLs from your server
    const mockUploadedUrls = uploadedImages.map(img => URL.createObjectURL(img.file));
    return mockUploadedUrls;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="product-images">{label}</Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          {helpText}
        </p>
      </div>
      
      {/* Hidden file input */}
      <Input
        type="file"
        id="product-images"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        multiple
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      
      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Image previews grid */}
      {(uploadedImages.length > 0 || existingImageUrls.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
          {/* Existing images */}
          {existingImageUrls.map((url, index) => (
            <div key={`existing-${index}`} className="relative group aspect-square">
              <img
                src={url}
                alt={`Existing product image ${index + 1}`}
                className="h-full w-full object-cover rounded-md border border-gray-200 dark:border-gray-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeExistingImage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {/* New uploaded images */}
          {uploadedImages.map((image) => (
            <div key={image.id} className="relative group aspect-square">
              <img
                src={image.preview}
                alt={`Preview of ${image.file.name}`}
                className="h-full w-full object-cover rounded-md border border-gray-200 dark:border-gray-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeUploadedImage(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                New
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload buttons */}
      <div className="flex flex-wrap gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={triggerFileInput}
          disabled={uploadedImages.length + existingImageUrls.length >= maxImages || isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          Select Images
        </Button>
        
        {uploadedImages.length > 0 && (
          <Button 
            type="button"
            onClick={simulateImageUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Upload {uploadedImages.length} Image{uploadedImages.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        )}
      </div>
      
      {/* Upload status/counter */}
      <div className="text-sm text-muted-foreground">
        {uploadedImages.length + existingImageUrls.length} of {maxImages} images used
      </div>
    </div>
  );
};

export default ImageUploader;