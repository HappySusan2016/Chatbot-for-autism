import React, { useEffect, useState } from 'react';

const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    const ids = Array.from({ length: 50 }, (_, i) => i);
    setParticles(ids);
  }, []);

  return (
    <>
      <style>{`
        .confetti {
          position: fixed;
          width: 10px; height: 10px;
          animation: fall 3s linear forwards;
          z-index: 100;
          top: -20px;
        }
        @keyframes fall { to { transform: translateY(100vh) rotate(720deg); } }
      `}</style>
      {particles.map((i) => {
        const left = Math.random() * 100 + 'vw';
        const duration = Math.random() * 2 + 2 + 's';
        const color = ['#FFD700', '#FF6347', '#40E0D0', '#EE82EE'][Math.floor(Math.random() * 4)];
        return (
          <div 
            key={i}
            className="confetti"
            style={{ left, animationDuration: duration, backgroundColor: color }}
          />
        );
      })}
    </>
  );
};

export default Confetti;
