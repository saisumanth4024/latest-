import { useState, useRef, ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  selectUser, 
  selectAvatarUploadState,
  uploadUserAvatar,
  setAvatarPreview,
  clearAvatarPreview,
  resetAvatarUploadState 
} from './profileSlice';
import { Button } from '@/components/ui';
import { useToast } from '@/hooks/useToast';

export default function AvatarUploader() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { uploading, progress, preview, error } = useAppSelector(selectAvatarUploadState);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  
  const [dragActive, setDragActive] = useState(false);
  
  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    handleFile(file);
  };
  
  // Handle drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  // Process the selected file
  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error({
        title: 'Invalid File Type',
        description: 'Please select an image file (JPG, PNG, etc.)'
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error({
        title: 'File Too Large',
        description: 'Please select an image under 5MB'
      });
      return;
    }
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        dispatch(setAvatarPreview(result));
      }
    };
    reader.readAsDataURL(file);
    
    // Store the file for upload
    setSelectedFile(file);
  };
  
  // Trigger file input click
  const openFileSelector = () => {
    inputRef.current?.click();
  };
  
  // Hold the selected file for upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Upload the selected file
  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    
    try {
      await dispatch(uploadUserAvatar({ 
        file: selectedFile, 
        userId: user.id 
      }));
      
      toast.success({
        title: 'Avatar Updated',
        description: 'Your profile picture has been updated successfully.'
      });
      
      setSelectedFile(null);
      
      // Reset state after successful upload
      setTimeout(() => {
        dispatch(resetAvatarUploadState());
      }, 2000);
    } catch (error: any) {
      toast.error({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload avatar'
      });
    }
  };
  
  // Cancel the upload
  const handleCancel = () => {
    setSelectedFile(null);
    dispatch(clearAvatarPreview());
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
        {/* Current avatar or preview */}
        <div className="relative">
          <div 
            className={`h-24 w-24 rounded-full overflow-hidden border-2 ${
              preview ? 'border-primary' : 'border-transparent'
            }`}
          >
            <img 
              src={preview || user?.avatar || '/placeholder-avatar.png'} 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-sm font-medium">{progress}%</div>
                  <div className="mt-1 h-1 w-full bg-gray-300 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3 flex-1">
          <h3 className="text-sm font-medium">Profile Picture</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Upload a new avatar image. JPG, PNG or GIF, max 5MB.
          </p>
          
          {/* File upload area */}
          <div 
            className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-300 dark:border-gray-700 hover:border-primary'
            }`}
            onClick={openFileSelector}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file"
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              disabled={uploading}
            />
            <p className="text-xs">
              {dragActive ? (
                <span className="font-medium">Drop image here</span>
              ) : (
                <span>
                  <span className="font-medium text-primary">Click to upload</span>
                  {' '}or drag and drop
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {/* Actions */}
      {preview && (
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            disabled={uploading}
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </Button>
          <Button
            disabled={uploading}
            onClick={handleUpload}
            type="button"
          >
            {uploading ? 'Uploading...' : 'Save Avatar'}
          </Button>
        </div>
      )}
    </div>
  );
}