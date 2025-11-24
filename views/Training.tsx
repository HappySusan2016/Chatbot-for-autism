import React, { useState } from 'react';
import { ViewState } from '../types';
import { IMAGES } from '../constants';

interface TrainingProps {
  onClose: () => void;
}

const Training: React.FC<TrainingProps> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 5;

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) setCurrentSlide(currentSlide + 1);
  };
  
  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  return (
    <section className="h-full flex flex-col relative bg-slate-900 slide-enter">
      <div className="flex-1 relative overflow-hidden bg-slate-50">
        <div 
          className="flex h-full w-full transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* SLIDE 1: Welcome */}
          <div className="w-full flex-shrink-0 h-full flex items-center justify-center p-8 relative overflow-y-auto">
            <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 z-10">
                <div className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold mb-2">Parent Training</div>
                <h2 className="text-5xl font-bold text-slate-800 leading-tight font-fredoka">Empowering Your Child Through Story</h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Learn how StoryPal combines <strong>compassionate design</strong> with <strong>interactive storytelling</strong> to help your child master social situations.
                </p>
              </div>
              <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white float-anim bg-white">
                <img className="w-full h-full object-cover" src={IMAGES.training_parent} alt="Parent training" />
              </div>
            </div>
            {/* Background blobs */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>

          {/* SLIDE 2: Why it Works */}
          <div className="w-full flex-shrink-0 h-full flex items-center justify-center p-8 overflow-y-auto">
            <div className="max-w-5xl w-full glass-panel p-10 rounded-3xl shadow-xl">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 mb-3 font-fredoka">Why StoryPal Works</h2>
                <p className="text-slate-500">Built on three core pillars of research.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"><span className="material-symbols-outlined">auto_stories</span></div>
                  <h3 className="font-bold text-lg mb-2">Narrative Transportation</h3>
                  <p className="text-sm text-slate-600">Getting "lost" in a story lowers defenses, allowing children to learn skills without pressure.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                  <div className="w-16 h-16 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"><span className="material-symbols-outlined">favorite</span></div>
                  <h3 className="font-bold text-lg mb-2">Compassion First</h3>
                  <p className="text-sm text-slate-600">Technology shouldn't be cold. We prioritize emotional safety for you and your child.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                  <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"><span className="material-symbols-outlined">tune</span></div>
                  <h3 className="font-bold text-lg mb-2">Value-Sensitive Design</h3>
                  <p className="text-sm text-slate-600">Every child is unique. We adapt to your child's specific sensory needs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 3: The Passport */}
          <div className="w-full flex-shrink-0 h-full flex items-center justify-center p-8 bg-indigo-50 overflow-y-auto">
            <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <img className="rounded-3xl shadow-2xl border-4 border-white w-full" src={IMAGES.training_passport} alt="Passport example" />
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="text-4xl font-bold text-slate-800 font-fredoka">The Communication Passport</h2>
                <p className="text-lg text-slate-600">The engine that personalizes every interaction.</p>
                <ul className="space-y-4 mt-4">
                  <li className="flex items-start gap-3"><span className="material-symbols-outlined text-green-500 mt-1">check_circle</span><div><strong className="text-slate-800">Special Interests:</strong><p className="text-sm text-slate-600">We weave their favorite things into the story.</p></div></li>
                  <li className="flex items-start gap-3"><span className="material-symbols-outlined text-green-500 mt-1">check_circle</span><div><strong className="text-slate-800">Sensory Strategy:</strong><p className="text-sm text-slate-600">We suggest calming actions exactly when needed.</p></div></li>
                </ul>
              </div>
            </div>
          </div>

          {/* SLIDE 4: Co-Action */}
          <div className="w-full flex-shrink-0 h-full flex items-center justify-center p-8 overflow-y-auto">
            <div className="max-w-5xl w-full">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-slate-800 font-fredoka">Not Just Reading... Doing!</h2>
                <p className="text-xl text-slate-600 mt-4">StoryPal uses <strong>Parent-Mediated Co-Action</strong>. You are the co-pilot.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="p-8 flex flex-col justify-center space-y-6">
                  <div className="flex gap-4 items-start"><div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center font-bold">1</div><div><h4 className="font-bold text-lg">Read & Listen</h4><p className="text-sm text-slate-600">Use the TTS audio or read aloud.</p></div></div>
                  <div className="flex gap-4 items-start"><div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center font-bold">2</div><div><h4 className="font-bold text-lg">The "Parent Guide"</h4><p className="text-sm text-slate-600">The orange panel gives you a script to check anxiety.</p></div></div>
                  <div className="flex gap-4 items-start"><div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center font-bold">3</div><div><h4 className="font-bold text-lg">Practice Together</h4><p className="text-sm text-slate-600">Actually do the physical actions (e.g., deep breath).</p></div></div>
                </div>
                <div className="bg-indigo-50 relative">
                  <img className="w-full h-full object-cover mix-blend-multiply opacity-90" src={IMAGES.training_highfive} alt="Co-action" />
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 5: Ready */}
          <div className="w-full flex-shrink-0 h-full flex items-center justify-center p-8 bg-yellow-50 overflow-y-auto">
            <div className="max-w-3xl w-full text-center space-y-8">
              <div className="w-48 h-48 mx-auto bg-white rounded-full flex items-center justify-center text-8xl text-yellow-500 shadow-2xl float-anim">
                <span className="material-symbols-outlined" style={{ fontSize: '100px' }}>star</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-800 font-fredoka">You Are Ready!</h2>
              <p className="text-lg text-slate-600">The goal isn't just finishing the story. It's the connection you build.</p>
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-3 px-10 rounded-full shadow-lg transition transform hover:scale-105" 
                onClick={onClose}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-20">
          <button 
            className="bg-white/80 hover:bg-white text-indigo-600 p-4 rounded-full shadow-lg transition disabled:opacity-50 border border-indigo-100" 
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="bg-white/80 px-4 py-2 rounded-full flex items-center font-bold text-indigo-900 shadow-sm">
            <span>{currentSlide + 1} / {totalSlides}</span>
          </div>
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition disabled:opacity-50" 
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        {/* Close */}
        <button 
          className="absolute top-4 right-4 bg-white/50 hover:bg-white p-2 rounded-full transition text-slate-600 z-30" 
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </section>
  );
};

export default Training;