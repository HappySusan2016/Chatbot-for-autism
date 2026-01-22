
import React, { useState } from 'react';
import { ChildProfile, Story, ViewState } from '../types';
import { STORIES } from '../constants';

interface DashboardProps {
  profile: ChildProfile;
  customStories: Story[];
  onNavigate: (view: ViewState) => void;
  onLoadStory: (storyId: string) => void;
  onEditStory: (storyId: string) => void;
  onDeleteStory: (storyId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  profile, 
  customStories, 
  onNavigate, 
  onLoadStory,
  onEditStory,
  onDeleteStory
}) => {
  return (
    <section className="min-h-full p-6 slide-enter overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 font-fredoka">Hello, <span className="text-indigo-600">Parent</span>!</h2>
            <p className="text-slate-500">Choose a story for <span className="font-semibold text-slate-700">{profile.name}</span> or start training.</p>
          </div>
          <button 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-lg transition font-bold"
            onClick={() => onNavigate('create-story')}
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span>Create New Story</span>
          </button>
        </div>

        {/* Training Banner */}
        <div 
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 mb-10 text-white cursor-pointer transform transition hover:scale-[1.01] flex items-center justify-between group" 
          onClick={() => onNavigate('training')}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">For Parents</span>
            </div>
            <h3 className="text-2xl font-bold mb-1 font-fredoka">Interactive Parent Training</h3>
            <p className="text-indigo-100 max-w-xl">Learn the science behind StoryPal and how to use "Co-Action" to help your child.</p>
          </div>
          <div className="hidden md:block bg-white/10 p-4 rounded-full group-hover:bg-white/20 transition">
            <span className="material-symbols-outlined text-4xl">school</span>
          </div>
        </div>

        {/* Custom Stories Section */}
        {customStories.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500">star</span>
              My Custom Stories
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customStories.map((story) => (
                <StoryCard 
                  key={story.id} 
                  story={story} 
                  onClick={() => onLoadStory(story.id)} 
                  onEdit={() => onEditStory(story.id)}
                  onDelete={() => onDeleteStory(story.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Library Stories Grid */}
        <div>
          <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-500">library_books</span>
            Story Library
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(STORIES).map((story) => (
              <StoryCard key={story.id} story={story} onClick={() => onLoadStory(story.id)} />
            ))}
            
            {/* Create New Prompt Card (Inline) */}
            <div 
              className="bg-indigo-50 rounded-2xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100 transition flex flex-col items-center justify-center p-6 cursor-pointer text-center h-full min-h-[200px]"
              onClick={() => onNavigate('create-story')}
            >
              <div className="w-14 h-14 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-600 mb-3">
                <span className="material-symbols-outlined text-3xl">add</span>
              </div>
              <h3 className="text-lg font-bold text-indigo-800 mb-1 font-fredoka">Create a New Story</h3>
              <p className="text-sm text-indigo-600">Personalize a story for a specific event</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper component to handle image errors gracefully
const StoryCard: React.FC<{ 
  story: Story; 
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}> = ({ story, onClick, onEdit, onDelete }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden group cursor-pointer border border-slate-100 flex flex-col h-full relative"
      onClick={onClick}
    >
      <div className="h-40 overflow-hidden relative bg-slate-200 shrink-0">
        {!imgError ? (
          <img 
            alt={story.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
            src={story.coverImage}
            onError={() => setImgError(true)} 
          />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center ${story.tags.bg}`}>
            <span className={`material-symbols-outlined text-5xl ${story.tags.color} opacity-50`}>
              {story.tags.icon}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <h3 className="text-white font-bold text-xl font-fredoka drop-shadow-md">{story.title}</h3>
        </div>

        {/* Action Buttons for Custom Stories */}
        {story.isCustom && (
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              className="p-2 bg-white/90 backdrop-blur rounded-full text-indigo-600 shadow-md hover:bg-indigo-50 transition"
              onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
              title="Edit Story"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            <button 
              className="p-2 bg-white/90 backdrop-blur rounded-full text-red-500 shadow-md hover:bg-red-50 transition"
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
              title="Delete Story"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{story.description}</p>
        <div className={`flex items-center gap-2 text-xs font-semibold ${story.tags.color} ${story.tags.bg} w-fit px-2 py-1 rounded`}>
          <span className="material-symbols-outlined text-sm">{story.tags.icon}</span>
          <span>{story.tags.label}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
