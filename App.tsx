
import React, { useState, useEffect } from 'react';
import { ViewState, ChildProfile, Story } from './types';
import { STORIES } from './constants';
import Header from './components/Header';
import Landing from './views/Landing';
import Login from './views/Login';
import Passport from './views/Passport';
import Dashboard from './views/Dashboard';
import Training from './views/Training';
import StoryPlayer from './views/StoryPlayer';
import Completion from './views/Completion';
import CreateStory from './views/CreateStory';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [stars, setStars] = useState(0);
  const [customStories, setCustomStories] = useState<Story[]>([]);
  const [imageCache, setImageCache] = useState<Record<string, Record<number, string>>>({});

  // Persistence: Load from Local Storage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('storypal_profile');
    const savedCustomStories = localStorage.getItem('storypal_custom_stories');
    const savedImageCache = localStorage.getItem('storypal_image_cache');
    const savedStars = localStorage.getItem('storypal_stars');

    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedCustomStories) setCustomStories(JSON.parse(savedCustomStories));
    if (savedImageCache) setImageCache(JSON.parse(savedImageCache));
    if (savedStars) setStars(parseInt(savedStars, 10));
  }, []);

  // Persistence: Save to Local Storage on change
  useEffect(() => {
    if (profile) localStorage.setItem('storypal_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('storypal_custom_stories', JSON.stringify(customStories));
  }, [customStories]);

  useEffect(() => {
    localStorage.setItem('storypal_image_cache', JSON.stringify(imageCache));
  }, [imageCache]);

  useEffect(() => {
    localStorage.setItem('storypal_stars', stars.toString());
  }, [stars]);

  const navigate = (newView: ViewState) => {
    setView(newView);
  };

  const handleStart = () => {
    if (isLoggedIn) {
      if (profile) navigate('dashboard');
      else navigate('passport');
    } else {
      navigate('login');
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    if (profile) {
      navigate('dashboard');
    } else {
      navigate('passport');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('landing');
  };

  const handlePassportSave = (newProfile: ChildProfile) => {
    setProfile(newProfile);
    navigate('dashboard');
  };

  const handleLoadStory = (storyId: string) => {
    setCurrentStoryId(storyId);
    navigate('story');
  };

  const handleEditStory = (storyId: string) => {
    setEditingStoryId(storyId);
    navigate('create-story');
  };

  const handleDeleteStory = (storyId: string) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      setCustomStories(prev => prev.filter(s => s.id !== storyId));
      setImageCache(prev => {
        const next = { ...prev };
        delete next[storyId];
        return next;
      });
    }
  };

  const handleCreateSave = (story: Story) => {
    if (editingStoryId) {
      setCustomStories(prev => prev.map(s => s.id === editingStoryId ? story : s));
    } else {
      setCustomStories(prev => [story, ...prev]);
    }
    setEditingStoryId(null);
    navigate('dashboard');
  };
  
  const handleCacheImage = (storyId: string, slideIndex: number, imageUrl: string) => {
    setImageCache(prev => ({
      ...prev,
      [storyId]: {
        ...(prev[storyId] || {}),
        [slideIndex]: imageUrl
      }
    }));
  };

  const handleStoryFinish = () => {
    setStars(prev => prev + 1);
    navigate('completion');
  };

  const getStory = (id: string | null): Story | undefined => {
    if (!id) return undefined;
    if (STORIES[id]) return STORIES[id];
    return customStories.find(s => s.id === id);
  };

  const activeStory = getStory(currentStoryId);
  const storyToEdit = getStory(editingStoryId);

  return (
    <>
      <Header 
        stars={stars} 
        onNavigate={(v) => {
          if (v === 'dashboard') setEditingStoryId(null);
          navigate(v);
        }} 
        currentView={view} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto relative bg-slate-50">
        {view === 'landing' && (
          <Landing 
            onStart={handleStart} 
            onDownload={() => alert("Please use the desktop version to download the source.")} 
          />
        )}

        {view === 'login' && (
          <Login onLogin={handleLoginSuccess} />
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
            onEditStory={handleEditStory}
            onDeleteStory={handleDeleteStory}
          />
        )}

        {view === 'training' && (
          <Training onClose={() => navigate('dashboard')} />
        )}
        
        {view === 'create-story' && profile && (
          <CreateStory 
            profile={profile}
            onSave={handleCreateSave}
            onCancel={() => {
              setEditingStoryId(null);
              navigate('dashboard');
            }}
            initialTopic={storyToEdit?.topic}
          />
        )}

        {view === 'story' && activeStory && profile && (
          <StoryPlayer 
            story={activeStory} 
            profile={profile}
            onFinish={handleStoryFinish}
            onExit={() => navigate('dashboard')}
            imageCache={imageCache[activeStory.id] || {}}
            onCacheImage={(index, url) => handleCacheImage(activeStory.id, index, url)}
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
