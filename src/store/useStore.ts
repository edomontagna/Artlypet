import { create } from 'zustand';
import { GenerationMode, UserProfile, Generation } from '@/types';

interface AppState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Generation flow
  selectedMode: GenerationMode;
  setSelectedMode: (mode: GenerationMode) => void;
  selectedStyle: string | null;
  setSelectedStyle: (style: string | null) => void;
  uploadedImage: File | null;
  setUploadedImage: (file: File | null) => void;
  uploadedImage2: File | null;
  setUploadedImage2: (file: File | null) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  currentGeneration: Generation | null;
  setCurrentGeneration: (gen: Generation | null) => void;

  // History
  generations: Generation[];
  setGenerations: (gens: Generation[]) => void;
  addGeneration: (gen: Generation) => void;

  // UI
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;

  reset: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  selectedMode: 'animals',
  setSelectedMode: (mode) => set({ selectedMode: mode }),
  selectedStyle: null,
  setSelectedStyle: (style) => set({ selectedStyle: style }),
  uploadedImage: null,
  setUploadedImage: (file) => set({ uploadedImage: file }),
  uploadedImage2: null,
  setUploadedImage2: (file) => set({ uploadedImage2: file }),
  isGenerating: false,
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  currentGeneration: null,
  setCurrentGeneration: (gen) => set({ currentGeneration: gen }),

  generations: [],
  setGenerations: (gens) => set({ generations: gens }),
  addGeneration: (gen) =>
    set((state) => ({ generations: [gen, ...state.generations] })),

  showAuthModal: false,
  setShowAuthModal: (show) => set({ showAuthModal: show }),

  reset: () =>
    set({
      selectedStyle: null,
      uploadedImage: null,
      uploadedImage2: null,
      isGenerating: false,
      currentGeneration: null,
    }),
}));
