
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
      {/* Enhanced gradient background with fade-in and stagger effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 animate-gradient-fade-in">
        
        {/* Layered gradient backgrounds with parallax drift */}
        <div className="absolute inset-0 opacity-40 animate-stagger-fade" style={{ animationDelay: '0.5s' }}>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/30 to-pink-500/20 animate-parallax-drift" />
        </div>
        <div className="absolute inset-0 opacity-30 animate-stagger-fade" style={{ animationDelay: '1s' }}>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-cyan-500/15 via-indigo-500/25 to-teal-500/15 animate-parallax-drift" style={{ animationDelay: '5s', animationDuration: '22s' }} />
        </div>

        {/* Starry bubble effects - floating particles */}
        <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '1s' }}>
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={`star-particle-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-float-particle opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Larger glowing orbs */}
        <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '1.2s' }}>
          {Array.from({ length: 8 }, (_, i) => (
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
                className={`w-2 h-2 rounded-full ${
                  i % 3 === 0 ? 'bg-blue-400' : 
                  i % 3 === 1 ? 'bg-purple-400' : 'bg-pink-400'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Medium floating particles */}
        <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '1.5s' }}>
          {Array.from({ length: 12 }, (_, i) => (
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
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full opacity-40" />
            </div>
          ))}
        </div>

        {/* Curved lines from bottom with fade in/out */}
        <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '1.8s' }}>
          {Array.from({ length: 4 }, (_, i) => (
            <svg
              key={`curved-line-${i}`}
              className="absolute bottom-0 w-full h-full animate-curved-float-fade"
              style={{
                animationDelay: `${i * 3}s`,
                animationDuration: `${20 + Math.random() * 10}s`
              }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d={`M${10 + i * 20},100 Q${30 + i * 15},${60 - i * 8} ${50 + i * 10},${40 - i * 5} T${90 - i * 5},${20 + i * 3}`}
                stroke={`rgba(${i % 2 === 0 ? '59, 130, 246' : '147, 51, 234'}, 0.4)`}
                strokeWidth="0.5"
                fill="none"
                className="animate-path-fade"
                style={{
                  animationDelay: `${i * 2}s`,
                  animationDuration: `${15 + Math.random() * 5}s`
                }}
              />
            </svg>
          ))}
        </div>

        {/* Additional curved paths with different curvatures */}
        <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '2s' }}>
          {Array.from({ length: 3 }, (_, i) => (
            <svg
              key={`curved-path-${i}`}
              className="absolute bottom-0 w-full h-full animate-curved-drift-fade"
              style={{
                animationDelay: `${i * 4}s`,
                animationDuration: `${25 + Math.random() * 10}s`
              }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d={`M${5 + i * 30},100 C${20 + i * 15},${80 - i * 5} ${40 + i * 20},${50 - i * 8} ${60 + i * 25},${30 - i * 6} S${85 - i * 15},${15 + i * 4} ${95 - i * 10},${10 + i * 2}`}
                stroke={`rgba(${i % 3 === 0 ? '34, 211, 238' : i % 3 === 1 ? '168, 85, 247' : '236, 72, 153'}, 0.3)`}
                strokeWidth="0.8"
                fill="none"
                className="animate-path-glow-fade"
                style={{
                  animationDelay: `${i * 3}s`,
                  animationDuration: `${18 + Math.random() * 7}s`
                }}
              />
            </svg>
          ))}
        </div>

        {/* Floating curved elements */}
        <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '2.2s' }}>
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={`curved-element-${i}`}
              className="absolute animate-curved-float"
              style={{
                left: `${25 + Math.random() * 50}%`,
                bottom: `${15 + Math.random() * 30}%`,
                animationDelay: `${i * 2.5}s`,
                animationDuration: `${20 + Math.random() * 10}s`
              }}
            >
              <svg width="50" height="30" viewBox="0 0 50 30">
                <path
                  d="M5,25 Q25,5 45,25"
                  stroke={`rgba(${i % 2 === 0 ? '59, 130, 246' : '147, 51, 234'}, 0.5)`}
                  strokeWidth="1"
                  fill="none"
                  className="animate-path-pulse-fade"
                  style={{
                    animationDelay: `${i * 2}s`,
                    animationDuration: `${12 + Math.random() * 6}s`
                  }}
                />
              </svg>
            </div>
          ))}
        </div>

        {/* Depth layers with improved gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/40 animate-gradient-fade-in" style={{ animationDelay: '0.3s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/15 to-transparent animate-gradient-fade-in" style={{ animationDelay: '0.6s' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent to-slate-900/40 animate-gradient-fade-in" style={{ animationDelay: '0.9s' }} />
      </div>
      
      {/* Main content with staggered fade-in */}
      <div className="container mx-auto px-6 text-center relative z-10 animate-stagger-fade" style={{ animationDelay: '1.2s' }}>
        {/* Main Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8 text-white drop-shadow-2xl">
            Turn your code into live
            <br />
            <span className="text-white bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">visualizations</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mb-16 animate-stagger-fade" style={{ animationDelay: '1.5s' }}>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            Visualize, understand, and edit GitHub repositories instantly.
          </p>
        </div>

        {/* GitHub Input Section */}
        <div className="mb-8 max-w-3xl mx-auto animate-stagger-fade" style={{ animationDelay: '1.8s' }}>
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
        <div className="text-slate-400 text-sm animate-stagger-fade" style={{ animationDelay: '2.1s' }}>
          Free to use • No registration required • Works with public repositories
        </div>
      </div>
    </div>
  );
};
