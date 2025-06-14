
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { 
  Users, 
  GitCommit, 
  Award,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface ContributorAnalyticsProps {
  contributors: any[];
  commits: any[];
}

export const ContributorAnalytics: React.FC<ContributorAnalyticsProps> = ({
  contributors,
  commits
}) => {
  const getContributorCommits = (contributorLogin: string) => {
    return commits.filter(commit => commit.author?.login === contributorLogin).length;
  };

  const topContributors = contributors
    .map(contributor => ({
      ...contributor,
      commitCount: getContributorCommits(contributor.login)
    }))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 10);

  const renderContributorLeaderboard = () => (
    <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Award className="w-5 h-5 text-yellow-400" />
          <span>Top Contributors</span>
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
            Leaderboard
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topContributors.map((contributor, index) => (
            <div 
              key={contributor.login}
              className="flex items-center space-x-4 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-600/30 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                {index + 1}
              </div>
              
              <div className="w-10 h-10 rounded-full bg-slate-600 overflow-hidden">
                {contributor.avatar_url && (
                  <img 
                    src={contributor.avatar_url} 
                    alt={contributor.login}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{contributor.login}</h4>
                <p className="text-slate-400 text-sm">{contributor.contributions} contributions</p>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-blue-400">
                  {contributor.commitCount}
                </div>
                <div className="text-slate-400 text-xs">commits</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderTeamOverview = () => (
    <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Users className="w-5 h-5 text-blue-400" />
          <span>Team Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{contributors.length}</div>
              <div className="text-slate-400 text-sm">Total Contributors</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {contributors.reduce((sum, c) => sum + c.contributions, 0)}
              </div>
              <div className="text-slate-400 text-sm">Total Contributions</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {Math.round(contributors.reduce((sum, c) => sum + c.contributions, 0) / contributors.length)}
              </div>
              <div className="text-slate-400 text-sm">Avg per Contributor</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">
                {contributors.length > 0 ? Math.round((topContributors[0]?.contributions || 0) / contributors.reduce((sum, c) => sum + c.contributions, 0) * 100) : 0}%
              </div>
              <div className="text-slate-400 text-sm">Top Contributor Share</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-600/50">
          <h4 className="text-white font-medium mb-3">Contributor Distribution</h4>
          <div className="space-y-2">
            {topContributors.slice(0, 5).map((contributor, index) => {
              const percentage = (contributor.contributions / contributors.reduce((sum, c) => sum + c.contributions, 0)) * 100;
              return (
                <div key={contributor.login} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">{contributor.login}</span>
                    <span className="text-slate-400">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderContributorLeaderboard()}
      {renderTeamOverview()}
    </div>
  );
};
