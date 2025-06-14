
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KeyMetricsCards } from '@/components/dashboard/KeyMetricsCards';
import { ContributorAnalytics } from '@/components/dashboard/ContributorAnalytics';
import { CodeActivityCharts } from '@/components/dashboard/CodeActivityCharts';
import { LanguageDistribution } from '@/components/dashboard/LanguageDistribution';
import { FileTreeMap } from '@/components/dashboard/FileTreeMap';
import { 
  GitBranch, 
  Users, 
  Activity, 
  Code2, 
  FileText,
  BarChart3,
  Download,
  RefreshCw
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const renderDashboardHeader = () => (
    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{repository.name}</h1>
          <p className="text-slate-300">{repository.description}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="border-blue-400/50 text-blue-300">
            {repository.language}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{repository.stargazers_count}</div>
          <div className="text-slate-400 text-sm">Stars</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{repository.forks_count}</div>
          <div className="text-slate-400 text-sm">Forks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{contributors.length}</div>
          <div className="text-slate-400 text-sm">Contributors</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">{commits.length}</div>
          <div className="text-slate-400 text-sm">Commits</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderDashboardHeader()}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border-slate-700/50">
          <TabsTrigger 
            value="overview" 
            className="flex items-center space-x-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="structure" 
            className="flex items-center space-x-2 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300"
          >
            <FileText className="w-4 h-4" />
            <span>Structure</span>
          </TabsTrigger>
          <TabsTrigger 
            value="contributors" 
            className="flex items-center space-x-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
          >
            <Users className="w-4 h-4" />
            <span>Team</span>
          </TabsTrigger>
          <TabsTrigger 
            value="activity" 
            className="flex items-center space-x-2 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300"
          >
            <Activity className="w-4 h-4" />
            <span>Activity</span>
          </TabsTrigger>
          <TabsTrigger 
            value="languages" 
            className="flex items-center space-x-2 data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300"
          >
            <Code2 className="w-4 h-4" />
            <span>Tech Stack</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <KeyMetricsCards 
            repository={repository}
            commits={commits}
            contributors={contributors}
            branches={branches}
          />
        </TabsContent>

        <TabsContent value="structure" className="space-y-6">
          <FileTreeMap repository={repository} />
        </TabsContent>

        <TabsContent value="contributors" className="space-y-6">
          <ContributorAnalytics 
            contributors={contributors}
            commits={commits}
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <CodeActivityCharts commits={commits} />
        </TabsContent>

        <TabsContent value="languages" className="space-y-6">
          <LanguageDistribution 
            repository={repository}
            commits={commits}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
