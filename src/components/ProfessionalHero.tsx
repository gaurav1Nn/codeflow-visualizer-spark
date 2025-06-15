
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
      {/* Enhanced radial convergence animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        
        {/* Nebula-like flowing background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/30 to-pink-500/20 animate-nebula-flow" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-cyan-500/15 via-indigo-500/25 to-teal-500/15 animate-nebula-flow" style={{ animationDelay: '10s', animationDuration: '30s' }} />
        </div>

        {/* Reduced Glowing orbs */}
        <div className="absolute inset-0">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={`orb-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-blue-400/40 to-purple-500/40 animate-orb-glow"
              style={{
                width: `${80 + Math.random() * 100}px`,
                height: `${80 + Math.random() * 100}px`,
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Refined Radial Convergence Lines - Fewer, cleaner lines */}
        <div className="absolute inset-0">
          {/* Main convergence lines from edges - reduced to 6 per side */}
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={`top-line-${i}`}
              className="absolute w-px h-full bg-gradient-to-b from-blue-500/40 via-blue-400/20 to-transparent animate-radial-inward-top origin-top"
              style={{
                left: `${15 + (i * 12)}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${12 + Math.random() * 6}s`
              }}
            />
          ))}
          
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={`bottom-line-${i}`}
              className="absolute w-px h-full bg-gradient-to-t from-purple-500/40 via-purple-400/20 to-transparent animate-radial-inward-bottom origin-bottom"
              style={{
                left: `${15 + (i * 12)}%`,
                animationDelay: `${i * 1}s`,
                animationDuration: `${14 + Math.random() * 6}s`
              }}
            />
          ))}
          
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={`left-line-${i}`}
              className="absolute h-px w-full bg-gradient-to-r from-cyan-500/40 via-cyan-400/20 to-transparent animate-radial-inward-left origin-left"
              style={{
                top: `${20 + (i * 20)}%`,
                animationDelay: `${i * 1.2}s`,
                animationDuration: `${16 + Math.random() * 6}s`
              }}
            />
          ))}
          
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={`right-line-${i}`}
              className="absolute h-px w-full bg-gradient-to-l from-pink-500/40 via-pink-400/20 to-transparent animate-radial-inward-right origin-right"
              style={{
                top: `${20 + (i * 20)}%`,
                animationDelay: `${i * 1.4}s`,
                animationDuration: `${18 + Math.random() * 6}s`
              }}
            />
          ))}
        </div>

        {/* Corner-to-Center Convergence Lines - Reduced to 3 per corner */}
        <div className="absolute inset-0">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={`tl-line-${i}`}
              className="absolute w-px h-full bg-gradient-to-br from-blue-400/30 to-transparent animate-corner-to-center-tl transform rotate-45 origin-top-left"
              style={{
                left: `${i * 8}%`,
                top: `${i * 8}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${20 + Math.random() * 10}s`
              }}
            />
          ))}
          
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={`tr-line-${i}`}
              className="absolute w-px h-full bg-gradient-to-bl from-purple-400/30 to-transparent animate-corner-to-center-tr transform -rotate-45 origin-top-right"
              style={{
                right: `${i * 8}%`,
                top: `${i * 8}%`,
                animationDelay: `${i * 2.2}s`,
                animationDuration: `${22 + Math.random() * 10}s`
              }}
            />
          ))}
          
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={`bl-line-${i}`}
              className="absolute w-px h-full bg-gradient-to-tr from-cyan-400/30 to-transparent animate-corner-to-center-bl transform -rotate-45 origin-bottom-left"
              style={{
                left: `${i * 8}%`,
                bottom: `${i * 8}%`,
                animationDelay: `${i * 2.4}s`,
                animationDuration: `${24 + Math.random() * 10}s`
              }}
            />
          ))}
          
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={`br-line-${i}`}
              className="absolute w-px h-full bg-gradient-to-tl from-pink-400/30 to-transparent animate-corner-to-center-br transform rotate-45 origin-bottom-right"
              style={{
                right: `${i * 8}%`,
                bottom: `${i * 8}%`,
                animationDelay: `${i * 2.6}s`,
                animationDuration: `${26 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        {/* Radial Pulse Lines - Reduced to 8 lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={`pulse-line-${i}`}
              className="absolute w-px h-screen bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent animate-radial-pulse-inward"
              style={{
                transform: `rotate(${i * 45}deg)`,
                transformOrigin: 'center',
                animationDelay: `${i * 1}s`,
                animationDuration: `${15 + Math.random() * 8}s`
              }}
            />
          ))}
        </div>

        {/* Reduced floating particles */}
        <div className="absolute inset-0">
          {/* Small particles - reduced to 15 */}
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={`small-particle-${i}`}
              className="absolute w-1 h-1 bg-blue-400/50 rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${4 + Math.random() * 6}s`
              }}
            />
          ))}
          
          {/* Medium particles - reduced to 8 */}
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={`medium-particle-${i}`}
              className="absolute w-2 h-2 bg-purple-400/40 rounded-full animate-large-particle-drift"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 12}s`,
                animationDuration: `${10 + Math.random() * 8}s`
              }}
            />
          ))}
          
          {/* Large glowing particles - reduced to 4 */}
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={`large-particle-${i}`}
              className="absolute w-3 h-3 bg-gradient-to-r from-cyan-400/30 to-pink-400/30 rounded-full animate-large-particle-drift blur-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${12 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        {/* Reduced geometric shapes */}
        <div className="absolute inset-0 opacity-15">
          {/* Rotating triangles - reduced to 3 */}
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={`triangle-${i}`}
              className="absolute w-4 h-4 border border-blue-400/30 animate-geometric-rotate"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${25 + Math.random() * 15}s`
              }}
            />
          ))}
          
          {/* Rotating hexagons - reduced to 2 */}
          {Array.from({ length: 2 }, (_, i) => (
            <div
              key={`hexagon-${i}`}
              className="absolute w-6 h-6 border border-purple-400/20 animate-geometric-rotate"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${30 + Math.random() * 40}%`,
                clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
                animationDelay: `${Math.random() * 25}s`,
                animationDuration: `${30 + Math.random() * 20}s`
              }}
            />
          ))}
        </div>

        {/* Depth layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/30 via-transparent to-slate-900/30" />
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Main Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8 text-white drop-shadow-2xl">
            Turn your code into live
            <br />
            <span className="text-white bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">visualizations</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mb-16">
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            Visualize, understand, and edit GitHub repositories instantly.
          </p>
        </div>

        {/* GitHub Input Section */}
        <div className="mb-8 max-w-3xl mx-auto">
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
        <div className="text-slate-400 text-sm">
          Free to use • No registration required • Works with public repositories
        </div>
      </div>
    </div>
  );
};
