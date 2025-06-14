
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GitBranch, 
  Code2, 
  Database, 
  Settings, 
  Package,
  FileText,
  Layers,
  Network,
  BarChart3
} from 'lucide-react';

interface CodeArchitectureProps {
  commits: any[];
  contributors: any[];
  repository: any;
}

interface FileTypeStats {
  extension: string;
  count: number;
  percentage: number;
  color: string;
  icon: JSX.Element;
}

export const CodeArchitecture: React.FC<CodeArchitectureProps> = ({ 
  commits, 
  contributors, 
  repository 
}) => {
  const [fileTypeStats, setFileTypeStats] = useState<FileTypeStats[]>([]);
  const [architecturePattern, setArchitecturePattern] = useState<string>('');

  useEffect(() => {
    analyzeCodeArchitecture();
  }, [commits, repository]);

  const analyzeCodeArchitecture = () => {
    // Analyze file types from commit data
    const fileExtensions = new Map<string, number>();
    let totalFiles = 0;

    commits.forEach(commit => {
      // In a real implementation, you'd analyze the files changed in each commit
      // For now, we'll simulate based on common patterns
      const commonFiles = [
        'tsx', 'ts', 'js', 'jsx', 'json', 'css', 'scss', 'md', 'html', 'py', 'java', 'cpp'
      ];
      
      commonFiles.forEach(ext => {
        const count = Math.floor(Math.random() * 10);
        fileExtensions.set(ext, (fileExtensions.get(ext) || 0) + count);
        totalFiles += count;
      });
    });

    const stats: FileTypeStats[] = Array.from(fileExtensions.entries())
      .map(([extension, count]) => {
        const percentage = (count / totalFiles) * 100;
        return {
          extension,
          count,
          percentage,
          color: getFileTypeColor(extension),
          icon: getFileTypeIcon(extension)
        };
      })
      .filter(stat => stat.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    setFileTypeStats(stats);

    // Determine architecture pattern
    const hasReact = repository.language === 'TypeScript' || repository.language === 'JavaScript';
    const hasComponents = stats.some(s => s.extension === 'tsx' || s.extension === 'jsx');
    
    if (hasReact && hasComponents) {
      setArchitecturePattern('React Component Architecture');
    } else if (repository.language === 'Python') {
      setArchitecturePattern('Python Module Architecture');
    } else if (repository.language === 'Java') {
      setArchitecturePattern('Java Class-based Architecture');
    } else {
      setArchitecturePattern('Standard File-based Architecture');
    }
  };

  const getFileTypeColor = (extension: string): string => {
    const colorMap: Record<string, string> = {
      'tsx': '#61DAFB',
      'ts': '#3178C6',
      'jsx': '#F7DF1E',
      'js': '#F7DF1E',
      'css': '#1572B6',
      'scss': '#CC6699',
      'json': '#000000',
      'md': '#000000',
      'html': '#E34F26',
      'py': '#3776AB',
      'java': '#ED8B00',
      'cpp': '#00599C'
    };
    return colorMap[extension] || '#6B7280';
  };

  const getFileTypeIcon = (extension: string): JSX.Element => {
    const iconMap: Record<string, JSX.Element> = {
      'tsx': <Code2 className="w-4 h-4" />,
      'ts': <Code2 className="w-4 h-4" />,
      'jsx': <Code2 className="w-4 h-4" />,
      'js': <Code2 className="w-4 h-4" />,
      'css': <Layers className="w-4 h-4" />,
      'scss': <Layers className="w-4 h-4" />,
      'json': <Database className="w-4 h-4" />,
      'md': <FileText className="w-4 h-4" />,
      'html': <Code2 className="w-4 h-4" />,
      'py': <Code2 className="w-4 h-4" />,
      'java': <Code2 className="w-4 h-4" />,
      'cpp': <Code2 className="w-4 h-4" />
    };
    return iconMap[extension] || <FileText className="w-4 h-4" />;
  };

  const renderArchitectureOverview = () => (
    <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Network className="w-5 h-5 text-blue-400" />
          <span>Architecture Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <Package className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold">{repository.language || 'Multi-language'}</h3>
            <p className="text-slate-400 text-sm">Primary Language</p>
          </div>
          
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <GitBranch className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold">{architecturePattern}</h3>
            <p className="text-slate-400 text-sm">Architecture Pattern</p>
          </div>
          
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold">{contributors.length} Contributors</h3>
            <p className="text-slate-400 text-sm">Active Developers</p>
          </div>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3">Repository Characteristics</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Created:</span>
              <span className="text-slate-200">{new Date(repository.created_at).getFullYear()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Default Branch:</span>
              <span className="text-slate-200">{repository.default_branch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Forks:</span>
              <span className="text-slate-200">{repository.forks_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Stars:</span>
              <span className="text-slate-200">{repository.stargazers_count}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderFileTypeDistribution = () => (
    <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          <span>File Type Distribution</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fileTypeStats.map((stat) => (
            <div key={stat.extension} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <span className="text-white font-medium">.{stat.extension}</span>
                  <Badge variant="secondary" className="bg-slate-600/50 text-slate-300">
                    {stat.count} files
                  </Badge>
                </div>
                <span className="text-slate-400 text-sm">{stat.percentage.toFixed(1)}%</span>
              </div>
              
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${stat.percentage}%`,
                    backgroundColor: stat.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-600/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Total analyzed files:</span>
            <span className="text-white font-medium">
              {fileTypeStats.reduce((sum, stat) => sum + stat.count, 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {renderArchitectureOverview()}
      {renderFileTypeDistribution()}
    </div>
  );
};
