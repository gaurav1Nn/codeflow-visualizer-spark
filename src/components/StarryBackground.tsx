
import React from 'react';

interface StarryBackgroundProps {
  density?: 'light' | 'medium' | 'heavy';
  className?: string;
}

export const StarryBackground: React.FC<StarryBackgroundProps> = ({ 
  density = 'light',
  className = '' 
}) => {
  const particleCount = density === 'light' ? 15 : density === 'medium' ? 25 : 40;
  const orbCount = density === 'light' ? 8 : density === 'medium' ? 12 : 18;
  const mediumParticleCount = density === 'light' ? 10 : density === 'medium' ? 15 : 22;

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      {/* Small star particles - immediately visible */}
      <div className="absolute inset-0">
        {Array.from({ length: particleCount }, (_, i) => (
          <div
            key={`star-particle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full animate-float-particle opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Glowing orbs - visible with short delays */}
      <div className="absolute inset-0">
        {Array.from({ length: orbCount }, (_, i) => (
          <div
            key={`glow-orb-${i}`}
            className="absolute animate-orb-glow"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${12 + Math.random() * 6}s`
            }}
          >
            <div 
              className={`w-2 h-2 rounded-full ${
                i % 3 === 0 ? 'bg-blue-400/60' : 
                i % 3 === 1 ? 'bg-purple-400/60' : 'bg-pink-400/60'
              }`}
              style={{
                boxShadow: `0 0 20px ${
                  i % 3 === 0 ? 'rgba(59, 130, 246, 0.4)' : 
                  i % 3 === 1 ? 'rgba(147, 51, 234, 0.4)' : 'rgba(236, 72, 153, 0.4)'
                }`
              }}
            />
          </div>
        ))}
      </div>

      {/* Medium floating particles - visible with minimal delays */}
      <div className="absolute inset-0">
        {Array.from({ length: mediumParticleCount }, (_, i) => (
          <div
            key={`medium-particle-${i}`}
            className="absolute animate-large-particle-drift"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${15 + Math.random() * 8}s`
            }}
          >
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full opacity-40" />
          </div>
        ))}
      </div>

      {/* Bubble effects - new addition for more visible effects */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={`bubble-${i}`}
            className="absolute animate-pulse"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          >
            <div 
              className={`w-3 h-3 rounded-full ${
                i % 2 === 0 ? 'bg-cyan-400/30' : 'bg-violet-400/30'
              }`}
              style={{
                boxShadow: `0 0 15px ${
                  i % 2 === 0 ? 'rgba(34, 211, 238, 0.3)' : 'rgba(139, 92, 246, 0.3)'
                }`
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
