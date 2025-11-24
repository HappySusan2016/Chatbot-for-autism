
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChildProfile, Story } from '../types';

interface StoryPlayerProps {
  story: Story;
  profile: ChildProfile;
  onFinish: () => void;
  onExit: () => void;
}

// Fallback images (Cute/Soft/Cartoon-like) to use if AI generation fails
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1558060370-d644479cb673?auto=format&fit=crop&w=800&q=80", // Cute animal
  "https://images.unsplash.com/photo-1555596873-45521b446f2f?auto=format&fit=crop&w=800&q=80", // Knitted bear
  "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80", // Toys
  "https://images.unsplash.com/photo-1515488042361-25f4682f2c33?auto=format&fit=crop&w=800&q=80"  // Soft toy
];

const StoryPlayer: React.FC<StoryPlayerProps> = ({ story, profile, onFinish, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  
  // Interactive Effects
  const [clickEffects, setClickEffects] = useState<{id: number, x: number, y: number, char: string}[]>([]);
  
  // Image Generation State
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  const slide = story.slides[currentIndex];
  
  // Processed Text
  const processedText = slide.text
    .replace(/{name}/g, profile.name)
    .replace(/{interest}/g, profile.interest)
    .replace(/{strategy}/g, profile.strategy);
    
  const processedTip = slide.parentTip;
  const processedAction = slide.parentAction.replace(/{strategy}/g, profile.strategy);

  // Helper for TTS - Updated for Cuter/Softer Voice
  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Voice Selection Logic
    let selectedVoice = null;

    if (profile.voiceURI !== 'default') {
      selectedVoice = window.speechSynthesis.getVoices().find(v => v.voiceURI === profile.voiceURI);
    } else {
      // Auto-select a softer/friendly voice if default is chosen
      const voices = window.speechSynthesis.getVoices();
      selectedVoice = voices.find(v => v.name.includes('Google US English')) ||
                      voices.find(v => v.name.includes('Samantha')) || 
                      voices.find(v => v.name.includes('Zira')) ||
                      voices.find(v => v.name.toLowerCase().includes('female')) ||
                      null;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Tuning for "Cute/Soft" Voice
    // Pitch: Higher (>1.0) sounds younger/happier. 1.2-1.3 is a "sweet spot" for storytelling.
    // Rate: Slightly slower (<1.0) is more engaging and easier for children to process.
    utterance.pitch = 1.2; 
    utterance.rate = 0.9; 
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
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

  // Ensure voices are loaded
  useEffect(() => {
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Image Generation Logic
  useEffect(() => {
    // 1. If we already have a generated image in state, use it.
    if (generatedImages[currentIndex]) return;

    // 2. If the story has a hardcoded static URL, use it (only if not empty string).
    if (slide.imgUrl && slide.imgUrl.trim().length > 0) return;

    // 3. If the story has a pre-generated image (custom stories passed from creation), use it.
    if (slide.generatedImage) return;

    const useFallback = () => {
       const randomFallback = FALLBACK_IMAGES[currentIndex % FALLBACK_IMAGES.length];
       setGeneratedImages(prev => ({ ...prev, [currentIndex]: randomFallback }));
    };

    // 4. Fallback: Generate the image.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.warn("API Key not available for image generation.");
        useFallback();
        return;
    }

    const generateImage = async () => {
      // Prevent double loading
      if (loadingStates[currentIndex]) return;

      setLoadingStates(prev => ({ ...prev, [currentIndex]: true }));

      try {
        const ai = new GoogleGenAI({ apiKey: apiKey });
        
        const avatarDesc = profile.avatar === 'bear' ? 'a cute friendly teddy bear character illustration' : 
                           profile.avatar === 'robot' ? 'a cute friendly round robot character illustration' : 'a cute soft cat character illustration';
        
        const baseDescription = slide.visualPrompt || slide.text;
        const sceneDesc = baseDescription
          .replace(/{name}/g, 'the main character')
          .replace(/{interest}/g, profile.interest)
          .replace(/{strategy}/g, 'calming down');

        // REFINED PROMPT FOR CARTOON/SOFT STYLE
        const prompt = `
          Create a flat digital vector art illustration for a children's book.
          
          SUBJECT: ${avatarDesc} in a scene about ${sceneDesc}.
          STYLE: Minimalist vector art, soft pastel colors, clean thick lines, simple shapes. 
          AESTHETIC: Cute, kawaii, warm, safe, comfortable, cartoon style.
          
          NEGATIVE PROMPT: No photorealism, no 3D realistic rendering, no scary elements, no dark colors, no text, no complex details, no blurry photos, no scary faces.
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
            setGeneratedImages(prev => ({ ...prev, [currentIndex]: imageUrl }));
            foundImage = true;
            break;
          }
        }
        
        if (!foundImage) throw new Error("No image data found");

      } catch (error) {
        console.error("Image generation failed:", error);
        useFallback();
      } finally {
        setLoadingStates(prev => ({ ...prev, [currentIndex]: false }));
      }
    };

    generateImage();
  }, [currentIndex, story.id, profile, slide, loadingStates, generatedImages]);

  useEffect(() => {
    setFeedback(null);
    setSelectedChoiceIndex(null);
    stopSpeech();
    setClickEffects([]); 
  }, [currentIndex]);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

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
    
    // Reward Effect
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

  const activeImage = generatedImages[currentIndex] || slide.generatedImage || slide.imgUrl;
  const isLoading = loadingStates[currentIndex] && !activeImage;

  return (
    <section className="h-full flex flex-col relative bg-white md:bg-indigo-50/30 slide-enter">
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
        }
        .animate-float-up {
          animation: floatUp 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .shimmer {
          background: linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Progress Bar */}
      <div className="h-3 bg-slate-100 w-full shrink-0">
        <div 
          className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-500 rounded-r-full" 
          style={{ width: `${((currentIndex + 1) / story.slides.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full md:p-6 md:gap-6 h-full overflow-hidden">
        {/* Left: Visual & Narrative */}
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
            
            {/* Click Effects Overlay */}
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

            <button 
              className="absolute top-4 right-4 bg-white/90 backdrop-blur text-teal-600 p-2 rounded-full shadow-lg hover:bg-teal-50 transition border border-teal-100 z-30 transform hover:scale-105" 
              onClick={(e) => { e.stopPropagation(); stopSpeech(); setShowPauseModal(true); }} 
              title="Take a Compassionate Pause"
            >
              <span className="material-symbols-outlined text-2xl">self_improvement</span>
            </button>
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
                  {selectedChoiceIndex === idx && (
                    <span className="absolute -top-3 -right-3 bg-indigo-500 text-white rounded-full p-1 shadow-md animate-bounce">
                      <span className="material-symbols-outlined text-sm">favorite</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Parent Companion */}
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
            <div className="mt-4 bg-white/60 p-3 rounded-lg text-sm text-indigo-800 border border-indigo-100 flex gap-2 items-center">
              <span className="material-symbols-outlined text-xl text-indigo-400">touch_app</span>
              <span>Tap the picture for magic stars!</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-orange-200 flex justify-between items-center">
            <button 
              className="p-3 rounded-full hover:bg-orange-100 text-slate-500 disabled:opacity-30 transition" 
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="text-sm font-bold text-slate-400">
              {currentIndex + 1} of {story.slides.length}
            </div>
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

      {/* Compassion Pause Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-teal-900/90 z-50 flex items-center justify-center p-6 backdrop-blur-sm slide-enter">
          <div className="bg-white rounded-3xl p-8 text-center max-w-md w-full shadow-2xl">
            <div className="w-24 h-24 bg-teal-50 rounded-full mx-auto mb-6 flex items-center justify-center breathing-circle">
              <span className="material-symbols-outlined text-5xl text-teal-500">spa</span>
            </div>
            <h2 className="text-3xl font-bold mb-3 font-fredoka text-slate-800">Breathe With Me</h2>
            <p className="text-lg text-slate-600 mb-8">Let's take a deep breath in...<br/>and let it out slowly.</p>
            <button 
              className="bg-teal-500 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-teal-600 transition transform hover:scale-105" 
              onClick={() => setShowPauseModal(false)}
            >
              I'm Ready Now
            </button>
          </div>
        </div>
      )}
      
      {/* Close button for full story view */}
      <button 
        className="fixed top-20 right-4 md:right-8 bg-white/80 hover:bg-white p-3 rounded-full text-slate-500 z-40 shadow-sm transition transform hover:rotate-90"
        onClick={onExit}
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </section>
  );
};

export default StoryPlayer;
