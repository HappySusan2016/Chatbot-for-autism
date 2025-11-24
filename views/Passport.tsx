
import React, { useState, useEffect } from 'react';
import { ChildProfile, ViewState } from '../types';

interface PassportProps {
  onSave: (profile: ChildProfile) => void;
  initialProfile: ChildProfile | null;
}

const Passport: React.FC<PassportProps> = ({ onSave, initialProfile }) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [avatar, setAvatar] = useState<ChildProfile['avatar']>(initialProfile?.avatar || 'bear');
  const [interest, setInterest] = useState(initialProfile?.interest || '');
  const [strategy, setStrategy] = useState(initialProfile?.strategy || 'wear headphones');
  const [voiceURI, setVoiceURI] = useState(initialProfile?.voiceURI || 'default');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    // Safety check for speech synthesis environment
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        try {
          const voices = window.speechSynthesis.getVoices();
          setAvailableVoices(voices);
        } catch (e) {
          console.warn("Could not load speech voices", e);
        }
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // Cleanup
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, avatar, interest, strategy, voiceURI });
  };

  return (
    <section className="min-h-full p-6 md:p-12 slide-enter overflow-y-auto">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-8 border-b pb-4">
          <span className="material-symbols-outlined text-4xl text-teal-500">face</span>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 font-fredoka">Communication Passport</h2>
            <p className="text-slate-500">Customize the experience for your child.</p>
          </div>
        </div>
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Child's Name</label>
              <input 
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="e.g. Alex" 
                required 
                type="text" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Avatar Helper</label>
              <div className="flex gap-4">
                {(['bear', 'robot', 'cat'] as const).map(a => (
                  <label key={a} className="cursor-pointer">
                    <input 
                      className="peer hidden" 
                      name="avatar" 
                      type="radio" 
                      value={a} 
                      checked={avatar === a}
                      onChange={() => setAvatar(a)}
                    />
                    <div className="w-16 h-16 rounded-xl border-2 border-slate-200 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 flex items-center justify-center text-3xl grayscale peer-checked:grayscale-0 transition">
                      {a === 'bear' ? '🐻' : a === 'robot' ? '🤖' : '🐱'}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Special Interest (Motivator)</label>
            <input 
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
              value={interest} 
              onChange={e => setInterest(e.target.value)} 
              placeholder="e.g. Trains, Dinosaurs, Lego" 
              required 
              type="text" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Sensory Strategy</label>
            <select 
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white" 
              value={strategy}
              onChange={e => setStrategy(e.target.value)}
            >
              <option value="wear headphones">Wear noise-canceling headphones</option>
              <option value="take deep breaths">Take 3 deep breaths</option>
              <option value="squeeze a toy">Squeeze a fidget toy</option>
              <option value="ask for a break">Ask for a quiet break</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Audio Voice Preference</label>
            <select 
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white" 
              value={voiceURI}
              onChange={e => setVoiceURI(e.target.value)}
            >
              <option value="default">Default System Voice</option>
              {availableVoices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
              ))}
            </select>
          </div>
          <div className="pt-4 text-right">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition" type="submit">
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Passport;
