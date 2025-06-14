
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { Activity, GitCommit, Clock, TrendingUp } from 'lucide-react';

interface CodeActivityChartsProps {
  commits: any[];
}

export const CodeActivityCharts: React.FC<CodeActivityChartsProps> = ({ commits }) => {
  const activityData = useMemo(() => {
    const dailyCommits = new Map<string, number>();
    const hourlyCommits = new Map<number, number>();
    const weeklyCommits = new Map<string, number>();
    
    commits.forEach(commit => {
      const date = new Date(commit.commit.author.date);
      const dayKey = date.toISOString().split('T')[0];
      const hour = date.getHours();
      const weekKey = `Week ${Math.ceil(date.getDate() / 7)}`;
      
      dailyCommits.set(dayKey, (dailyCommits.get(dayKey) || 0) + 1);
      hourlyCommits.set(hour, (hourlyCommits.get(hour) || 0) + 1);
      weeklyCommits.set(weekKey, (weeklyCommits.get(weekKey) || 0) + 1);
    });
    
    const daily = Array.from(dailyCommits.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        commits: count
      }));
    
    const hourly = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      commits: hourlyCommits.get(hour) || 0
    }));
    
    return { daily, hourly };
  }, [commits]);

  const commitStats = useMemo(() => {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentCommits = commits.filter(commit => 
      new Date(commit.commit.author.date) >= lastWeek
    ).length;
    
    const monthlyCommits = commits.filter(commit => 
      new Date(commit.commit.author.date) >= lastMonth
    ).length;
    
    const peakHour = activityData.hourly.reduce((peak, current) => 
      current.commits > peak.commits ? current : peak
    );
    
    return {
      recentCommits,
      monthlyCommits,
      peakHour: peakHour.hour,
      averageDaily: Math.round(monthlyCommits / 30)
    };
  }, [commits, activityData]);

  const renderDailyActivity = () => (
    <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Activity className="w-5 h-5 text-blue-400" />
          <span>Daily Commit Activity</span>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            Last 30 days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Area
                type="monotone"
                dataKey="commits"
                stroke="#3B82F6"
                fill="url(#blueGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderHourlyActivity = () => (
    <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Clock className="w-5 h-5 text-green-400" />
          <span>Peak Activity Hours</span>
          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
            24h Pattern
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData.hourly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="hour" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Bar 
                dataKey="commits" 
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderActivityStats = () => (
    <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <span>Activity Statistics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{commitStats.recentCommits}</div>
              <div className="text-slate-400 text-sm">Commits This Week</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{commitStats.monthlyCommits}</div>
              <div className="text-slate-400 text-sm">Commits This Month</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{commitStats.peakHour}</div>
              <div className="text-slate-400 text-sm">Peak Activity Hour</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{commitStats.averageDaily}</div>
              <div className="text-slate-400 text-sm">Avg Daily Commits</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-600/50">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Most Active Day:</span>
              <span className="text-white font-medium">
                {activityData.daily.reduce((max, current) => 
                  current.commits > max.commits ? current : max
                ).date}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Development Streak:</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                Active Project
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderDailyActivity()}
        {renderActivityStats()}
      </div>
      {renderHourlyActivity()}
    </div>
  );
};
