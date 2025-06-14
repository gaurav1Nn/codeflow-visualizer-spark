
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useGitHubData } from '@/hooks/useGitHubData';
import { githubApi } from '@/services/githubApi';
import { RepositoryStructure } from '@/components/RepositoryStructure';
import { CodeArchitecture } from '@/components/CodeArchitecture';
import { 
  GitBranch, 
  GitCommit, 
  Users, 
  FileText, 
  TrendingUp, 
  Download, 
  Star,
  GitFork,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const GitHubIntegration = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [timelinePosition, setTimelinePosition] = useState([0]);
  const { data, isLoading, error, analyzeRepository, progress } = useGitHubData();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.repository) {
      // Animate repository data appearance
      gsap.from('.repo-card', {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      });

      // Animate timeline
      gsap.from('.timeline-item', {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.7)'
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

  const renderCommitTimeline = () => {
    if (!data.commits.length) return null;
    
    const currentCommit = data.commits[timelinePosition[0]];
    
    return (
      <Card className="repo-card bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <GitCommit className="w-5 h-5 text-blue-400" />
            <span>Commit Timeline</span>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
              {data.commits.length} commits
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Slider
              value={timelinePosition}
              onValueChange={setTimelinePosition}
              max={data.commits.length - 1}
              step={1}
              className="w-full"
            />
            
            {currentCommit && (
              <div className="timeline-item bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-semibold">{currentCommit.commit.message}</h4>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                    {currentCommit.sha.substring(0, 7)}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  by {currentCommit.commit.author.name} • {new Date(currentCommit.commit.author.date).toLocaleDateString()}
                </p>
                {currentCommit.stats && (
                  <div className="flex space-x-4">
                    <span className="text-green-400 text-sm">+{currentCommit.stats.additions}</span>
                    <span className="text-red-400 text-sm">-{currentCommit.stats.deletions}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.commits.slice(0, 8).map((commit, index) => (
              <div
                key={commit.sha}
                className={`timeline-item p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                  index === timelinePosition[0]
                    ? 'bg-blue-500/20 border-blue-400/50'
                    : 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-600/30'
                }`}
                onClick={() => setTimelinePosition([index])}
              >
                <div className="text-xs text-slate-400 mb-1">
                  {new Date(commit.commit.author.date).toLocaleDateString()}
                </div>
                <div className="text-sm text-white truncate">{commit.commit.message}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRepositoryStats = () => {
    if (!data.repository) return null;

    const stats = [
      { 
        icon: GitCommit, 
        label: 'Commits', 
        value: data.stats.totalCommits, 
        color: 'text-blue-400' 
      },
      { 
        icon: Users, 
        label: 'Contributors', 
        value: data.stats.totalContributors, 
        color: 'text-green-400' 
      },
      { 
        icon: GitBranch, 
        label: 'Branches', 
        value: data.stats.totalBranches, 
        color: 'text-purple-400' 
      },
      { 
        icon: TrendingUp, 
        label: 'Lines Changed', 
        value: data.stats.linesChanged, 
        color: 'text-orange-400' 
      }
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="repo-card bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value?.toLocaleString()}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderRepositoryInfo = () => {
    if (!data.repository) return null;

    return (
      <Card className="repo-card bg-slate-800/50 backdrop-blur-lg border-slate-700/50 mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{data.repository.name}</h2>
              <p className="text-slate-300 mb-4">{data.repository.description}</p>
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{data.repository.stargazers_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitFork className="w-4 h-4" />
                  <span>{data.repository.forks_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {new Date(data.repository.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            {data.repository.language && (
              <Badge variant="outline" className="border-blue-400/50 text-blue-300">
                {data.repository.language}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* GitHub URL Input */}
      <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">GitHub Repository Analyzer</CardTitle>
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

      {data.repository && (
        <div className="space-y-6">
          {renderRepositoryInfo()}
          {renderRepositoryStats()}
          {renderCommitTimeline()}
          
          {/* Export Options */}
          <Card className="repo-card bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Export Analysis Report</span>
                <Button variant="outline" className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
