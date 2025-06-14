
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
  AlertCircle
} from 'lucide-react';

export const GitHubIntegration = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const { data, isLoading, error, analyzeRepository, progress } = useGitHubData();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.repository) {
      gsap.from('.dashboard-container', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      toast({
        title: "Repository Analyzed Successfully!",
        description: `${data.repository.name} has been analyzed with ${data.commits.length} commits.`,
      });
    }
  }, [data.repository, toast]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Analysis Failed",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleAnalyzeRepo = async () => {
    await analyzeRepository(repoUrl);
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* GitHub URL Input */}
      <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <GitBranch className="w-5 h-5 text-blue-400" />
            <span>GitHub Repository Analyzer</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Input
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="flex-1 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleAnalyzeRepo()}
              />
              <Button
                onClick={handleAnalyzeRepo}
                disabled={isLoading || !repoUrl.trim()}
                className="analyze-btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  'Analyze Repository'
                )}
              </Button>
            </div>
            
            {isLoading && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-slate-400 text-center">
                  Fetching repository data... {progress}%
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Repository Dashboard */}
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
