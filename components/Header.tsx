import React from 'react';
import { ViewState } from '../types';

interface HeaderProps {
  stars: number;
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
}

const Header: React.FC<HeaderProps> = ({ stars, onNavigate, currentView }) => {
  const showStats = currentView !== 'landing' && currentView !== 'passport';

  const handleDownload = () => {
    // Mock functionality as this is a React app now
    alert("In the standalone version, this would download the app source!");
  };

  return (
    <header className="bg-white shadow-sm p-4 z-30 flex justify-between items-center shrink-0">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => onNavigate(currentView === 'landing' ? 'landing' : 'dashboard')}
      >
        <span className="material-symbols-outlined text-indigo-500 text-3xl">menu_book</span>
        <h1 className="text-2xl font-bold text-indigo-600 tracking-wide font-fredoka">StoryPal</h1>
      </div>
      <div className="flex items-center gap-4">
        <button 
          className="hidden md:flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-100 transition text-sm font-bold" 
          onClick={handleDownload}
          title="Download this app to run offline"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          <span>Download App</span>
        </button>
        
        {showStats && (
          <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
            <span className="material-symbols-outlined text-yellow-500 mr-1">star</span>
            <span className="font-bold text-yellow-700">{stars}</span>
          </div>
        )}

        {showStats && (
          <button 
            className="p-2 hover:bg-slate-100 rounded-full transition" 
            onClick={() => onNavigate('passport')} 
            title="Communication Passport"
          >
            <span className="material-symbols-outlined text-slate-600">assignment_ind</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
