
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
  const orbCount = density === 'light' ? 5 : density === 'medium' ? 8 : 12;
  const mediumParticleCount = density === 'light' ? 8 : density === 'medium' ? 12 : 18;

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      {/* Small star particles */}
      <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '0.5s' }}>
        {Array.from({ length: particleCount }, (_, i) => (
          <div
            key={`star-particle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full animate-float-particle opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '0.8s' }}>
        {Array.from({ length: orbCount }, (_, i) => (
          <div
            key={`glow-orb-${i}`}
            className="absolute animate-orb-glow"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${12 + Math.random() * 6}s`
            }}
          >
            <div 
              className={`w-1.5 h-1.5 rounded-full ${
                i % 3 === 0 ? 'bg-blue-400/60' : 
                i % 3 === 1 ? 'bg-purple-400/60' : 'bg-pink-400/60'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Medium floating particles */}
      <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '1.2s' }}>
        {Array.from({ length: mediumParticleCount }, (_, i) => (
          <div
            key={`medium-particle-${i}`}
            className="absolute animate-large-particle-drift"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + Math.random() * 8}s`
            }}
          >
            <div className="w-1 h-1 bg-slate-300 rounded-full opacity-30" />
          </div>
        ))}
      </div>
    </div>
  );
};
