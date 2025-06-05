import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from '@/router/wouterCompat';
import { Banner, BannerPosition } from '../../types';
import { useGetBannersByPositionQuery, useTrackBannerViewMutation } from '../../contentApi';
import { setActiveBanner } from '../../contentSlice';
import { VideoPlayer } from '../video/VideoPlayer';

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface BannerDisplayProps {
  position: BannerPosition;
  className?: string;
  maxHeight?: string | number;
  aspectRatio?: number;
  autoRotate?: boolean;
  rotationInterval?: number; // milliseconds
  onBannerClick?: (banner: Banner) => void;
}

export const BannerDisplay: React.FC<BannerDisplayProps> = ({
  position,
  className = '',
  maxHeight = '400px',
  aspectRatio = 2.5, // default 2.5:1 aspect ratio
  autoRotate = true,
  rotationInterval = 5000, // 5 seconds default
  onBannerClick
}) => {
  const dispatch = useDispatch();
  const { data: banners, isLoading, error } = useGetBannersByPositionQuery(position);
  const [trackView] = useTrackBannerViewMutation();
  
  // For carousel
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Track when banner is viewed
  useEffect(() => {
    if (banners && banners.length > 0) {
      const activeBanner = banners[activeIndex];
      
      // Track view in analytics
      trackView(activeBanner.id);
      
      // Set as active banner in Redux
      dispatch(setActiveBanner(activeBanner));
    }
  }, [banners, activeIndex, trackView, dispatch]);
  
  // Auto-rotate carousel
  useEffect(() => {
    if (autoRotate && banners && banners.length > 1) {
      const timer = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % banners.length);
      }, rotationInterval);
      
      return () => clearInterval(timer);
    }
  }, [autoRotate, banners, rotationInterval]);
  
  // Handle banner click
  const handleClick = (banner: Banner) => {
    if (onBannerClick) {
      onBannerClick(banner);
    }
  };
  
  if (isLoading) {
    return (
      <Card className={className} style={{ maxHeight }}>
        <CardContent className="p-0">
          <AspectRatio ratio={aspectRatio}>
            <Skeleton className="h-full w-full rounded-none" />
          </AspectRatio>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !banners || banners.length === 0) {
    return null; // Don't show anything if there are no banners or an error
  }
  
  // If there's only one banner
  if (banners.length === 1) {
    return renderSingleBanner(banners[0], className, maxHeight, aspectRatio, handleClick);
  }
  
  // If there are multiple banners, render a carousel
  return (
    <Card className={className} style={{ maxHeight }}>
      <CardContent className="p-0">
        <Carousel
          opts={{ loop: true }}
          className="w-full"
          index={activeIndex}
          onSelect={setActiveIndex}
        >
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                {renderBannerContent(banner, aspectRatio, handleClick)}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </CardContent>
    </Card>
  );
};

// Helper function to render a single banner
function renderSingleBanner(
  banner: Banner, 
  className: string, 
  maxHeight: string | number, 
  aspectRatio: number,
  onClick: (banner: Banner) => void
) {
  return (
    <Card className={className} style={{ maxHeight }}>
      <CardContent className="p-0">
        {renderBannerContent(banner, aspectRatio, onClick)}
      </CardContent>
    </Card>
  );
}

// Helper function to render banner content based on type
function renderBannerContent(
  banner: Banner, 
  aspectRatio: number,
  onClick: (banner: Banner) => void
) {
  // For image banners
  if (banner.type === 'image') {
    const content = typeof banner.content === 'string' 
      ? banner.content 
      : (banner.content as any)?.url || '';
    
    return (
      <div 
        className="relative group cursor-pointer" 
        onClick={() => onClick(banner)}
      >
        <AspectRatio ratio={aspectRatio}>
          <img
            src={content}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-100 transition-opacity">
            {banner.title && (
              <h2 className="text-white text-xl md:text-2xl font-bold mb-2">{banner.title}</h2>
            )}
            
            {banner.buttonText && banner.link && (
              <div className="mt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="group-hover:bg-primary transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = banner.link!;
                  }}
                >
                  {banner.buttonText}
                </Button>
              </div>
            )}
          </div>
        </AspectRatio>
      </div>
    );
  }
  
  // For video banners
  if (banner.type === 'video') {
    return (
      <div className="relative">
        <VideoPlayer
          video={banner.content as any}
          autoPlay
          loop
          muted
          controls={false}
          className="w-full"
          height="auto"
        />
        
        <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 via-transparent to-transparent">
          {banner.title && (
            <h2 className="text-white text-xl md:text-2xl font-bold mb-2">{banner.title}</h2>
          )}
          
          {banner.buttonText && banner.link && (
            <div className="mt-2">
              <Link href={banner.link}>
                <Button variant="secondary" size="sm">
                  {banner.buttonText}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // For HTML banners
  if (banner.type === 'html') {
    return (
      <div
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: banner.content as string }}
      />
    );
  }
  
  // For carousel banners (nested carousel)
  if (banner.type === 'carousel') {
    return (
      <Carousel className="w-full">
        <CarouselContent>
          {Array.isArray(banner.content) && banner.content.map((item, index) => (
            <CarouselItem key={index}>
              <AspectRatio ratio={aspectRatio}>
                <img
                  src={(item as any)?.url || ''}
                  alt={`${banner.title} - Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    );
  }
  
  // Fallback
  return (
    <AspectRatio ratio={aspectRatio}>
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Banner content unavailable</p>
      </div>
    </AspectRatio>
  );
}