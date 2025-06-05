import React from 'react';
import { Link } from '@/router/wouterCompat';
import { Video } from '../../types';
import { useDispatch } from 'react-redux';
import { setCurrentVideo, setIsPlaying } from '../../contentSlice';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Play,
  Clock,
  Eye
} from 'lucide-react';

// Helper function to format view counts
const formatViewCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  } else {
    return count.toString();
  }
};

// Helper function to format time (seconds -> MM:SS format)
const formatDuration = (seconds: number): string => {
  if (isNaN(seconds)) return '';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format time ago from timestamp
const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
  
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
};

interface VideoCardProps {
  video: Video;
  onClick?: (video: Video) => void;
  variant?: 'default' | 'compact' | 'featured';
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onClick,
  variant = 'default'
}) => {
  const dispatch = useDispatch();
  
  const handleClick = () => {
    if (onClick) {
      onClick(video);
    } else {
      // Default action: set as current video and start playing
      dispatch(setCurrentVideo(video));
      dispatch(setIsPlaying(true));
    }
  };
  
  if (variant === 'compact') {
    return (
      <div className="group flex gap-3 cursor-pointer hover:bg-accent/50 rounded-lg p-2" onClick={handleClick}>
        <div className="relative w-24 h-20 flex-shrink-0 rounded-md overflow-hidden">
          <img 
            src={video.thumbnailUrl || '/placeholders/video-thumbnail.jpg'} 
            alt={video.title}
            className="w-full h-full object-cover" 
          />
          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
            {formatDuration(video.videoMetadata?.duration || 0)}
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-medium line-clamp-2">{video.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {formatViewCount(video.viewCount || 0)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(video.createdAt)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === 'featured') {
    return (
      <div 
        className="group relative rounded-xl overflow-hidden aspect-video cursor-pointer"
        onClick={handleClick}
      >
        <img 
          src={video.thumbnailUrl || '/placeholders/video-thumbnail.jpg'} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-end p-4">
          <h2 className="text-white text-xl font-bold mb-2">{video.title}</h2>
          <p className="text-white/80 line-clamp-2 mb-4">{video.description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-white/80 flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {formatViewCount(video.viewCount || 0)}
              </span>
              <span className="text-white/80 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatDuration(video.videoMetadata?.duration || 0)}
              </span>
            </div>
            <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="mr-2 h-4 w-4" />
              Play
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Default variant
  return (
    <Card className="group overflow-hidden cursor-pointer h-full flex flex-col" onClick={handleClick}>
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={video.thumbnailUrl || '/placeholders/video-thumbnail.jpg'} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 rounded">
          {formatDuration(video.videoMetadata?.duration || 0)}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <Button size="sm" variant="secondary" className="rounded-full">
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="flex-grow pt-3">
        <h3 className="font-medium line-clamp-2">{video.title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            {formatViewCount(video.viewCount || 0)} views
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(video.createdAt)}
          </span>
        </div>
      </CardContent>
      
      {video.tags && video.tags.length > 0 && (
        <CardFooter className="pt-0 pb-3 flex gap-1 flex-wrap">
          {video.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {video.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{video.tags.length - 3} more
            </Badge>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
  onVideoClick?: (video: Video) => void;
  emptyMessage?: string;
  variant?: 'default' | 'compact';
  columns?: 1 | 2 | 3 | 4 | 5;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  isLoading = false,
  onVideoClick,
  emptyMessage = "No videos found",
  variant = 'default',
  columns = 3
}) => {
  // Grid columns classes
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  };
  
  if (isLoading) {
    return (
      <div className={`grid ${columnClasses[columns]} gap-4`}>
        {Array.from({ length: 9 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-video">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="pt-3">
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h3 className="text-lg font-medium">{emptyMessage}</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <div className="flex flex-col divide-y">
        {videos.map(video => (
          <VideoCard 
            key={video.id} 
            video={video} 
            onClick={onVideoClick}
            variant="compact"
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className={`grid ${columnClasses[columns]} gap-4`}>
      {videos.map(video => (
        <VideoCard 
          key={video.id} 
          video={video} 
          onClick={onVideoClick}
        />
      ))}
    </div>
  );
};