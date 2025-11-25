

import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ChildProfile, Slide, Story } from '../types';
import { FALLBACK_IMAGES } from '../constants';

interface CreateStoryProps {
  profile: ChildProfile;
  onSave: (story: Story) => void;
  onCancel: () => void;
}

const CreateStory: React.FC<CreateStoryProps> = ({ profile, onSave, onCancel }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  const handleCreate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setProgress(10);
    setStatusText('Writing the story...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // 1. Generate Story Structure
      const systemInstruction = `
        You are an expert in creating social stories for children with autism.
        Create a 4-slide social story about the topic provided.
        The story should be simple, positive, and reassuring.
        The slides must be: Intro, Sensory/Conflict, Interaction, Conclusion.
        Use placeholders {name}, {interest}, {strategy} in the text.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create a social story about: ${topic} for a child named ${profile.name} who likes ${profile.interest}.`,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    slides: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                type: { type: Type.STRING, enum: ['intro', 'sensory', 'interaction', 'conflict', 'conclusion'] },
                                text: { type: Type.STRING },
                                visualPrompt: { type: Type.STRING },
                                parentTip: { type: Type.STRING },
                                parentAction: { type: Type.STRING },
                                choices: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            text: { type: Type.STRING },
                                            feedback: { type: Type.STRING }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
      });

      let jsonString = response.text || '{}';
      jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');

      let storyData;
      try {
        storyData = JSON.parse(jsonString);
      } catch (e) {
        console.error("JSON Parse Error:", e);
        setStatusText('Error reading the story. Please try again.');
        setIsGenerating(false);
        return;
      }
      
      setProgress(40);
      setStatusText('Illustrating the story (this may take a moment)...');

      // 2. Generate Images for each slide
      const slidesWithImages: Slide[] = [];
      const totalSlides = storyData.slides?.length || 0;

      for (let i = 0; i < totalSlides; i++) {
        const slide = storyData.slides[i];
        
        const avatarDesc = profile.avatar === 'bear' ? 'a cute friendly teddy bear' : 
                           profile.avatar === 'robot' ? 'a cute friendly round robot' : 'a cute soft cat';
        
        const sceneDesc = slide.visualPrompt || slide.text;
        
        // Consistent STRICT prompt
        const imagePrompt = `
          Generate a cute, flat vector art illustration for a children's book.
          
          Character: ${avatarDesc}
          Scene Context: ${sceneDesc}
          
          Art Style:
          - Soft pastel colors
          - Minimalist vector art with clean thick lines
          - Kawaii, warm, friendly
          - No text, no photorealism
        `;

        try {
          const imgResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: imagePrompt }] },
          });

          let generatedImage = '';
          for (const part of imgResponse.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
              generatedImage = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
              break;
            }
          }
          
          if (!generatedImage) throw new Error("No image data returned");

          slidesWithImages.push({
            ...slide,
            imgUrl: '', 
            generatedImage: generatedImage
          });

        } catch (e: any) {
          // Silent fallback for Quota exceeded or other errors
          const isQuota = e.message?.includes('429') || e.status === 429;
          console.warn(`Slide ${i} image generation failed ${isQuota ? '(Quota Exceeded)' : ''}, using fallback.`);
          
          slidesWithImages.push({ 
            ...slide, 
            imgUrl: FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
            generatedImage: undefined 
          });
        }

        setProgress(40 + Math.floor(((i + 1) / totalSlides) * 50));
      }

      const newStory: Story = {
        id: `custom-${Date.now()}`,
        title: storyData.title || topic,
        topic: topic,
        description: storyData.description || `A story about ${topic}`,
        coverImage: slidesWithImages[0]?.generatedImage || slidesWithImages[0]?.imgUrl || FALLBACK_IMAGES[0],
        tags: { icon: 'auto_awesome', label: 'Custom Story', color: 'text-purple-600', bg: 'bg-purple-50' },
        slides: slidesWithImages,
        isCustom: true
      };

      setProgress(100);
      setStatusText('Done!');
      setTimeout(() => onSave(newStory), 500);

    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      setStatusText('');
      alert("Something went wrong creating the story text. Please try again.");
    }
  };

  return (
    <section className="min-h-full flex flex-col items-center justify-center p-6 slide-enter bg-indigo-50">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
        
        {isGenerating && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur z-20 flex flex-col items-center justify-center p-8">
             <div className="w-24 h-24 mb-6 relative">
               <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
               <div 
                 className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"
               ></div>
               <div className="absolute inset-0 flex items-center justify-center text-indigo-600 font-bold text-xl">
                 {Math.round(progress)}%
               </div>
             </div>
             <h3 className="text-2xl font-bold text-slate-800 font-fredoka animate-pulse">{statusText}</h3>
             <p className="text-slate-500 mt-2">Creating magic for {profile.name}...</p>
          </div>
        )}

        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">magic_button</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 font-fredoka">Create a New Story</h2>
          <p className="text-slate-600 mt-2">
            Tell us what event is coming up, and we'll write and illustrate a story just for {profile.name}.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">What is the story about?</label>
            <input 
              className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
              placeholder="e.g. Going to the barber, Trying new food, First day of school"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
              autoFocus
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
             <span className="material-symbols-outlined text-blue-500">info</span>
             <p className="text-sm text-blue-800">
               We will generate 4 slides with custom illustrations featuring a friendly {profile.avatar} character.
             </p>
          </div>

          <div className="flex gap-4 pt-2">
            <button 
              className="flex-1 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition"
              onClick={onCancel}
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button 
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:scale-[1.02] disabled:opacity-70 disabled:scale-100"
              onClick={handleCreate}
              disabled={!topic.trim() || isGenerating}
            >
              Create Story
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateStory;