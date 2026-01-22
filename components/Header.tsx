
import React from 'react';
import { ViewState } from '../types';

interface HeaderProps {
  stars: number;
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ stars, onNavigate, currentView, isLoggedIn, onLogout }) => {
  // Show stats only if logged in and not on setup screens
  const showStats = isLoggedIn && currentView !== 'landing' && currentView !== 'login';

  return (
    <header className="bg-white shadow-sm p-4 z-30 flex justify-between items-center shrink-0">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => onNavigate('landing')}
      >
        <span className="material-symbols-outlined text-indigo-500 text-3xl">menu_book</span>
        <h1 className="text-2xl font-bold text-indigo-600 tracking-wide font-fredoka">StoryPal</h1>
      </div>
      <div className="flex items-center gap-4">
        {showStats && (
          <>
            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
              <span className="material-symbols-outlined text-yellow-500 mr-1">star</span>
              <span className="font-bold text-yellow-700">{stars}</span>
            </div>

            <button 
              className="p-2 hover:bg-slate-100 rounded-full transition" 
              onClick={() => onNavigate('passport')} 
              title="Edit Profile"
            >
              <span className="material-symbols-outlined text-slate-600">assignment_ind</span>
            </button>
          </>
        )}
        
        {isLoggedIn && onLogout && (
          <button 
            className="flex items-center gap-1 text-slate-400 hover:text-indigo-600 text-sm font-bold ml-2 transition"
            onClick={onLogout}
            title="Logout"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
