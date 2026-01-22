
import React from 'react';

interface LandingProps {
  onStart: () => void;
  onDownload: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <section className="h-full flex flex-col items-center justify-center p-6 text-center space-y-8 max-w-4xl mx-auto slide-enter">
      {/* Central Brand Visual */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-indigo-50 flex items-center justify-center">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-indigo-100/50 flex items-center justify-center animate-pulse">
           <span className="material-symbols-outlined text-indigo-300 text-[120px] md:text-[160px] opacity-60">menu_book</span>
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-6 font-fredoka tracking-tight">Welcome to StoryPal</h2>
        <p className="text-xl text-slate-500 leading-relaxed mb-10">
          Personalized, compassion-infused social stories for your child. <br />
          Includes <span className="text-slate-700 font-semibold">Parent Training</span> and <span className="text-slate-700 font-semibold">Text-to-Speech</span>.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button 
            className="w-full sm:w-auto bg-indigo-200 hover:bg-indigo-300 text-indigo-900 text-2xl font-bold py-5 px-12 rounded-full shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3" 
            onClick={onStart}
          >
            <span>Get Started</span>
            <span className="material-symbols-outlined font-bold">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Landing;
