
import React, { useState } from 'react';
import { IMAGES } from '../constants';

interface LandingProps {
  onStart: () => void;
  onDownload: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart, onDownload }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="h-full flex flex-col items-center justify-center p-6 text-center space-y-8 max-w-2xl mx-auto slide-enter">
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white bg-white flex items-center justify-center">
        {!imgError ? (
          <img 
            alt="Welcome" 
            className="object-cover w-full h-full" 
            src={IMAGES.landing}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-indigo-50 flex flex-col items-center justify-center text-indigo-300">
            <span className="material-symbols-outlined text-9xl">auto_stories</span>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-4xl font-bold text-indigo-800 mb-4 font-fredoka">Welcome to StoryPal</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          Personalized, compassion-infused social stories for your child. <br />
          Includes <strong>Parent Training</strong> and <strong>Text-to-Speech</strong>.
        </p>
        <div className="flex flex-col gap-4 items-center">
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold py-4 px-10 rounded-full shadow-lg transform transition hover:scale-105 flex items-center gap-2" 
            onClick={onStart}
          >
            <span>Get Started</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button 
            className="text-indigo-600 text-sm font-semibold hover:underline md:hidden" 
            onClick={onDownload}
          >
            Download App for Offline Use
          </button>
        </div>
      </div>
    </section>
  );
};

export default Landing;
