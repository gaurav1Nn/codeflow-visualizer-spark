
import React from 'react';

interface StarryBackgroundProps {
  density?: 'light' | 'medium' | 'heavy';
  className?: string;
  includeBubbles?: boolean;
  includeStars?: boolean;
}

export const StarryBackground: React.FC<StarryBackgroundProps> = ({ 
  density = 'medium',
  className = '',
  includeBubbles = true,
  includeStars = true
}) => {
  const particleCount = density === 'light' ? 15 : density === 'medium' ? 25 : 40;
  const bubbleCount = includeBubbles ? (density === 'light' ? 8 : density === 'medium' ? 12 : 18) : 0;
  const starCount = includeStars ? (density === 'light' ? 20 : density === 'medium' ? 35 : 50) : 0;

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {/* Starry particles */}
      {includeStars && (
        <div className="absolute inset-0">
          {Array.from({ length: starCount }, (_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-float-particle opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${8 + Math.random() * 6}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: particleCount }, (_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full animate-curved-float-fade"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${15 + Math.random() * 10}s`
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
                width: `${25 + Math.random() * 45}px`,
                height: `${25 + Math.random() * 45}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${18 + Math.random() * 12}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Floating orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/10 via-blue-500/8 to-pink-500/10 animate-orb-float blur-xl"
            style={{
              left: `${15 + (i * 15)}%`,
              top: `${10 + (i * 20)}%`,
              animationDelay: `${i * 4}s`,
              animationDuration: `${25 + Math.random() * 15}s`
            }}
          />
        ))}
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-slate-900/10" />
    </div>
  );
};
