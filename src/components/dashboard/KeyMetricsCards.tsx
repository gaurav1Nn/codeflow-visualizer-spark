
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  GitFork, 
  Users, 
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  Shield
} from 'lucide-react';

interface KeyMetricsCardsProps {
  repository: any;
  commits: any[];
  contributors: any[];
  branches: any[];
}

export const KeyMetricsCards: React.FC<KeyMetricsCardsProps> = ({
  repository,
  commits,
  contributors,
  branches
}) => {
  const calculateHealthScore = () => {
    let score = 0;
    
    // Recent activity (40 points)
    const lastCommit = new Date(commits[0]?.commit?.author?.date || 0);
    const daysSinceLastCommit = (Date.now() - lastCommit.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastCommit < 7) score += 40;
    else if (daysSinceLastCommit < 30) score += 25;
    else if (daysSinceLastCommit < 90) score += 10;
    
    // Contributors (30 points)
    if (contributors.length >= 10) score += 30;
    else if (contributors.length >= 5) score += 20;
    else if (contributors.length >= 2) score += 10;
    
    // Stars and engagement (30 points)
    if (repository.stargazers_count >= 100) score += 30;
    else if (repository.stargazers_count >= 50) score += 20;
    else if (repository.stargazers_count >= 10) score += 10;
    
    return Math.min(score, 100);
  };

  const healthScore = calculateHealthScore();
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const lastActivity = commits[0]?.commit?.author?.date 
    ? new Date(commits[0].commit.author.date).toLocaleDateString()
    : 'Unknown';

  const metrics = [
    {
      title: 'Repository Health',
      value: `${healthScore}%`,
      icon: Shield,
      color: getHealthColor(healthScore),
      description: 'Overall project health',
      progress: healthScore
    },
    {
      title: 'Stars',
      value: repository.stargazers_count?.toLocaleString() || '0',
      icon: Star,
      color: 'text-yellow-400',
      description: 'Community appreciation',
      change: '+12% this month'
    },
    {
      title: 'Contributors',
      value: contributors.length.toString(),
      icon: Users,
      color: 'text-blue-400',
      description: 'Active developers',
      change: `${contributors.length > 1 ? 'Collaborative' : 'Solo'} project`
    },
    {
      title: 'Forks',
      value: repository.forks_count?.toLocaleString() || '0',
      icon: GitFork,
      color: 'text-green-400',
      description: 'Community adoption',
      change: 'Derivative projects'
    },
    {
      title: 'Commit Frequency',
      value: `${Math.round(commits.length / 30)} /day`,
      icon: Activity,
      color: 'text-purple-400',
      description: 'Development pace',
      change: 'Last 30 commits avg'
    },
    {
      title: 'Last Activity',
      value: lastActivity,
      icon: Clock,
      color: 'text-orange-400',
      description: 'Recent update',
      change: 'Most recent commit'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-200 text-base font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline space-x-2">
                <span className={`text-3xl font-bold ${metric.color}`}>
                  {metric.value}
                </span>
              </div>
              
              {metric.progress !== undefined && (
                <div className="space-y-2">
                  <Progress value={metric.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-1">
                <p className="text-slate-400 text-sm">{metric.description}</p>
                {metric.change && (
                  <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 text-xs">
                    {metric.change}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
