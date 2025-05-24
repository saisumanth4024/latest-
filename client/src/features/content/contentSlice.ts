import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { 
  Video, 
  Banner, 
  ContentFilter, 
  PlayerSettings,
  Playlist
} from './types';
import { contentApi } from './contentApi';

interface ContentState {
  // Current video player state
  currentVideo: Video | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  
  // Player settings
  playerSettings: PlayerSettings;
  
  // Active banner by position
  activeBanners: Record<string, Banner>;
  
  // Filters for content browsing
  filters: ContentFilter;
  searchQuery: string;
  selectedContentType: string | null;
  selectedCategory: string | null;
  
  // Sort options
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  
  // Playlist state
  playlist: {
    playlistId: string | null;
    currentIndex: number;
    videos: string[]; // IDs of videos in the current playlist
    shuffle: boolean;
    repeat: 'none' | 'one' | 'all';
  };
}

const initialState: ContentState = {
  // Current video player state
  currentVideo: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  volume: 0.8, // 80% volume by default
  isMuted: false,
  playbackRate: 1, // Normal speed
  isFullscreen: false,
  
  // Player settings
  playerSettings: {
    quality: '720p', // Default quality
    autoplay: false,
    volume: 0.8,
    playbackRate: 1,
    subtitlesEnabled: false,
    loop: false
  },
  
  // Active banner by position
  activeBanners: {},
  
  // Filters for content browsing
  filters: {},
  searchQuery: '',
  selectedContentType: null,
  selectedCategory: null,
  
  // Sort options
  sort: {
    field: 'date', // Default sort by date
    direction: 'desc' // Newest first
  },
  
  // Playlist state
  playlist: {
    playlistId: null,
    currentIndex: 0,
    videos: [],
    shuffle: false,
    repeat: 'none'
  }
};

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    // Video player actions
    setCurrentVideo: (state, action: PayloadAction<Video | null>) => {
      state.currentVideo = action.payload;
      state.currentTime = 0;
      state.isPlaying = action.payload !== null; // Auto-play when video is set
    },
    
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
      if (state.volume > 0) {
        state.isMuted = false;
      } else if (state.volume === 0) {
        state.isMuted = true;
      }
    },
    
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    
    setPlaybackRate: (state, action: PayloadAction<number>) => {
      state.playbackRate = action.payload;
      state.playerSettings.playbackRate = action.payload;
    },
    
    setFullscreen: (state, action: PayloadAction<boolean>) => {
      state.isFullscreen = action.payload;
    },
    
    // Player settings actions
    setPlayerSettings: (state, action: PayloadAction<Partial<PlayerSettings>>) => {
      state.playerSettings = { ...state.playerSettings, ...action.payload };
    },
    
    toggleSubtitles: (state) => {
      state.playerSettings.subtitlesEnabled = !state.playerSettings.subtitlesEnabled;
    },
    
    setSubtitlesLanguage: (state, action: PayloadAction<string>) => {
      state.playerSettings.subtitlesLanguage = action.payload;
      state.playerSettings.subtitlesEnabled = true;
    },
    
    // Banner actions
    setActiveBanner: (state, action: PayloadAction<Banner>) => {
      state.activeBanners[action.payload.position] = action.payload;
    },
    
    // Content filter actions
    setContentFilters: (state, action: PayloadAction<Partial<ContentFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    resetContentFilters: (state) => {
      state.filters = {};
      state.searchQuery = '';
      state.selectedContentType = null;
      state.selectedCategory = null;
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    setSelectedContentType: (state, action: PayloadAction<string | null>) => {
      state.selectedContentType = action.payload;
    },
    
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    
    // Sort options
    setContentSort: (state, action: PayloadAction<{ field: string; direction: 'asc' | 'desc' }>) => {
      state.sort = action.payload;
    },
    
    // Playlist actions
    setPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.playlist.playlistId = action.payload.id;
      state.playlist.videos = action.payload.videos;
      state.playlist.currentIndex = 0;
    },
    
    clearPlaylist: (state) => {
      state.playlist.playlistId = null;
      state.playlist.videos = [];
      state.playlist.currentIndex = 0;
    },
    
    setPlaylistIndex: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.playlist.videos.length) {
        state.playlist.currentIndex = action.payload;
      }
    },
    
    nextInPlaylist: (state) => {
      if (state.playlist.videos.length === 0) return;
      
      if (state.playlist.repeat === 'one') {
        // Just restart the current video
        return;
      }
      
      if (state.playlist.shuffle) {
        // Pick random next video
        const newIndex = Math.floor(Math.random() * state.playlist.videos.length);
        state.playlist.currentIndex = newIndex;
      } else {
        // Go to next video
        const newIndex = state.playlist.currentIndex + 1;
        
        if (newIndex >= state.playlist.videos.length) {
          if (state.playlist.repeat === 'all') {
            // Loop back to beginning
            state.playlist.currentIndex = 0;
          } else {
            // End of playlist
            state.playlist.currentIndex = state.playlist.videos.length - 1;
          }
        } else {
          state.playlist.currentIndex = newIndex;
        }
      }
    },
    
    prevInPlaylist: (state) => {
      if (state.playlist.videos.length === 0) return;
      
      if (state.playlist.shuffle) {
        // Pick random next video
        const newIndex = Math.floor(Math.random() * state.playlist.videos.length);
        state.playlist.currentIndex = newIndex;
      } else {
        // Go to previous video
        const newIndex = state.playlist.currentIndex - 1;
        
        if (newIndex < 0) {
          if (state.playlist.repeat === 'all') {
            // Loop back to end
            state.playlist.currentIndex = state.playlist.videos.length - 1;
          } else {
            // Beginning of playlist
            state.playlist.currentIndex = 0;
          }
        } else {
          state.playlist.currentIndex = newIndex;
        }
      }
    },
    
    togglePlaylistShuffle: (state) => {
      state.playlist.shuffle = !state.playlist.shuffle;
    },
    
    setPlaylistRepeat: (state, action: PayloadAction<'none' | 'one' | 'all'>) => {
      state.playlist.repeat = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Handle video query success to auto-update current video
    builder.addMatcher(
      contentApi.endpoints.getVideoById.matchFulfilled,
      (state, { payload }) => {
        // Only update the current video if there's no video playing
        // or if this is the video we're currently playing
        if (!state.currentVideo || (state.currentVideo && state.currentVideo.id === payload.id)) {
          state.currentVideo = payload;
        }
      }
    );
    
    // Auto-update for playlists
    builder.addMatcher(
      contentApi.endpoints.getPlaylistById.matchFulfilled,
      (state, { payload }) => {
        // Update the playlist data if it's the current playlist
        if (state.playlist.playlistId === payload.id) {
          state.playlist.videos = payload.videos;
          // Make sure current index is still valid
          if (state.playlist.currentIndex >= payload.videos.length) {
            state.playlist.currentIndex = 0;
          }
        }
      }
    );
  }
});

