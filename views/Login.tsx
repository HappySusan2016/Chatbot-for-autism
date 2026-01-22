
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      onLogin();
    } else {
      setError('Incorrect PIN');
      setPin('');
    }
  };

  return (
    <section className="h-full flex flex-col items-center justify-center p-6 bg-slate-50 slide-enter">
      <div className="max-w-sm w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-indigo-50">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500">
          <span className="material-symbols-outlined text-4xl">lock</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 font-fredoka">Parent Access</h2>
        <p className="text-slate-500 mb-8 text-sm">Enter PIN to access profile</p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="password" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={4}
            className="w-full text-center text-4xl tracking-[0.5em] font-bold text-indigo-600 py-4 border-b-2 border-indigo-100 focus:border-indigo-500 outline-none bg-transparent mb-4 placeholder-indigo-200"
            placeholder="••••"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mb-4 animate-pulse">{error}</p>}
          
          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-95 mt-4"
          >
            Unlock
          </button>
        </form>
        <p className="text-xs text-slate-300 mt-6">Default PIN: 1234</p>
      </div>
    </section>
  );
};

export default Login;
