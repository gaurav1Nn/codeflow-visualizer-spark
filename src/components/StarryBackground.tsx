
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

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      {/* Minimal star particles */}
      <div className="absolute inset-0">
        {Array.from({ length: particleCount }, (_, i) => (
          <div
            key={`star-particle-${i}`}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-float-particle opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};