// Export actions
export const {
  // Video player actions
  setCurrentVideo,
  setCurrentTime,
  setDuration,
  setIsPlaying,
  setVolume,
  setMuted,
  setPlaybackRate,
  setFullscreen,
  
  // Player settings actions
  setPlayerSettings,
  toggleSubtitles,
  setSubtitlesLanguage,
  
  // Banner actions
  setActiveBanner,
  
  // Content filter actions
  setContentFilters,
  resetContentFilters,
  setSearchQuery,
  setSelectedContentType,
  setSelectedCategory,
  
  // Sort options
  setContentSort,
  
  // Playlist actions
  setPlaylist,
  clearPlaylist,
  setPlaylistIndex,
  nextInPlaylist,
  prevInPlaylist,
  togglePlaylistShuffle,
  setPlaylistRepeat
} = contentSlice.actions;

// Selectors
export const selectCurrentVideo = (state: RootState) => state.content.currentVideo;
export const selectCurrentTime = (state: RootState) => state.content.currentTime;
export const selectDuration = (state: RootState) => state.content.duration;
export const selectIsPlaying = (state: RootState) => state.content.isPlaying;
export const selectVolume = (state: RootState) => state.content.volume;
export const selectIsMuted = (state: RootState) => state.content.isMuted;
export const selectPlaybackRate = (state: RootState) => state.content.playbackRate;
export const selectIsFullscreen = (state: RootState) => state.content.isFullscreen;
export const selectPlayerSettings = (state: RootState) => state.content.playerSettings;
export const selectActiveBanner = (position: string) => (state: RootState) => 
  state.content.activeBanners[position] || null;
export const selectContentFilters = (state: RootState) => state.content.filters;
export const selectSearchQuery = (state: RootState) => state.content.searchQuery;
export const selectSelectedContentType = (state: RootState) => state.content.selectedContentType;
export const selectSelectedCategory = (state: RootState) => state.content.selectedCategory;
export const selectContentSort = (state: RootState) => state.content.sort;
export const selectCurrentPlaylist = (state: RootState) => state.content.playlist;

export default contentSlice.reducer;