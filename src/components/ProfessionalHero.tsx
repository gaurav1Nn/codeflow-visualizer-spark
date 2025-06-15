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

        {/* Floating orbs with slower drift */}
        <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '1.5s' }}>
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={`floating-orb-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-blue-400/30 to-purple-500/30 animate-float-lines"
              style={{
                width: `${60 + Math.random() * 80}px`,
                height: `${60 + Math.random() * 80}px`,
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 3}s`,
                animationDuration: `${18 + Math.random() * 8}s`
              }}
            />
          ))}
        </div>

        {/* Slow drifting lines - horizontal */}
        <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '2s' }}>
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={`drift-line-${i}`}
              className="absolute h-px w-full bg-gradient-to-r from-transparent via-blue-400/40 to-transparent animate-drift-left"
              style={{
                top: `${20 + (i * 20)}%`,
                animationDelay: `${i * 6}s`,
                animationDuration: `${25 + Math.random() * 10}s`
              }}
            />
          ))}
          
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={`drift-line-reverse-${i}`}
              className="absolute h-px w-full bg-gradient-to-l from-transparent via-purple-400/40 to-transparent animate-drift-right"
              style={{
                top: `${30 + (i * 25)}%`,
                animationDelay: `${i * 8}s`,
                animationDuration: `${30 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        {/* Vertical floating lines */}
        <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '2.5s' }}>
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={`vertical-float-${i}`}
              className="absolute w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-float-lines"
              style={{
                left: `${25 + (i * 25)}%`,
                animationDelay: `${i * 4}s`,
                animationDuration: `${20 + Math.random() * 8}s`
              }}
            />
          ))}
        </div>

        {/* Reduced floating particles with drift */}
        <div className="absolute inset-0 animate-stagger-fade" style={{ animationDelay: '3s' }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={`drift-particle-${i}`}
              className="absolute w-2 h-2 bg-blue-400/40 rounded-full animate-float-lines"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
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
