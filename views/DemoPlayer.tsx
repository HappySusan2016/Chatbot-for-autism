
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface DemoPlayerProps {
  onExit: () => void;
}

const DemoPlayer: React.FC<DemoPlayerProps> = ({ onExit }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [hasKey, setHasKey] = useState(false);

  const messages = [
    "Setting up the magical stage...",
    "Gathering our friendly characters...",
    "Painting the scenes with bright colors...",
    "Almost ready to show you the magic...",
    "Just finishing the final touches...",
    "Polishing the storytelling magic...",
    "Bringing the vision to life..."
  ];

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    };
    checkKey();
  }, []);

  const handleOpenKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setHasKey(true); // Proceed assuming success per requirements
  };

  const generateDemo = async () => {
    setLoading(true);
    let msgIndex = 0;
    const interval = setInterval(() => {
      setLoadingMessage(messages[msgIndex % messages.length]);
      msgIndex++;
    }, 12000); 

    setLoadingMessage(messages[0]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: 'A cinematic high-quality 3D animation of a friendly round robot character reading a magical glowing book to a happy child on a comfy sofa. Soft pastel colors, warm cinematic lighting, dust particles floating in light rays, heart emojis floating, clean art style, artistic masterpiece, 1080p.',
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      }
    } catch (error: any) {
      console.error(error);
      if (error?.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        alert("Requested project not found. Please select a valid paid API key project.");
      } else {
        alert("Something went wrong with video generation. Please try again.");
      }
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <section className="h-full flex flex-col items-center justify-center bg-slate-900 p-6 relative overflow-hidden text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 z-0"></div>
      
      <div className="z-10 w-full max-w-4xl flex flex-col items-center">
        {!hasKey ? (
          <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 text-center space-y-6 max-w-md slide-enter">
            <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <span className="material-symbols-outlined text-4xl">key</span>
            </div>
            <h2 className="text-3xl font-bold font-fredoka">Unlock AI Magic</h2>
            <p className="text-slate-300 leading-relaxed">
              To experience the vision of StoryPal, we need a paid API key for video generation. 
              Please see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-indigo-400 underline">billing documentation</a> for details.
            </p>
            <button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-xl transition transform active:scale-95"
              onClick={handleOpenKey}
            >
              Select API Key
            </button>
            <button className="text-sm text-slate-400 hover:text-white transition" onClick={onExit}>Maybe later</button>
          </div>
        ) : loading ? (
          <div className="text-center space-y-8 slide-enter">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 border-8 border-white/10 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-indigo-400 animate-pulse">movie</span>
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold font-fredoka text-indigo-300">{loadingMessage}</h2>
              <p className="text-slate-400 italic">This usually takes about a minute. Stay comfy!</p>
            </div>
            <div className="flex gap-2 justify-center">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-indigo-300 rounded-full animate-bounce"></div>
            </div>
          </div>
        ) : videoUrl ? (
          <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 slide-enter">
            <video 
              src={videoUrl} 
              className="w-full h-full object-contain" 
              controls 
              autoPlay 
              loop
            />
          </div>
        ) : (
          <div className="text-center space-y-8 slide-enter">
             <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-6xl text-indigo-400">auto_videocam</span>
             </div>
             <div>
                <h2 className="text-4xl font-bold font-fredoka mb-2">The Vision of StoryPal</h2>
                <p className="text-xl text-slate-300">Generate a beautiful AI conceptual demo video.</p>
             </div>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition transform hover:scale-105"
                  onClick={generateDemo}
                >
                  Generate AI Demo
                </button>
                <button 
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-10 rounded-full shadow-lg transition"
                  onClick={onExit}
                >
                  Back to Home
                </button>
             </div>
          </div>
        )}
      </div>

      <button 
        className="fixed top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition z-50 text-white shadow-lg"
        onClick={onExit}
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </section>
  );
};

export default DemoPlayer;
