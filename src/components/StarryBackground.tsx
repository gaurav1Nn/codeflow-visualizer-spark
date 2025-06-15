
import React from 'react';

interface StarryBackgroundProps {
  density?: 'light' | 'medium' | 'heavy';
  className?: string;
}

export const StarryBackground: React.FC<StarryBackgroundProps> = ({ 
  density = 'light',
  className = '' 
}) => {
  const particleCount = density === 'light' ? 8 : density === 'medium' ? 15 : 25;
  const orbCount = density === 'light' ? 3 : density === 'medium' ? 5 : 8;
  const mediumParticleCount = density === 'light' ? 5 : density === 'medium' ? 8 : 12;

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      {/* Small star particles with staggered delays */}
      <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '2s' }}>
        {Array.from({ length: particleCount }, (_, i) => (
          <div
            key={`star-particle-${i}`}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-float-particle opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${2 + (i * 0.5)}s`,
              animationDuration: `${10 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      {/* Glowing orbs with extended delays */}
      <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '3s' }}>
        {Array.from({ length: orbCount }, (_, i) => (
          <div
            key={`glow-orb-${i}`}
            className="absolute animate-orb-glow"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${3 + (i * 2)}s`,
              animationDuration: `${15 + Math.random() * 8}s`
            }}
          >
            <div 
              className={`w-1 h-1 rounded-full ${
                i % 3 === 0 ? 'bg-blue-400/40' : 
                i % 3 === 1 ? 'bg-purple-400/40' : 'bg-pink-400/40'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Medium floating particles with longer delays */}
      <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '4s' }}>
        {Array.from({ length: mediumParticleCount }, (_, i) => (
          <div
            key={`medium-particle-${i}`}
            className="absolute animate-large-particle-drift"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${4 + (i * 3)}s`,
              animationDuration: `${18 + Math.random() * 10}s`
            }}
          >
            <div className="w-0.5 h-0.5 bg-slate-300 rounded-full opacity-20" />
          </div>
        ))}
      </div>
    </div>
  );
};
