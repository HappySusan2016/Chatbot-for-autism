import React from 'react';
import Confetti from '../components/Confetti';
import { ChildProfile, Story } from '../types';

interface CompletionProps {
  profile: ChildProfile;
  story: Story;
  onContinue: () => void;
}

const Completion: React.FC<CompletionProps> = ({ profile, story, onContinue }) => {
  return (
    <section className="min-h-full flex items-center justify-center p-6 bg-yellow-50 relative overflow-hidden slide-enter">
      <Confetti />
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-lg w-full relative overflow-hidden z-10">
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300"></div>
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 animate-bounce">
          <span className="material-symbols-outlined text-6xl">emoji_events</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2 font-fredoka">Great Job, <span className="text-indigo-600">{profile.name}</span>!</h2>
        <p className="text-slate-600 mb-8">You finished the story about <span className="font-bold">{story.topic}</span>.</p>
        <div className="flex gap-4 justify-center">
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105" 
            onClick={onContinue}
          >
            Collect Star
          </button>
        </div>
      </div>
    </section>
  );
};

export default Completion;
