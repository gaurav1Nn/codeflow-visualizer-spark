import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Github,
  ArrowRight
} from 'lucide-react';

interface ProfessionalHeroProps {
  onAnalyzeRepo?: (repoUrl: string) => void;
}

export const ProfessionalHero: React.FC<ProfessionalHeroProps> = ({ onAnalyzeRepo }) => {
  const [repoUrl, setRepoUrl] = useState('');

  const handleAnalyzeClick = () => {
    if (repoUrl.trim() && onAnalyzeRepo) {
      onAnalyzeRepo(repoUrl);
      // Scroll to the analysis section
      const analysisSection = document.getElementById('github-analysis');
      if (analysisSection) {
        analysisSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyzeClick();
    }
  };

  return (
    <div className="relative py-32 md:py-40 overflow-hidden">
      {/* Optimized gradient background with slower fade-in */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 animate-gradient-fade-in">
        
        {/* Layered gradient backgrounds with extended delays */}
        <div className="absolute inset-0 opacity-30 animate-stagger-fade" style={{ animationDelay: '1s' }}>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/15 via-purple-500/20 to-pink-500/15 animate-parallax-drift" />
        </div>
        <div className="absolute inset-0 opacity-20 animate-stagger-fade" style={{ animationDelay: '1.5s' }}>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-cyan-500/10 via-indigo-500/15 to-teal-500/10 animate-parallax-drift" style={{ animationDelay: '8s', animationDuration: '25s' }} />
        </div>

        {/* Reduced hero starry effects with longer delays */}
        <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '2s' }}>
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={`hero-star-particle-${i}`}
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-float-particle opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${2 + (i * 0.8)}s`,
                animationDuration: `${12 + Math.random() * 6}s`
              }}
            />
          ))}
        </div>

        {/* Reduced glowing orbs with extended delays */}
        <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '3s' }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={`hero-glow-orb-${i}`}
              className="absolute animate-orb-glow"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${3 + (i * 2.5)}s`,
                animationDuration: `${15 + Math.random() * 8}s`
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

        {/* Reduced medium particles with longer delays */}
        <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '4s' }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={`hero-medium-particle-${i}`}
              className="absolute animate-large-particle-drift"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${4 + (i * 3)}s`,
                animationDuration: `${18 + Math.random() * 10}s`
              }}
            >
              <div className="w-1 h-1 bg-slate-300 rounded-full opacity-30" />
            </div>
          ))}
        </div>

        {/* Curved paths - starting later with longer intervals */}
        <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '12s' }}>
          {Array.from({ length: 2 }, (_, i) => (
            <svg
              key={`curved-path-${i}`}
              className="absolute bottom-0 w-full h-full animate-curved-drift-fade"
              style={{
                animationDelay: `${12 + (i * 6)}s`,
                animationDuration: `${30 + Math.random() * 12}s`
              }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d={`M${5 + i * 35},100 C${20 + i * 18},${85 - i * 6} ${40 + i * 20},${55 - i * 8} ${60 + i * 25},${35 - i * 6} S${85 - i * 15},${20 + i * 4} ${95 - i * 10},${15 + i * 3}`}
                stroke={`rgba(${i % 2 === 0 ? '34, 211, 238' : '168, 85, 247'}, 0.25)`}
                strokeWidth="0.8"
                fill="none"
                className="animate-path-glow-fade"
                style={{
                  animationDelay: `${12 + (i * 6)}s`,
                  animationDuration: `${22 + Math.random() * 10}s`
                }}
              />
            </svg>
          ))}
        </div>

        {/* Floating curved elements - appearing much later */}
        <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '18s' }}>
          {Array.from({ length: 2 }, (_, i) => (
            <div
              key={`curved-element-${i}`}
              className="absolute animate-curved-float"
              style={{
                left: `${25 + Math.random() * 50}%`,
                bottom: `${15 + Math.random() * 30}%`,
                animationDelay: `${18 + (i * 8)}s`,
                animationDuration: `${25 + Math.random() * 12}s`
              }}
            >
              <svg width="40" height="25" viewBox="0 0 40 25">
                <path
                  d="M5,20 Q20,5 35,20"
                  stroke={`rgba(${i % 2 === 0 ? '59, 130, 246' : '147, 51, 234'}, 0.4)`}
                  strokeWidth="1"
                  fill="none"
                  className="animate-path-pulse-fade"
                  style={{
                    animationDelay: `${18 + (i * 8)}s`,
                    animationDuration: `${15 + Math.random() * 8}s`
                  }}
                />
              </svg>
            </div>
          ))}
        </div>

        {/* Optimized depth layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/30 animate-gradient-fade-in" style={{ animationDelay: '0.5s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent animate-gradient-fade-in" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Main content with optimized delay */}
      <div className="container mx-auto px-6 text-center relative z-10 animate-stagger-fade" style={{ animationDelay: '0.8s' }}>
        {/* Main Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8 text-white drop-shadow-2xl">
            Turn your code into live
            <br />
            <span className="text-white bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">visualizations</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mb-16 animate-stagger-fade" style={{ animationDelay: '1.2s' }}>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            Visualize, understand, and edit GitHub repositories instantly.
          </p>
        </div>

        {/* GitHub Input Section */}
        <div className="mb-8 max-w-3xl mx-auto animate-stagger-fade" style={{ animationDelay: '1.6s' }}>
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
            <div className="flex items-center flex-1 w-full">
              <Github className="w-6 h-6 text-slate-400 mr-4 flex-shrink-0" />
              <input
                type="text"
                placeholder="Paste your GitHub repo link here"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent text-white placeholder-slate-400 text-lg outline-none w-full"
              />
            </div>
            
            <Button 
              size="lg"
              onClick={handleAnalyzeClick}
              disabled={!repoUrl.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-slate-400 text-sm animate-stagger-fade" style={{ animationDelay: '2s' }}>
          Free to use • No registration required • Works with public repositories
        </div>
      </div>
    </div>
  );
};
