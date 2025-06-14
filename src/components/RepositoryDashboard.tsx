
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KeyMetricsCards } from '@/components/dashboard/KeyMetricsCards';
import { ContributorAnalytics } from '@/components/dashboard/ContributorAnalytics';
import { CodeActivityCharts } from '@/components/dashboard/CodeActivityCharts';
import { LanguageDistribution } from '@/components/dashboard/LanguageDistribution';
import { FileTreeMap } from '@/components/dashboard/FileTreeMap';
import { InteractiveFileExplorer } from '@/components/InteractiveFileExplorer';
import { ModernRepositoryVisualization } from '@/components/ModernRepositoryVisualization';
import { 
  GitBranch, 
  Users, 
  Activity, 
  Code2, 
  FileText,
  BarChart3,
  Download,
  RefreshCw,
  Network,
  Sparkles,
  Star,
  GitFork
} from 'lucide-react';

interface RepositoryDashboardProps {
  repository: any;
  commits: any[];
  contributors: any[];
  branches: any[];
}

export const RepositoryDashboard: React.FC<RepositoryDashboardProps> = ({
  repository,
  commits,
  contributors,
  branches
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Enhanced entrance animations
    const tl = gsap.timeline();
    
    if (headerRef.current) {
      tl.fromTo(headerRef.current,
        { y: -50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)" }
      );
    }
    
    if (tabsRef.current) {
      tl.fromTo(tabsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      );
    }

    // Animate metrics cards
    gsap.fromTo('.metric-card',
      { y: 20, opacity: 0, scale: 0.9 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 0.6, 
        ease: "back.out(1.7)",
        stagger: 0.1,
        delay: 0.5
      }
    );
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Refresh animation
    gsap.to('.refresh-icon', {
      rotation: 360,
      duration: 1,
      ease: "power2.inOut"
    });
    
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const renderDashboardHeader = () => (
    <div 
      ref={headerRef}
      className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8 relative overflow-hidden group"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <GitBranch className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {repository.name}
              </h1>
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-slate-300 text-lg max-w-2xl">{repository.description || 'No description available'}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="border-blue-400/50 text-blue-300 px-4 py-2 text-sm">
              <Code2 className="w-4 h-4 mr-2" />
              {repository.language}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 px-4 py-2"
            >
              <RefreshCw className={`w-4 h-4 mr-2 refresh-icon ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 px-4 py-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Enhanced metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="metric-card text-center bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 hover:bg-blue-500/15 transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-6 h-6 text-blue-400 mr-2" />
              <div className="text-3xl font-bold text-blue-400">{formatNumber(repository.stargazers_count)}</div>
            </div>
            <div className="text-slate-400 font-medium">Stars</div>
          </div>
          
          <div className="metric-card text-center bg-green-500/10 rounded-xl p-4 border border-green-500/20 hover:bg-green-500/15 transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <GitFork className="w-6 h-6 text-green-400 mr-2" />
              <div className="text-3xl font-bold text-green-400">{formatNumber(repository.forks_count)}</div>
            </div>
            <div className="text-slate-400 font-medium">Forks</div>
          </div>
          
          <div className="metric-card text-center bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 hover:bg-purple-500/15 transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-purple-400 mr-2" />
              <div className="text-3xl font-bold text-purple-400">{contributors.length}</div>
            </div>
            <div className="text-slate-400 font-medium">Contributors</div>
          </div>
          
          <div className="metric-card text-center bg-orange-500/10 rounded-xl p-4 border border-orange-500/20 hover:bg-orange-500/15 transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <Activity className="w-6 h-6 text-orange-400 mr-2" />
              <div className="text-3xl font-bold text-orange-400">{formatNumber(commits.length)}</div>
            </div>
            <div className="text-slate-400 font-medium">Commits</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {renderDashboardHeader()}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div ref={tabsRef}>
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border-slate-700/50 p-1 rounded-xl">
            <TabsTrigger 
              value="overview" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 rounded-lg transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="structure" 
              className="flex items-center space-x-2 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 rounded-lg transition-all duration-300"
            >
              <FileText className="w-4 h-4" />
              <span>Structure</span>
            </TabsTrigger>
            <TabsTrigger 
              value="visualization" 
              className="flex items-center space-x-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 rounded-lg transition-all duration-300"
            >
              <Network className="w-4 h-4" />
              <span>Architecture</span>
            </TabsTrigger>
            <TabsTrigger 
              value="contributors" 
              className="flex items-center space-x-2 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300 rounded-lg transition-all duration-300"
            >
              <Users className="w-4 h-4" />
              <span>Team</span>
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="flex items-center space-x-2 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300 rounded-lg transition-all duration-300"
            >
              <Activity className="w-4 h-4" />
              <span>Activity</span>
            </TabsTrigger>
            <TabsTrigger 
              value="languages" 
              className="flex items-center space-x-2 data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300 rounded-lg transition-all duration-300"
            >
              <Code2 className="w-4 h-4" />
              <span>Tech Stack</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <KeyMetricsCards 
            repository={repository}
            commits={commits}
            contributors={contributors}
            branches={branches}
          />
        </TabsContent>

        <TabsContent value="structure" className="space-y-6 mt-6">
          <FileTreeMap repository={repository} />
        </TabsContent>

        <TabsContent value="visualization" className="space-y-6 mt-6">
          <ModernRepositoryVisualization 
            repository={repository} 
            commits={commits}
            contributors={contributors}
            branches={branches}
          />
        </TabsContent>

        <TabsContent value="contributors" className="space-y-6 mt-6">
          <ContributorAnalytics 
            contributors={contributors}
            commits={commits}
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6 mt-6">
          <CodeActivityCharts commits={commits} />
        </TabsContent>

        <TabsContent value="languages" className="space-y-6 mt-6">
          <LanguageDistribution 
            repository={repository}
            commits={commits}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
