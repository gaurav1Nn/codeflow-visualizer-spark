
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useGitHubData } from '@/hooks/useGitHubData';
import { RepositoryDashboard } from '@/components/RepositoryDashboard';
import { 
  GitBranch, 
  AlertCircle,
  Sparkles,
  Code2
} from 'lucide-react';

export const GitHubIntegration = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const { data, isLoading, error, analyzeRepository, progress } = useGitHubData();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputCardRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Enhanced entrance animation
    if (inputCardRef.current) {
      gsap.fromTo(inputCardRef.current, 
        { 
          y: 100, 
          opacity: 0, 
          scale: 0.9,
          rotationX: -15 
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          rotationX: 0,
          duration: 1.2, 
          ease: "back.out(1.7)",
          delay: 0.3
        }
      );
    }
  }, []);

  useEffect(() => {
    if (data.repository) {
      // Celebrate successful analysis with enhanced animation
      gsap.timeline()
        .to('.analyze-btn', {
          scale: 1.1,
          duration: 0.2,
          ease: "power2.out"
        })
        .to('.analyze-btn', {
          scale: 1,
          duration: 0.3,
          ease: "elastic.out(1, 0.5)"
        })
        .fromTo('.dashboard-container', {
          y: 50,
          opacity: 0,
          scale: 0.95
        }, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out'
        }, "-=0.2");

      // Sparkle effect
      gsap.to('.success-sparkle', {
        rotation: 360,
        scale: 1.2,
        duration: 2,
        ease: "power2.inOut",
        repeat: 2,
        yoyo: true
      });

      toast({
        title: "🎉 Repository Analyzed Successfully!",
        description: `${data.repository.name} has been analyzed with ${data.commits.length} commits.`,
      });
    }
  }, [data.repository, toast]);

  useEffect(() => {
    if (error) {
      // Error shake animation
      if (inputCardRef.current) {
        gsap.to(inputCardRef.current, {
          x: -10,
          duration: 0.1,
          yoyo: true,
          repeat: 3,
          ease: "power2.inOut"
        });
      }

      toast({
        title: "❌ Analysis Failed",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (isLoading && progressRef.current) {
      gsap.fromTo(progressRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [isLoading]);

  const handleAnalyzeRepo = async () => {
    // Button press animation
    gsap.to('.analyze-btn', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });

    await analyzeRepository(repoUrl);
  };

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Enhanced GitHub URL Input */}
      <Card 
        ref={inputCardRef}
        className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-slate-700/50 shadow-2xl overflow-hidden relative group hover:shadow-blue-500/10 transition-all duration-500"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center space-x-3 text-white">
            <div className="relative">
              <GitBranch className="w-6 h-6 text-blue-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold text-xl">
              GitHub Repository Analyzer
            </span>
            <Sparkles className="w-5 h-5 text-yellow-400 success-sparkle" />
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-6">
            <div className="flex space-x-4">
              <div className="relative flex-1 group">
                <Input
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="flex-1 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-12"
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleAnalyzeRepo()}
                />
                <Code2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
              </div>
              <Button
                onClick={handleAnalyzeRepo}
                disabled={isLoading || !repoUrl.trim()}
                className="analyze-btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <GitBranch className="w-4 h-4" />
                    <span>Analyze Repository</span>
                  </div>
                )}
              </Button>
            </div>
            
            {isLoading && (
              <div ref={progressRef} className="space-y-4">
                <div className="relative">
                  <Progress 
                    value={progress} 
                    className="w-full h-3 bg-slate-700/50 overflow-hidden rounded-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-slate-300 font-medium">
                    🔍 Analyzing repository structure...
                  </p>
                  <p className="text-sm text-slate-400">
                    Progress: {progress}% • Fetching commits, contributors, and file structure
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-3 text-red-400 bg-red-500/10 p-4 rounded-lg border border-red-500/20 backdrop-blur-sm animate-fade-in">
                <AlertCircle className="w-5 h-5 animate-pulse" />
                <div>
                  <p className="font-medium">Analysis Failed</p>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Repository Dashboard */}
      {data.repository && (
        <div className="dashboard-container">
          <RepositoryDashboard
            repository={data.repository}
            commits={data.commits}
            contributors={data.contributors}
            branches={data.branches}
          />
        </div>
      )}
    </div>
  );
};
