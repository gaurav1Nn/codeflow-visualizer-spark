import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, ArrowRight } from 'lucide-react';
interface ProfessionalHeroProps {
  onAnalyzeRepo?: (repoUrl: string) => void;
}
export const ProfessionalHero: React.FC<ProfessionalHeroProps> = ({
  onAnalyzeRepo
}) => {
  const [repoUrl, setRepoUrl] = useState('');
  const handleAnalyzeClick = () => {
    if (repoUrl.trim() && onAnalyzeRepo) {
      onAnalyzeRepo(repoUrl);
      // Scroll to the analysis section
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
  return <div className="relative py-32 md:py-40 overflow-hidden">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900">
        {/* Subtle curved accent lines */}
        <div className="absolute inset-0">
          <svg className="absolute top-20 right-20 w-96 h-96 opacity-20" viewBox="0 0 400 400">
            <path d="M50,200 Q200,50 350,200 Q200,350 50,200" stroke="url(#gradient1)" strokeWidth="2" fill="none" />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
          
          <svg className="absolute bottom-20 left-20 w-80 h-80 opacity-15" viewBox="0 0 320 320">
            <path d="M40,160 Q160,40 280,160 Q160,280 40,160" stroke="url(#gradient2)" strokeWidth="2" fill="none" />
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EC4899" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/30" />
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Main Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-medium leading-tight mb-8 text-black drop-shadow-4xl font-serif tracking-tight ">
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
              <input type="text" placeholder="Paste your GitHub repo link here" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} onKeyPress={handleKeyPress} className="flex-1 bg-transparent text-white placeholder-slate-400 text-lg outline-none w-full" />
            </div>
            
            <Button size="lg" onClick={handleAnalyzeClick} disabled={!repoUrl.trim()} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-slate-400 text-sm">
          Free to use • No registration required • Works with public repositories
        </div>
      </div>
    </div>;
};