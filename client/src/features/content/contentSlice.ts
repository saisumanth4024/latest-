import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import type { 
  ContentFilter, 
  PlayerSettings,
  Video,
  Banner
} from './types';

// Define the interface for the content slice state
export interface ContentState {
  // Player settings
  playerSettings: PlayerSettings;
  currentVideo: Video | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  playbackRate: number;
  currentPlaylistId: string | null;
  currentPlaylistIndex: number;
  
  // Content filtering and discovery
  filters: ContentFilter;
  searchQuery: string;
  selectedContentType: string | null;
  selectedCategory: string | null;
  contentSort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  
  // Banner display tracking
  activeBanners: {
    [key: string]: Banner;
  };
  
  // User preferences and recommendations
  recentlyViewed: string[]; // IDs of recently viewed content
  viewHistory: {
    contentId: string;
    contentType: string;
    timestamp: string;
    progress?: number; // For videos
  }[];
  personalRecommendations: {
    contentId: string;
    contentType: string;
    score: number; // Recommendation score
  }[];
}

// Initialize the content state
const initialState: ContentState = {
  // Player settings
  playerSettings: {
    autoplay: false,
    loop: false,
    muted: false,
    controls: true,
    preload: 'metadata',
    playbackRate: 1,
    volume: 1,
    quality: '720p',
    subtitlesEnabled: false
  },
  currentVideo: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  isFullscreen: false,
  playbackRate: 1,
  currentPlaylistId: null,
  currentPlaylistIndex: 0,
  
  // Content filtering and discovery
  filters: {},
  searchQuery: '',
  selectedContentType: null,
  selectedCategory: null,
  contentSort: {
    field: 'createdAt',
    direction: 'desc'
  },
  
  // Banner display tracking
  activeBanners: {},
  
  // User preferences and recommendations
  recentlyViewed: [],
  viewHistory: [],
  personalRecommendations: []
};

// Create the content slice
export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    // Player controls
    setCurrentVideo: (state, action: PayloadAction<Video | null>) => {
      state.currentVideo = action.payload;
      if (action.payload) {
        // Add to recently viewed
        if (!state.recentlyViewed.includes(action.payload.id)) {
          state.recentlyViewed = [
            action.payload.id,
            ...state.recentlyViewed.slice(0, 19) // Keep last 20 items
          ];
        }
        
        // Add to view history
        state.viewHistory.unshift({
          contentId: action.payload.id,
          contentType: 'video',
          timestamp: new Date().toISOString(),
          progress: 0
        });
      }
    },
    
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
      
      // Update progress in view history if there's a current video
      if (state.currentVideo && state.duration > 0) {
        const historyIndex = state.viewHistory.findIndex(
          item => item.contentId === state.currentVideo?.id
        );
        
        if (historyIndex !== -1) {
          state.viewHistory[historyIndex].progress = 
            Math.round((state.currentTime / state.duration) * 100) / 100; // As a percentage
        }
      }
    },
    
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
      // Also update in player settings
      state.playerSettings.volume = action.payload;
      
      if (action.payload === 0) {
        state.isMuted = true;
      } else if (state.isMuted) {
        state.isMuted = false;
      }
    },
    
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
      state.playerSettings.muted = action.payload;
    },
    
    setFullscreen: (state, action: PayloadAction<boolean>) => {
      state.isFullscreen = action.payload;
    },
    
    setPlaybackRate: (state, action: PayloadAction<number>) => {
      state.playbackRate = action.payload;
      state.playerSettings.playbackRate = action.payload;
    },
    
    setPlayerSettings: (state, action: PayloadAction<Partial<PlayerSettings>>) => {
      state.playerSettings = {
        ...state.playerSettings,
        ...action.payload
      };
      
      // Update related state properties
      if (action.payload.volume !== undefined) {
        state.volume = action.payload.volume;
      }
      
      if (action.payload.muted !== undefined) {
        state.isMuted = action.payload.muted;
      }
      
      if (action.payload.playbackRate !== undefined) {
        state.playbackRate = action.payload.playbackRate;
      }
    },
    
    // Playlist controls
    setCurrentPlaylist: (state, action: PayloadAction<{ playlistId: string | null, index: number }>) => {
      state.currentPlaylistId = action.payload.playlistId;
      state.currentPlaylistIndex = action.payload.index;
    },
    
    nextInPlaylist: (state) => {
      state.currentPlaylistIndex += 1;
    },
    
    previousInPlaylist: (state) => {
      if (state.currentPlaylistIndex > 0) {
        state.currentPlaylistIndex -= 1;
      }
    },
    
    // Content discovery and filtering
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    setContentFilters: (state, action: PayloadAction<Partial<ContentFilter>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    
    resetContentFilters: (state) => {
      state.filters = {};
    },
    
    setSelectedContentType: (state, action: PayloadAction<string | null>) => {
      state.selectedContentType = action.payload;
    },
    
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    
    setContentSort: (state, action: PayloadAction<{ field: string, direction: 'asc' | 'desc' }>) => {
      state.contentSort = action.payload;
    },
    
    // Banner management
    setActiveBanner: (state, action: PayloadAction<Banner>) => {
      state.activeBanners[action.payload.position] = action.payload;
    },
    
    removeActiveBanner: (state, action: PayloadAction<string>) => {
      delete state.activeBanners[action.payload];
    },
    
    clearActiveBanners: (state) => {
      state.activeBanners = {};
    },
    
    // User content preferences
    addToRecentlyViewed: (state, action: PayloadAction<string>) => {
      if (!state.recentlyViewed.includes(action.payload)) {
        state.recentlyViewed = [
          action.payload,
          ...state.recentlyViewed.slice(0, 19)
        ];
      }
    },
    
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
    },
    
    addToViewHistory: (state, action: PayloadAction<{
      contentId: string;
      contentType: string;
      progress?: number;
    }>) => {
      // Check if already in history
      const existingIndex = state.viewHistory.findIndex(
        item => item.contentId === action.payload.contentId
      );
      
      if (existingIndex !== -1) {
        // Update timestamp and progress
        state.viewHistory[existingIndex].timestamp = new Date().toISOString();
        if (action.payload.progress !== undefined) {
          state.viewHistory[existingIndex].progress = action.payload.progress;
        }
      } else {
        // Add new entry
        state.viewHistory.unshift({
          ...action.payload,
          timestamp: new Date().toISOString()
        });
        
        // Keep history manageable
        if (state.viewHistory.length > 100) {
          state.viewHistory = state.viewHistory.slice(0, 100);
        }
      }
    },
    
    clearViewHistory: (state) => {
      state.viewHistory = [];
    },
    
    setPersonalRecommendations: (state, action: PayloadAction<{
      contentId: string;
      contentType: string;
      score: number;
    }[]>) => {
      state.personalRecommendations = action.payload;
    }
  }
});

