import { create } from 'zustand';

type VideoQuality = 'low' | 'medium' | 'high' | 'max';

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  startTime: number | null;
  pauseTime: number | null;
  filePath: string | null;
  quality: VideoQuality;

  // Actions
  startRecording: (filePath: string) => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  updateDuration: (duration: number) => void;
  updateFilePath: (filePath: string) => void;
  setQuality: (quality: VideoQuality) => void;
  reset: () => void;
}

const initialState = {
  isRecording: false,
  isPaused: false,
  duration: 0,
  startTime: null,
  pauseTime: null,
  filePath: null,
  quality: 'high' as VideoQuality,
};

export const useRecordingStore = create<RecordingState>((set, get) => ({
  ...initialState,

  startRecording: (filePath) => {
    set({
      isRecording: true,
      isPaused: false,
      duration: 0,
      startTime: Date.now(),
      pauseTime: null,
      filePath,
    });
  },

  pauseRecording: () => {
    const { isRecording, isPaused } = get();
    if (isRecording && !isPaused) {
      set({
        isPaused: true,
        pauseTime: Date.now(),
      });
    }
  },

  resumeRecording: () => {
    const { isRecording, isPaused, pauseTime, startTime } = get();
    if (isRecording && isPaused && pauseTime && startTime) {
      const pauseDuration = Date.now() - pauseTime;
      set({
        isPaused: false,
        pauseTime: null,
        startTime: startTime + pauseDuration, // Adjust start time to exclude pause duration
      });
    }
  },

  stopRecording: () => {
    set({
      isRecording: false,
      isPaused: false,
    });
  },

  updateDuration: (duration) => {
    set({ duration });
  },

  updateFilePath: (filePath) => {
    set({ filePath });
  },

  setQuality: (quality) => {
    set({ quality });
  },

  reset: () => {
    set(initialState);
  },
}));
