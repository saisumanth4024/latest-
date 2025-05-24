import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentTime,
  setDuration,
  setIsPlaying,
  setVolume,
  setMuted,
  setFullscreen,
  setPlaybackRate,
  selectCurrentVideo,
  selectIsPlaying,
  selectVolume,
  selectIsMuted,
  selectPlaybackRate,
  selectPlayerSettings,
  nextInPlaylist,
  selectCurrentPlaylist
} from '../../contentSlice';
import { useGetVideoByIdQuery } from '../../contentApi';
import { Video, VideoSource } from '../../types';

import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Maximize,
  Minimize,
  Settings,
  Clock,
  Subtitles,
  RotateCcw,
  RotateCw,
} from 'lucide-react';

import {
  Slider
} from '@/components/ui/slider';
import {
  Button
} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to format time (seconds -> MM:SS format)
const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Helper to extract best quality from sources
const getBestQualitySource = (sources: VideoSource[]): VideoSource | undefined => {
  if (!sources || sources.length === 0) return undefined;
  
  // Map quality to a number for sorting
  const qualityMap: Record<string, number> = {
    '240p': 1,
    '360p': 2,
    '480p': 3,
    '720p': 4,
    '1080p': 5,
    '1440p': 6, 
    '2160p': 7
  };
  
  // Sort by quality (highest first)
  return [...sources].sort((a, b) => qualityMap[b.quality] - qualityMap[a.quality])[0];
};

interface VideoPlayerProps {
  videoId?: string;
  video?: Video;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  height?: string | number;
  width?: string | number;
  onEnded?: () => void;
  showPlaylist?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  video,
  autoPlay = false,
  controls = true,
  loop = false,
  muted = false,
  className = '',
  height = 'auto',
  width = '100%',
  onEnded,
  showPlaylist = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  
  // Get the current video from state or props
  const currentVideoFromState = useSelector(selectCurrentVideo);
  const currentVideo = video || currentVideoFromState;
  
  // If videoId is provided but no video, fetch it
  const { data: fetchedVideo, isLoading } = useGetVideoByIdQuery(
    videoId || '', 
    { skip: !videoId || !!video || !!currentVideoFromState }
  );
  
  // Get player state from Redux
  const isPlaying = useSelector(selectIsPlaying);
  const volume = useSelector(selectVolume);
  const isMuted = useSelector(selectIsMuted);
  const playbackRate = useSelector(selectPlaybackRate);
  const playerSettings = useSelector(selectPlayerSettings);
  const playlist = useSelector(selectCurrentPlaylist);
  
