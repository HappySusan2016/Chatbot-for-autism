
import React from 'react';

export type ViewState = 'landing' | 'login' | 'passport' | 'dashboard' | 'training' | 'story' | 'completion' | 'create-story';

export interface ChildProfile {
  name: string;
  interest: string;
  strategy: string;
  avatar: 'bear' | 'robot' | 'cat';
  voiceURI: string | null;
}

export interface Choice {
  text: string;
  feedback: string;
}

export interface Slide {
  type: 'intro' | 'sensory' | 'interaction' | 'conflict' | 'conclusion';
  text: string;
  imgUrl: string; // Pre-mapped URL
  parentTip: string;
  parentAction: string;
  choices?: Choice[];
  visualPrompt?: string; // Description for Generative AI
  generatedImage?: string; // Base64 string for custom stories
}

export interface Story {
  id: string;
  title: string;
  topic: string;
  description: string;
  coverImage: string;
  tags: { icon: string; label: string; color: string; bg: string };
  slides: Slide[];
  isCustom?: boolean;
}

export interface TrainingSlideData {
  title: string;
  subtitle: string;
  content: React.ReactNode;
}