// Export action creators
export const {
  // Player controls
  setCurrentVideo,
  setIsPlaying,
  setCurrentTime,
  setDuration,
  setVolume,
  setMuted,
  setFullscreen,
  setPlaybackRate,
  setPlayerSettings,
  
  // Playlist controls
  setCurrentPlaylist,
  nextInPlaylist,
  previousInPlaylist,
  
  // Content discovery and filtering
  setSearchQuery,
  setContentFilters,
  resetContentFilters,
  setSelectedContentType,
  setSelectedCategory,
  setContentSort,
  
  // Banner management
  setActiveBanner,
  removeActiveBanner,
  clearActiveBanners,
  
  // User content preferences
  addToRecentlyViewed,
  clearRecentlyViewed,
  addToViewHistory,
  clearViewHistory,
  setPersonalRecommendations
} = contentSlice.actions;

// Selectors
export const selectPlayerSettings = (state: RootState) => state.content.playerSettings;
export const selectCurrentVideo = (state: RootState) => state.content.currentVideo;
export const selectIsPlaying = (state: RootState) => state.content.isPlaying;
export const selectCurrentTime = (state: RootState) => state.content.currentTime;
export const selectDuration = (state: RootState) => state.content.duration;
export const selectVolume = (state: RootState) => state.content.volume;
export const selectIsMuted = (state: RootState) => state.content.isMuted;
export const selectIsFullscreen = (state: RootState) => state.content.isFullscreen;
export const selectPlaybackRate = (state: RootState) => state.content.playbackRate;
export const selectCurrentPlaylist = (state: RootState) => ({
  playlistId: state.content.currentPlaylistId,
  index: state.content.currentPlaylistIndex
});

export const selectContentFilters = (state: RootState) => state.content.filters;
export const selectSearchQuery = (state: RootState) => state.content.searchQuery;
export const selectSelectedContentType = (state: RootState) => state.content.selectedContentType;
export const selectSelectedCategory = (state: RootState) => state.content.selectedCategory;
export const selectContentSort = (state: RootState) => state.content.contentSort;

export const selectActiveBanners = (state: RootState) => state.content.activeBanners;
export const selectActiveBannerByPosition = (position: string) => 
  (state: RootState) => state.content.activeBanners[position];

export const selectRecentlyViewed = (state: RootState) => state.content.recentlyViewed;
export const selectViewHistory = (state: RootState) => state.content.viewHistory;
export const selectPersonalRecommendations = (state: RootState) => state.content.personalRecommendations;

export default contentSlice.reducer;