  // Local state
  const [currentTime, setCurrentTimeState] = useState(0);
  const [duration, setDurationState] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isFullscreen, setIsFullscreenState] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<string>(playerSettings.quality || '720p');
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string | null>(null);
  
  // Get the video to display (from props, state, or fetched)
  const videoToPlay = video || currentVideoFromState || fetchedVideo;
  
  // Effect to initialize video with settings
  useEffect(() => {
    if (videoRef.current && videoToPlay) {
      // Set initial volume
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = isMuted;
      
      // Set playback rate
      videoRef.current.playbackRate = playbackRate;
      
      // Set loop
      videoRef.current.loop = loop;
      
      // Autoplay if specified
      if (autoPlay) {
        videoRef.current.play().catch(error => {
          console.error('Autoplay failed:', error);
        });
      }
      
      // Update available qualities
      if (videoToPlay.sources) {
        const qualities = videoToPlay.sources.map(source => source.quality);
        setAvailableQualities(qualities);
        
        // Set preferred quality if available, otherwise use highest
        if (qualities.includes(playerSettings.quality)) {
          setSelectedQuality(playerSettings.quality);
        } else {
          const bestQuality = getBestQualitySource(videoToPlay.sources)?.quality || '720p';
          setSelectedQuality(bestQuality);
        }
      }
      
      // Set subtitles if available
      if (videoToPlay.subtitles?.length) {
        // If player has a language preference, use it
        if (playerSettings.subtitlesEnabled && playerSettings.subtitlesLanguage) {
          const preferredSubtitle = videoToPlay.subtitles.find(
            sub => sub.language === playerSettings.subtitlesLanguage
          );
          
          if (preferredSubtitle) {
            setSelectedSubtitle(preferredSubtitle.language);
          }
        }
      }
    }
  }, [videoToPlay, autoPlay, isMuted, volume, playbackRate, loop, playerSettings]);
  
  // Handle play/pause
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(error => {
          console.error('Play failed:', error);
          dispatch(setIsPlaying(false));
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, dispatch]);
  
  // Handle volume changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);
  
  // Handle playback rate changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);
  
  // Handle fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreenState(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Handle controls visibility
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      
      const timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
      
      setControlsTimeout(timeout);
    };
    
    const handleMouseLeave = () => {
      if (isPlaying) {
        setShowControls(false);
      }
    };
    
    const containerEl = videoContainerRef.current;
    if (containerEl) {
      containerEl.addEventListener('mousemove', handleMouseMove);
      containerEl.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (containerEl) {
        containerEl.removeEventListener('mousemove', handleMouseMove);
        containerEl.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout, isPlaying]);
  
  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTimeState(time);
      dispatch(setCurrentTime(time));
    }
  };
  
  const handleDurationChange = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setDurationState(videoDuration);
      dispatch(setDuration(videoDuration));
    }
  };
  
  const handleProgress = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    }
  };
  
  const handleVideoEnded = () => {
    dispatch(setIsPlaying(false));
    
    // If custom onEnded handler provided, call it
    if (onEnded) {
      onEnded();
    } 
    // If in a playlist, play next video
    else if (playlist.playlistId) {
      dispatch(nextInPlaylist());
    }
    // Otherwise, if looping is enabled, restart video
    else if (loop && videoRef.current) {
      videoRef.current.currentTime = 0;
      dispatch(setIsPlaying(true));
    }
  };
  
  // Player control handlers
  const handlePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying));
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    dispatch(setVolume(newVolume));
    
    if (newVolume > 0 && isMuted) {
      dispatch(setMuted(false));
    } else if (newVolume === 0 && !isMuted) {
      dispatch(setMuted(true));
    }
  };
  
  const handleMuteToggle = () => {
    dispatch(setMuted(!isMuted));
  };
  
  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
    }
  };
  
  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      if (videoContainerRef.current?.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    dispatch(setFullscreen(!isFullscreen));
  };
  
  const handlePlaybackRateChange = (value: string) => {
    const rate = parseFloat(value);
    dispatch(setPlaybackRate(rate));
  };
  
  const handleQualityChange = (quality: string) => {
    if (!videoToPlay?.sources) return;
    
    // Find the selected quality source
    const source = videoToPlay.sources.find(s => s.quality === quality);
    if (!source) return;
    
    // Save current time and playing state
    const currentTime = videoRef.current?.currentTime || 0;
    const wasPlaying = isPlaying;
    
    // Set the new quality
    setSelectedQuality(quality);
    
    // Update video source and restore state
    if (videoRef.current) {
      videoRef.current.src = source.url;
      videoRef.current.load();
      videoRef.current.currentTime = currentTime;
      
      if (wasPlaying) {
        videoRef.current.play().catch(error => {
          console.error('Play failed after quality change:', error);
          dispatch(setIsPlaying(false));
        });
      }
    }
  };
  
  const handleSubtitleChange = (language: string) => {
    setSelectedSubtitle(language === 'none' ? null : language);
  };
  
  // Find the current selected video source based on quality
  const currentSource = videoToPlay?.sources?.find(s => s.quality === selectedQuality) || 
                        getBestQualitySource(videoToPlay?.sources || []);
  
  // Find the current selected subtitle track
  const currentSubtitle = videoToPlay?.subtitles?.find(s => s.language === selectedSubtitle);
  
  // Loading state
  if (isLoading) {
    return (
      <Card className={className} style={{ width, height }}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="space-y-4 w-full">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-[200px] w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // No video to play
  if (!videoToPlay) {
    return (
      <Card className={className} style={{ width, height }}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <h3 className="text-lg font-medium">No video selected</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Select a video to play or check the video ID.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div 
      ref={videoContainerRef}
      className={`relative overflow-hidden bg-black ${className}`}
      style={{ width, height }}
    >
      <video
        ref={videoRef}
        src={currentSource?.url || videoToPlay.videoUrl}
        poster={videoToPlay.thumbnailUrl}
        className="w-full h-full object-contain"
        onClick={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onProgress={handleProgress}
        onEnded={handleVideoEnded}
      >
        {/* Add subtitle tracks if available and selected */}
        {currentSubtitle && (
          <track 
            kind="subtitles" 
            src={currentSubtitle.url} 
            label={currentSubtitle.label}
            srcLang={currentSubtitle.language}
            default
          />
        )}
      </video>
      
      {/* Controls overlay */}
      {controls && (
        <div className={`absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/75 via-transparent to-black/10 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
          {/* Top controls */}
          <div className="p-4 flex justify-between items-center">
            <h3 className="text-white font-medium truncate max-w-[80%]">
              {videoToPlay.title}
            </h3>
            
            <div className="flex items-center space-x-2">
              {/* Settings dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs">Playback Speed</DropdownMenuLabel>
                    <div className="px-2 py-1">
                      <Select value={playbackRate.toString()} onValueChange={handlePlaybackRateChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Speed" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.25">0.25x</SelectItem>
                          <SelectItem value="0.5">0.5x</SelectItem>
                          <SelectItem value="0.75">0.75x</SelectItem>
                          <SelectItem value="1">Normal</SelectItem>
                          <SelectItem value="1.25">1.25x</SelectItem>
                          <SelectItem value="1.5">1.5x</SelectItem>
                          <SelectItem value="1.75">1.75x</SelectItem>
                          <SelectItem value="2">2x</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs">Quality</DropdownMenuLabel>
                    <div className="px-2 py-1">
                      <Select value={selectedQuality} onValueChange={handleQualityChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Quality" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableQualities.map(quality => (
                            <SelectItem key={quality} value={quality}>
                              {quality}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </DropdownMenuGroup>
                  
                  {videoToPlay.subtitles && videoToPlay.subtitles.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs">Subtitles</DropdownMenuLabel>
                        <div className="px-2 py-1">
                          <Select 
                            value={selectedSubtitle || 'none'} 
                            onValueChange={handleSubtitleChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Subtitles" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Off</SelectItem>
                              {videoToPlay.subtitles.map(subtitle => (
                                <SelectItem key={subtitle.language} value={subtitle.language}>
                                  {subtitle.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </DropdownMenuGroup>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Center play/pause button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {!isPlaying && (
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full w-16 h-16 bg-white/20 backdrop-blur-sm border-white/40 pointer-events-auto"
                onClick={handlePlayPause}
              >
                <Play className="h-8 w-8 text-white" />
              </Button>
            )}
          </div>
          
          {/* Bottom controls */}
          <div className="p-4 space-y-2">
            {/* Progress bar */}
            <div className="flex items-center space-x-2">
              <span className="text-white text-xs">
                {formatTime(currentTime)}
              </span>
              
              <div className="relative flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                {/* Buffered progress */}
                <div 
                  className="absolute h-full bg-white/50"
                  style={{ width: `${(buffered / duration) * 100}%` }}
                />
                
                {/* Playback progress */}
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="h-full absolute inset-0"
                />
              </div>
              
              <span className="text-white text-xs">
                {formatTime(duration)}
              </span>
            </div>
            
            {/* Control buttons */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1">
                {/* Play/Pause button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                
                {/* Next/Previous buttons (only if in a playlist) */}
                {playlist.playlistId && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-white/20"
                      onClick={() => dispatch(nextInPlaylist())}
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>
                  </>
                )}
                
                {/* Volume control */}
                <div className="relative group">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20"
                    onClick={handleMuteToggle}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                  
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-24 p-2 bg-black/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                </div>
                
                {/* Playback speed button */}
                <div className="relative group">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20 text-xs font-bold"
                  >
                    <Clock className="h-5 w-5" />
                  </Button>
                  
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                    <div className="flex flex-col">
                      {[2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25].map(rate => (
                        <Button 
                          key={rate}
                          variant="ghost"
                          size="sm"
                          className={`${playbackRate === rate ? 'bg-white/20' : ''} text-white`}
                          onClick={() => dispatch(setPlaybackRate(rate))}
                        >
                          {rate === 1 ? 'Normal' : `${rate}x`}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Subtitle button */}
                {videoToPlay.subtitles && videoToPlay.subtitles.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`text-white hover:bg-white/20 ${selectedSubtitle ? 'bg-white/20' : ''}`}
                    onClick={() => {
                      // Toggle between first subtitle and none
                      if (selectedSubtitle) {
                        setSelectedSubtitle(null);
                      } else {
                        setSelectedSubtitle(videoToPlay.subtitles![0].language);
                      }
                    }}
                  >
                    <Subtitles className="h-5 w-5" />
                  </Button>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                {/* Fullscreen button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20"
                  onClick={handleFullscreenToggle}
                >
                  {isFullscreen ? (
                    <Minimize className="h-5 w-5" />
                  ) : (
                    <Maximize className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Skip forward/backward on double click */}
      <div className="absolute inset-0 flex pointer-events-none">
        <div 
          className="flex-1 h-full"
          onClick={(e) => {
            // Prevent conflict with play/pause click
            e.stopPropagation();
            
            if (videoRef.current) {
              videoRef.current.currentTime = Math.max(0, currentTime - 10);
            }
          }}
        />
        <div 
          className="flex-1 h-full"
          onClick={(e) => {
            // Prevent conflict with play/pause click
            e.stopPropagation();
            
            if (videoRef.current) {
              videoRef.current.currentTime = Math.min(duration, currentTime + 10);
            }
          }}
        />
      </div>
    </div>
  );
};