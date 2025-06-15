
import React from 'react';

interface StarryBackgroundProps {
  density?: 'light' | 'medium' | 'heavy';
  className?: string;
  includeBubbles?: boolean;
}

export const StarryBackground: React.FC<StarryBackgroundProps> = ({ 
  density = 'light',
  className = '',
  includeBubbles = true
}) => {
  const particleCount = density === 'light' ? 12 : density === 'medium' ? 20 : 30;
  const bubbleCount = includeBubbles ? (density === 'light' ? 8 : density === 'medium' ? 12 : 18) : 0;

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {/* Star particles */}
      <div className="absolute inset-0">
        {Array.from({ length: particleCount }, (_, i) => (
          <div
            key={`star-particle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full animate-float-particle opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${12 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Bubble effects */}
      {includeBubbles && (
        <div className="absolute inset-0">
          {Array.from({ length: bubbleCount }, (_, i) => (
            <div
              key={`bubble-${i}`}
              className="absolute rounded-full bg-gradient-to-br from-purple-400/20 via-blue-400/15 to-pink-400/20 animate-bubble-float backdrop-blur-sm border border-white/10"
              style={{
                width: `${20 + Math.random() * 40}px`,
                height: `${20 + Math.random() * 40}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Floating orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/10 via-blue-500/8 to-pink-500/10 animate-orb-float blur-xl"
            style={{
              left: `${20 + (i * 20)}%`,
              top: `${10 + (i * 25)}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-slate-900/10" />
    </div>
  );
};
