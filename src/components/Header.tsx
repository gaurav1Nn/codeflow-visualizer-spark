
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code2, Share, Download, Settings, Sparkles, GitBranch } from 'lucide-react';

export const Header = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Logo glow animation
    gsap.to(logoRef.current, {
      boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Sparkle rotation
    gsap.to(sparkleRef.current, {
      rotation: 360,
      duration: 4,
      repeat: -1,
      ease: "none"
    });
  }, []);

  return (
    <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div 
              ref={logoRef}
              className="relative p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"
            >
              <GitBranch className="w-6 h-6 text-white" />
              <div 
                ref={sparkleRef}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">GitHub Visualizer</h1>
              <p className="text-xs text-slate-400">Repository Analysis Tool</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Ready to Analyze
            </Badge>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
