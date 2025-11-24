import React, { useState } from 'react';
import { ViewState, ChildProfile, Story } from './types';
import { STORIES } from './constants';
import Header from './components/Header';
import Landing from './views/Landing';
import Passport from './views/Passport';
import Dashboard from './views/Dashboard';
import Training from './views/Training';
import StoryPlayer from './views/StoryPlayer';
import Completion from './views/Completion';
import CreateStory from './views/CreateStory';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);
  const [stars, setStars] = useState(0);
  const [customStories, setCustomStories] = useState<Story[]>([]);

  const navigate = (newView: ViewState) => {
    setView(newView);
  };

  const handlePassportSave = (newProfile: ChildProfile) => {
    setProfile(newProfile);
    navigate('dashboard');
  };

  const handleLoadStory = (storyId: string) => {
    setCurrentStoryId(storyId);
    navigate('story');
  };

  const handleStoryFinish = () => {
    setStars(prev => prev + 1);
    navigate('completion');
  };

  const handleCreateSave = (story: Story) => {
    setCustomStories(prev => [story, ...prev]);
    navigate('dashboard');
  };

  // Helper to find story in either built-in or custom collection
  const getStory = (id: string | null): Story | undefined => {
    if (!id) return undefined;
    if (STORIES[id]) return STORIES[id];
    return customStories.find(s => s.id === id);
  };

  const activeStory = getStory(currentStoryId);

  return (
    <>
      <Header 
        stars={stars} 
        onNavigate={navigate} 
        currentView={view} 
      />
      <main className="flex-1 overflow-y-auto relative bg-slate-50">
        {view === 'landing' && (
          <Landing 
            onStart={() => navigate('passport')} 
            onDownload={() => alert("Please use the desktop version to download the source.")} 
          />
        )}

        {view === 'passport' && (
          <Passport 
            onSave={handlePassportSave} 
            initialProfile={profile} 
          />
        )}

        {view === 'dashboard' && profile && (
          <Dashboard 
            profile={profile} 
            customStories={customStories}
            onNavigate={navigate} 
            onLoadStory={handleLoadStory} 
          />
        )}

        {view === 'training' && (
          <Training onClose={() => navigate('dashboard')} />
        )}
        
        {view === 'create-story' && profile && (
          <CreateStory 
            profile={profile}
            onSave={handleCreateSave}
            onCancel={() => navigate('dashboard')}
          />
        )}

        {view === 'story' && activeStory && profile && (
          <StoryPlayer 
            story={activeStory} 
            profile={profile}
            onFinish={handleStoryFinish}
            onExit={() => navigate('dashboard')}
          />
        )}

        {view === 'completion' && activeStory && profile && (
          <Completion 
            profile={profile}
            story={activeStory}
            onContinue={() => navigate('dashboard')}
          />
        )}
      </main>
    </>
  );
};

export default App;