
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChildProfile, Story } from '../types';
import { FALLBACK_IMAGES } from '../constants';

interface StoryPlayerProps {
  story: Story;
  profile: ChildProfile;
  onFinish: () => void;
  onExit: () => void;
  imageCache: Record<number, string>;
  onCacheImage: (index: number, url: string) => void;
}

const StoryPlayer: React.FC<StoryPlayerProps> = ({ 
  story, 
  profile, 
  onFinish, 
  onExit,
  imageCache,
  onCacheImage
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Voice Settings State
  const [voicePitch, setVoicePitch] = useState(1.1);
  const [voiceRate, setVoiceRate] = useState(0.9);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  
  // Interactive Effects
  const [clickEffects, setClickEffects] = useState<{id: number, x: number, y: number, char: string}[]>([]);
  
  // Image Generation State
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
  
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const slide = story?.slides?.[currentIndex];
  
  // Safe Processed Text - Prevents "Cannot read properties of undefined (reading 'replace')"
  const processedText = (slide?.text || "")
    .replace(/{name}/g, profile?.name || "friend")
    .replace(/{interest}/g, profile?.interest || "things you like")
    .replace(/{strategy}/g, profile?.strategy || "taking a breath");
    
  const processedTip = slide?.parentTip || "";
  const processedAction = (slide?.parentAction || "")
    .replace(/{strategy}/g, profile?.strategy || "taking a breath");

  // Helper for TTS
  const speak = (text: string, isTest: boolean = false) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    let selectedVoice = null;
    const voices = window.speechSynthesis.getVoices();
    
    selectedVoice = 
      voices.find(v => v.name.includes('Natural') && v.name.includes('English')) ||
      voices.find(v => v.name === 'Google US English') ||
      voices.find(v => v.name === 'Samantha') || 
      voices.find(v => v.name === 'Tessa') ||
      voices.find(v => v.lang.startsWith('en'));

    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.pitch = voicePitch; 
    utterance.rate = voiceRate; 
    
    if (!isTest) {
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
    }
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleSpeech = () => {
    if (isSpeaking) stopSpeech();
    else speak(feedback || processedText);
  };

  useEffect(() => {
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Image Generation Logic
  useEffect(() => {
    if (!slide) return;
    if (imageCache[currentIndex]) return;
    if (slide.imgUrl && slide.imgUrl.trim().length > 0) return;
    if (slide.generatedImage) return;

    const useFallback = () => {
       const randomFallback = FALLBACK_IMAGES[currentIndex % FALLBACK_IMAGES.length];
       if (isMounted.current) onCacheImage(currentIndex, randomFallback);
    };

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        useFallback();
        return;
    }

    const generateImage = async () => {
      if (loadingStates[currentIndex]) return;
      if (isMounted.current) setLoadingStates(prev => ({ ...prev, [currentIndex]: true }));

      try {
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const avatarDesc = profile.avatar === 'bear' ? 'a cute friendly teddy bear' : 
                           profile.avatar === 'robot' ? 'a cute friendly round robot' : 'a cute soft cat';
        
        const baseDescription = slide.visualPrompt || slide.text || "a happy scene";
        const sceneDesc = (baseDescription || "")
          .replace(/{name}/g, 'the main character')
          .replace(/{interest}/g, profile.interest || "toys")
          .replace(/{strategy}/g, 'calming down');

        const prompt = `
          Generate a cute, flat vector art illustration for a children's book.
          Character: ${avatarDesc}
          Specific Activity: ${sceneDesc}
          Art Style: Soft pastel colors, minimalist vector art, clean thick lines, kawaii, warm, friendly.
          Requirements: Simple uncluttered background, no text, no photorealism.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: prompt }] },
        });

        let foundImage = false;
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            const base64 = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            const imageUrl = `data:${mimeType};base64,${base64}`;
            if (isMounted.current) onCacheImage(currentIndex, imageUrl);
            foundImage = true;
            break;
          }
        }
        if (!foundImage) useFallback();
      } catch (error) {
        useFallback();
      } finally {
        if (isMounted.current) setLoadingStates(prev => ({ ...prev, [currentIndex]: false }));
      }
    };

    generateImage();
  }, [currentIndex, story.id, profile, slide, loadingStates, imageCache, onCacheImage]);

  useEffect(() => {
    setFeedback(null);
    setSelectedChoiceIndex(null);
    stopSpeech();
    setClickEffects([]); 
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < story.slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleChoice = (index: number, feedbackText: string) => {
    setSelectedChoiceIndex(index);
    setFeedback(feedbackText);
    speak(feedbackText);
    
    const id = Date.now();
    setClickEffects(prev => [
      ...prev, 
      { id, x: 50, y: 50, char: '🌟' },
      { id: id + 1, x: 45, y: 55, char: '💖' },
      { id: id + 2, x: 55, y: 45, char: '✨' }
    ]);
    setTimeout(() => {
      setClickEffects(prev => prev.filter(e => e.id < id));
    }, 1500);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (loadingStates[currentIndex]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const id = Date.now() + Math.random();
    const emojis = ['⭐', '❤️', '✨', '🎈', '🎵', '🌸', '🐾'];
    const char = emojis[Math.floor(Math.random() * emojis.length)];
    setClickEffects(prev => [...prev, { id, x, y, char }]);
    setTimeout(() => {
      setClickEffects(prev => prev.filter(e => e.id !== id));
    }, 800);
  };

  const tipTitleMap: Record<string, string> = { 
    'intro': 'Start Together', 
    'sensory': 'Check Feelings', 
    'interaction': 'Teachable Moment', 
    'conflict': 'Teachable Moment', 
    'conclusion': 'Great Job!' 
  };

  const activeImage = imageCache[currentIndex] || slide?.generatedImage || slide?.imgUrl;
  const isLoading = loadingStates[currentIndex] && !activeImage;

  if (!slide) return null;

  return (
    <section className="h-full flex flex-col relative bg-white md:bg-indigo-50/30 slide-enter">
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
        }
        .animate-float-up { animation: floatUp 0.8s ease-out forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .shimmer {
          background: linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>

      <div className="h-3 bg-slate-100 w-full shrink-0">
        <div 
          className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-500 rounded-r-full" 
          style={{ width: `${((currentIndex + 1) / story.slides.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full md:p-6 md:gap-6 h-full overflow-hidden">
        <div className="flex-1 flex flex-col bg-white md:rounded-3xl md:shadow-xl overflow-hidden relative border border-slate-100 ring-4 ring-indigo-50">
          <div 
            className="h-1/2 md:h-2/3 bg-slate-100 relative group overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
            onClick={handleImageClick}
          >
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-50 z-10 shimmer">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 animate-bounce">
                  <span className="material-symbols-outlined text-4xl text-indigo-400">palette</span>
                </div>
                <p className="text-indigo-600 font-bold font-fredoka text-lg">Drawing a picture for you...</p>
              </div>
            ) : (
              <img 
                key={currentIndex} 
                className="w-full h-full object-cover transition-opacity duration-700 animate-[fadeIn_0.5s_ease-in-out]" 
                src={activeImage || FALLBACK_IMAGES[0]} 
                alt="Story scene"
              />
            )}
            
            {clickEffects.map(effect => (
              <div 
                key={effect.id}
                className="absolute pointer-events-none text-4xl animate-float-up z-20 select-none"
                style={{ left: `${effect.x}%`, top: `${effect.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                {effect.char}
              </div>
            ))}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent p-6 pt-12 pb-4 pointer-events-none">
              <p className="comic-font text-2xl md:text-3xl text-slate-800 leading-snug drop-shadow-sm">
                {feedback || processedText}
              </p>
            </div>
            
            <button 
              className="absolute top-4 left-4 bg-white/90 backdrop-blur text-indigo-600 p-3 rounded-full shadow-lg hover:bg-indigo-50 transition border border-indigo-100 flex items-center gap-2 z-30 transform hover:scale-105" 
              onClick={(e) => { e.stopPropagation(); toggleSpeech(); }} 
              title="Read Aloud"
            >
              <span className={`material-symbols-outlined ${isSpeaking ? 'text-indigo-600' : ''}`}>
                {isSpeaking ? 'stop_circle' : 'volume_up'}
              </span>
              {isSpeaking && (
                <div className="speaking-wave flex"><span></span><span></span><span></span></div>
              )}
            </button>

            <div className="absolute top-4 right-4 flex gap-2 z-30">
              <button 
                className="bg-white/90 backdrop-blur text-slate-600 p-2 rounded-full shadow-lg hover:bg-slate-50 transition border border-slate-200 transform hover:scale-105" 
                onClick={(e) => { e.stopPropagation(); setShowSettings(true); }} 
                title="Voice Settings"
              >
                <span className="material-symbols-outlined text-2xl">settings_voice</span>
              </button>
              <button 
                className="bg-white/90 backdrop-blur text-teal-600 p-2 rounded-full shadow-lg hover:bg-teal-50 transition border border-teal-100 transform hover:scale-105" 
                onClick={(e) => { e.stopPropagation(); stopSpeech(); setShowPauseModal(true); }} 
                title="Take a Compassionate Pause"
              >
                <span className="material-symbols-outlined text-2xl">self_improvement</span>
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col justify-center items-center bg-indigo-50/30 border-t border-indigo-100 overflow-y-auto">
            <div className="w-full max-w-2xl text-center flex flex-wrap justify-center gap-3">
              {slide.choices?.map((choice, idx) => (
                <button 
                  key={idx}
                  className={`
                    relative font-bold py-4 px-8 rounded-2xl shadow-sm border-2 transition-all transform hover:-translate-y-1 text-lg
                    ${selectedChoiceIndex === idx 
                      ? 'bg-indigo-100 border-indigo-400 text-indigo-800 ring-2 ring-indigo-200 scale-105' 
                      : 'bg-white border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300'
                    }
                  `}
                  onClick={() => handleChoice(idx, choice.feedback)}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:w-80 bg-orange-50 md:rounded-3xl md:shadow-lg border-l-4 border-orange-200 p-6 flex flex-col shrink-0">
          <div className="flex items-center gap-2 mb-4 text-orange-800 font-bold uppercase tracking-wider text-xs">
            <span className="material-symbols-outlined text-sm">face</span>
            Parent Guide
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <h4 className="font-bold text-xl text-slate-800 mb-2 font-fredoka">{tipTitleMap[slide.type] || "Guide"}</h4>
            <p className="text-slate-700 text-base mb-6 leading-relaxed">{processedTip}</p>
            {processedAction && (
              <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm mb-4">
                <p className="text-xs font-bold text-slate-400 mb-1 tracking-wide">TRY THIS TOGETHER</p>
                <p className="text-indigo-600 font-medium italic text-lg">"{processedAction}"</p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-orange-200 flex justify-between items-center">
            <button 
              className="p-3 rounded-full hover:bg-orange-100 text-slate-500 disabled:opacity-30 transition" 
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="text-sm font-bold text-slate-400">{currentIndex + 1} of {story.slides.length}</div>
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition transform hover:scale-110 active:scale-95" 
              onClick={handleNext}
            >
              <span className="material-symbols-outlined">
                {currentIndex === story.slides.length - 1 ? 'check' : 'arrow_forward'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm slide-enter">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-indigo-100 relative">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" onClick={() => setShowSettings(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-indigo-600">tune</span>
              </div>
              <h2 className="text-2xl font-bold font-fredoka text-slate-800">Voice Settings</h2>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-bold text-slate-700 text-sm">Voice Pitch (Cuteness)</label>
                  <span className="text-xs font-mono text-slate-500">{voicePitch.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="0.5" max="2.0" step="0.1" value={voicePitch}
                  onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                  aria-label="Adjust voice pitch"
                  aria-valuetext={`${voicePitch.toFixed(1)}`}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-bold text-slate-700 text-sm">Reading Speed</label>
                  <span className="text-xs font-mono text-slate-500">{voiceRate.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0.5" max="1.5" step="0.05" value={voiceRate}
                  onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                  aria-label="Adjust reading speed"
                  aria-valuetext={`${voiceRate.toFixed(1)} times normal speed`}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <button 
                className="w-full py-3 rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 hover:bg-indigo-100 transition flex items-center justify-center gap-2"
                onClick={() => speak("Hello! Do you like my voice?", true)}
              >
                <span className="material-symbols-outlined">volume_up</span> Test Voice
              </button>
              <button className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold" onClick={() => setShowSettings(false)}>Done</button>
            </div>
          </div>
        </div>
      )}

      {showPauseModal && (
        <div className="fixed inset-0 bg-teal-900/90 z-50 flex items-center justify-center p-6 backdrop-blur-sm slide-enter">
          <div className="bg-white rounded-3xl p-8 text-center max-w-md w-full shadow-2xl">
            <div className="w-24 h-24 bg-teal-50 rounded-full mx-auto mb-6 flex items-center justify-center breathing-circle">
              <span className="material-symbols-outlined text-5xl text-teal-500">spa</span>
            </div>
            <h2 className="text-3xl font-bold mb-3 font-fredoka text-slate-800">Breathe With Me</h2>
            <p className="text-lg text-slate-600 mb-8">Let's take a deep breath in...<br/>and let it out slowly.</p>
            <button className="bg-teal-500 text-white font-bold py-4 px-10 rounded-full shadow-lg" onClick={() => setShowPauseModal(false)}>I'm Ready Now</button>
          </div>
        </div>
      )}
      <button className="fixed top-20 right-4 md:right-8 bg-white/80 hover:bg-white p-3 rounded-full text-slate-500 z-40 shadow-sm transition transform hover:rotate-90" onClick={onExit}>
        <span className="material-symbols-outlined">close</span>
      </button>
    </section>
  );
};

export default StoryPlayer;
