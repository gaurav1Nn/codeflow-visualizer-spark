
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { GitBranch, GitCommit, Users, FileText, TrendingUp, Download } from 'lucide-react';

interface Commit {
  id: string;
  message: string;
  author: string;
  date: string;
  changes: { additions: number; deletions: number };
}

interface Repository {
  name: string;
  commits: Commit[];
  branches: string[];
  stats: {
    totalCommits: number;
    contributors: number;
    filesChanged: number;
    linesAdded: number;
  };
}

export const GitHubIntegration = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [repository, setRepository] = useState<Repository | null>(null);
  const [timelinePosition, setTimelinePosition] = useState([0]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['main']);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Mock repository data
  const mockRepo: Repository = {
    name: 'awesome-project',
    commits: [
      { id: '1', message: 'Initial commit', author: 'John Doe', date: '2024-01-01', changes: { additions: 100, deletions: 0 } },
      { id: '2', message: 'Add authentication system', author: 'Jane Smith', date: '2024-01-05', changes: { additions: 250, deletions: 10 } },
      { id: '3', message: 'Implement user dashboard', author: 'Bob Wilson', date: '2024-01-10', changes: { additions: 180, deletions: 30 } },
      { id: '4', message: 'Add real-time features', author: 'Alice Brown', date: '2024-01-15', changes: { additions: 320, deletions: 45 } },
      { id: '5', message: 'Performance optimizations', author: 'Charlie Davis', date: '2024-01-20', changes: { additions: 85, deletions: 120 } },
    ],
    branches: ['main', 'feature/auth', 'feature/dashboard', 'hotfix/security'],
    stats: {
      totalCommits: 127,
      contributors: 8,
      filesChanged: 45,
      linesAdded: 12450
    }
  };

  useEffect(() => {
    if (repository) {
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
    }
  }, [repository]);

  const handleAnalyzeRepo = async () => {
    if (!repoUrl.trim()) return;

    setIsLoading(true);
    
    // Loading animation
    gsap.to('.analyze-btn', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    // Simulate API call
    setTimeout(() => {
      setRepository(mockRepo);
      setIsLoading(false);
      
      // Success animation
      gsap.from(containerRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
      });
    }, 2000);
  };

  const renderCommitTimeline = () => {
    const currentCommit = repository?.commits[timelinePosition[0]] || repository?.commits[0];
    
    return (
      <Card className="repo-card bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <GitCommit className="w-5 h-5 text-blue-400" />
            <span>Commit Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Slider
              value={timelinePosition}
              onValueChange={setTimelinePosition}
              max={repository?.commits.length ? repository.commits.length - 1 : 0}
              step={1}
              className="w-full"
            />
            
            {currentCommit && (
              <div className="timeline-item bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-semibold">{currentCommit.message}</h4>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                    {currentCommit.id}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  by {currentCommit.author} • {new Date(currentCommit.date).toLocaleDateString()}
                </p>
                <div className="flex space-x-4">
                  <span className="text-green-400 text-sm">+{currentCommit.changes.additions}</span>
                  <span className="text-red-400 text-sm">-{currentCommit.changes.deletions}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {repository?.commits.map((commit, index) => (
              <div
                key={commit.id}
                className={`timeline-item p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                  index === timelinePosition[0]
                    ? 'bg-blue-500/20 border-blue-400/50'
                    : 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-600/30'
                }`}
                onClick={() => setTimelinePosition([index])}
              >
                <div className="text-xs text-slate-400 mb-1">{new Date(commit.date).toLocaleDateString()}</div>
                <div className="text-sm text-white truncate">{commit.message}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRepositoryStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[
        { icon: GitCommit, label: 'Commits', value: repository?.stats.totalCommits, color: 'text-blue-400' },
        { icon: Users, label: 'Contributors', value: repository?.stats.contributors, color: 'text-green-400' },
        { icon: FileText, label: 'Files', value: repository?.stats.filesChanged, color: 'text-purple-400' },
        { icon: TrendingUp, label: 'Lines Added', value: repository?.stats.linesAdded, color: 'text-orange-400' }
      ].map((stat, index) => (
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

  const renderBranchComparison = () => (
    <Card className="repo-card bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <GitBranch className="w-5 h-5 text-purple-400" />
          <span>Branch Comparison</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repository?.branches.slice(0, 2).map((branch, index) => (
            <div key={branch} className="timeline-item space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-purple-400/50 text-purple-300">
                  {branch}
                </Badge>
                <span className="text-slate-400 text-sm">
                  {Math.floor(Math.random() * 50) + 10} commits ahead
                </span>
              </div>
              
              <div className="space-y-2">
                {repository.commits.slice(0, 3).map((commit) => (
                  <div key={`${branch}-${commit.id}`} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
                    <div className="text-sm text-white mb-1">{commit.message}</div>
                    <div className="text-xs text-slate-400">{commit.author}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div ref={containerRef} className="space-y-6">
      {/* GitHub URL Input */}
      <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">GitHub Repository Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="flex-1 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
            />
            <Button
              onClick={handleAnalyzeRepo}
              disabled={isLoading}
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
        </CardContent>
      </Card>

      {repository && (
        <div ref={timelineRef} className="space-y-6">
          {renderRepositoryStats()}
          {renderCommitTimeline()}
          {renderBranchComparison()}
          
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
