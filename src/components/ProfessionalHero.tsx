
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
      {/* Dynamic animated lines background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        {/* Moving diagonal lines */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={`moving-${i}`}
              className="absolute h-full w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent animate-diagonal-move opacity-60"
              style={{
                left: `${i * 15}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: '8s'
              }}
            />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={`moving-reverse-${i}`}
              className="absolute h-full w-px bg-gradient-to-b from-transparent via-purple-500/40 to-transparent animate-diagonal-move-reverse opacity-50"
              style={{
                left: `${i * 20 + 10}%`,
                animationDelay: `${i * 1.2}s`,
                animationDuration: '10s'
              }}
            />
          ))}
        </div>

        {/* Static accent lines */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={`static-${i}`}
              className="absolute h-full w-px bg-gradient-to-b from-transparent via-slate-600/50 to-transparent transform rotate-12"
              style={{
                left: `${i * 10}%`,
              }}
            />
          ))}
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-blue-400/60 rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-grid-sweep" />
        </div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Main Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8 text-white">
            Turn your code into live
            <br />
            <span className="text-white">visualizations</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mb-16">
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Visualize, understand, and edit GitHub repositories instantly.
          </p>
        </div>

        {/* GitHub Input Section */}
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
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
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
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
