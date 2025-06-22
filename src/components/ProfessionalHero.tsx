
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, ArrowRight, Sparkles } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ProfessionalHeroProps {
  onAnalyzeRepo?: (repoUrl: string) => void;
}

export const ProfessionalHero: React.FC<ProfessionalHeroProps> = ({
  onAnalyzeRepo
}) => {
  const [repoUrl, setRepoUrl] = useState('');
  const titleRef = useScrollReveal({ direction: 'up', delay: 0.2 });
  const subtitleRef = useScrollReveal({ direction: 'up', delay: 0.4 });
  const inputRef = useScrollReveal({ direction: 'up', delay: 0.6 });

  const handleAnalyzeClick = () => {
    if (repoUrl.trim() && onAnalyzeRepo) {
      onAnalyzeRepo(repoUrl);
      const analysisSection = document.getElementById('github-analysis');
      if (analysisSection) {
        analysisSection.scrollIntoView({
          behavior: 'smooth'
        });
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
      {/* Enhanced gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900" />
        
        {/* Enhanced curved accent lines */}
        <div className="absolute inset-0">
          <svg className="absolute top-20 right-20 w-96 h-96 opacity-20 animate-enhanced-float" viewBox="0 0 400 400">
            <path 
              d="M50,200 Q200,50 350,200 Q200,350 50,200" 
              stroke="url(#gradient1)" 
              strokeWidth="2" 
              fill="none"
              className="animate-gradient-glow"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
          
          <svg className="absolute bottom-20 left-20 w-80 h-80 opacity-15 animate-spiral-float" viewBox="0 0 320 320">
            <path 
              d="M40,160 Q160,40 280,160 Q160,280 40,160" 
              stroke="url(#gradient2)" 
              strokeWidth="2" 
              fill="none"
              className="animate-pulse-glow"
            />
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EC4899" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Enhanced overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/40" />
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Enhanced Main Title */}
        <div ref={titleRef} className="mb-12">
          <h1 className="text-hero font-medium leading-tight mb-8 text-white text-shadow font-serif tracking-tight">
            Turn your code into live
            <br />
            <span className="gradient-text animate-text-shimmer">visualizations</span>
          </h1>
        </div>

        {/* Enhanced Subtitle */}
        <div ref={subtitleRef} className="mb-16">
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed text-shadow">
            Visualize, understand, and edit GitHub repositories instantly.
            <br />
            <span className="text-purple-300">Now with AI-powered code analysis.</span>
          </p>
        </div>

        {/* Enhanced GitHub Input Section */}
        <div ref={inputRef} className="mb-8 max-w-3xl mx-auto">
          <div className="glass-card-intense rounded-2xl p-6 hover-lift">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center flex-1 w-full">
                <Github className="w-6 h-6 text-slate-400 mr-4 flex-shrink-0 animate-icon-pulse" />
                <input 
                  type="text" 
                  placeholder="Paste your GitHub repo link here" 
                  value={repoUrl} 
                  onChange={e => setRepoUrl(e.target.value)} 
                  onKeyPress={handleKeyPress} 
                  className="flex-1 bg-transparent text-white placeholder-slate-400 text-lg outline-none w-full focus:placeholder-slate-500 transition-colors"
                />
              </div>
              
              <Button 
                size="lg" 
                onClick={handleAnalyzeClick} 
                disabled={!repoUrl.trim()} 
                className="btn-magic px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover-lift disabled:opacity-50 shadow-lg group"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Additional Info */}
        <div className="text-slate-400 text-sm flex items-center justify-center space-x-4">
          <span>Free to use</span>
          <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
          <span>No registration required</span>
          <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>AI-powered insights</span>
          </span>
        </div>
      </div>
    </div>
  );
};
