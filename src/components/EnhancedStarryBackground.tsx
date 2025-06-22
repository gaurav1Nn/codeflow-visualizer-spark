
import React from 'react';
import { EnhancedParticleSystem } from './EnhancedParticleSystem';

interface EnhancedStarryBackgroundProps {
  density?: 'light' | 'medium' | 'heavy';
  className?: string;
  includeBubbles?: boolean;
  includeStars?: boolean;
  includeParticles?: boolean;
  interactive?: boolean;
}

export const EnhancedStarryBackground: React.FC<EnhancedStarryBackgroundProps> = ({ 
  density = 'medium',
  className = '',
  includeBubbles = true,
  includeStars = true,
  includeParticles = true,
  interactive = true
}) => {
  const particleCount = density === 'light' ? 15 : density === 'medium' ? 25 : 40;
  const bubbleCount = includeBubbles ? (density === 'light' ? 8 : density === 'medium' ? 12 : 18) : 0;
  const starCount = includeStars ? (density === 'light' ? 40 : density === 'medium' ? 70 : 100) : 0;

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {/* Enhanced Interactive Particle System */}
      {includeParticles && (
        <EnhancedParticleSystem 
          density={density} 
          interactive={interactive}
          colors={['#8b5cf6', '#3b82f6', '#ec4899', '#06b6d4', '#10b981']}
        />
      )}

      {/* Enhanced Starry particles */}
      {includeStars && (
        <div className="absolute inset-0">
          {Array.from({ length: starCount }, (_, i) => (
            <div
              key={`star-${i}`}
              className="absolute bg-white rounded-full animate-enhanced-float shadow-lg hover-glow"
              style={{
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${6 + Math.random() * 8}s`,
                opacity: 0.4 + Math.random() * 0.6,
                boxShadow: `0 0 ${2 + Math.random() * 4}px rgba(255, 255, 255, 0.8)`
              }}
            />
          ))}
        </div>
      )}

      {/* Twinkling stars with enhanced effects */}
      {includeStars && (
        <div className="absolute inset-0">
          {Array.from({ length: Math.floor(starCount / 2) }, (_, i) => (
            <div
              key={`twinkle-${i}`}
              className="absolute bg-white rounded-full animate-icon-pulse"
              style={{
                width: `${2 + Math.random() * 2}px`,
                height: `${2 + Math.random() * 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                boxShadow: `0 0 6px rgba(255, 255, 255, 0.9)`
              }}
            />
          ))}
        </div>
      )}

      {/* Enhanced bubble effects */}
      {includeBubbles && (
        <div className="absolute inset-0">
          {Array.from({ length: bubbleCount }, (_, i) => (
            <div
              key={`bubble-${i}`}
              className="absolute rounded-full glass-card animate-spiral-float"
              style={{
                width: `${25 + Math.random() * 45}px`,
                height: `${25 + Math.random() * 45}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${18 + Math.random() * 12}s`,
                background: `radial-gradient(circle at 30% 30%, 
                  rgba(139, 92, 246, 0.2), 
                  rgba(59, 130, 246, 0.15), 
                  rgba(236, 72, 153, 0.1)
                )`
              }}
            />
          ))}
        </div>
      )}

      {/* Enhanced floating orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full animate-enhanced-float blur-xl"
            style={{
              width: `${80 + Math.random() * 120}px`,
              height: `${80 + Math.random() * 120}px`,
              left: `${10 + (i * 12)}%`,
              top: `${5 + (i * 15)}%`,
              animationDelay: `${i * 4}s`,
              animationDuration: `${25 + Math.random() * 15}s`,
              background: `radial-gradient(circle, 
                rgba(139, 92, 246, 0.1) 0%, 
                rgba(59, 130, 246, 0.08) 40%, 
                rgba(236, 72, 153, 0.06) 80%, 
                transparent 100%
              )`
            }}
          />
        ))}
      </div>

      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-slate-900/20" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />
      
      {/* Subtle animated mesh gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)
          `
        }}
      />
    </div>
  );
};
