
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Code2, Layers, Package, TrendingUp } from 'lucide-react';

interface LanguageDistributionProps {
  repository: any;
  commits: any[];
}

export const LanguageDistribution: React.FC<LanguageDistributionProps> = ({
  repository,
  commits
}) => {
  const languageData = useMemo(() => {
    // Simulate language distribution based on repository language and common patterns
    const primaryLanguage = repository.language || 'JavaScript';
    
    const languageMap: Record<string, { colors: string[], related: string[] }> = {
      'JavaScript': {
        colors: ['#F7DF1E', '#61DAFB', '#47848F', '#326CE5'],
        related: ['HTML', 'CSS', 'TypeScript']
      },
      'TypeScript': {
        colors: ['#3178C6', '#F7DF1E', '#61DAFB', '#47848F'],
        related: ['JavaScript', 'HTML', 'CSS']
      },
      'Python': {
        colors: ['#3776AB', '#FFD43B', '#306998', '#4B8BBE'],
        related: ['HTML', 'CSS', 'SQL']
      },
      'Java': {
        colors: ['#ED8B00', '#5382A1', '#F89820', '#4C7A99'],
        related: ['XML', 'Properties', 'Gradle']
      },
      'C++': {
        colors: ['#00599C', '#004482', '#0086D2', '#659AD2'],
        related: ['CMake', 'Makefile', 'C']
      }
    };

    const config = languageMap[primaryLanguage] || languageMap['JavaScript'];
    const languages = [primaryLanguage, ...config.related];
    
    // Generate realistic distribution
    const data = languages.map((lang, index) => {
      let percentage;
      if (index === 0) percentage = 45 + Math.random() * 25; // Primary: 45-70%
      else if (index === 1) percentage = 15 + Math.random() * 15; // Secondary: 15-30%
      else percentage = 5 + Math.random() * 10; // Others: 5-15%
      
      return {
        name: lang,
        value: Math.round(percentage),
        color: config.colors[index] || '#6B7280',
        files: Math.floor(Math.random() * 50) + 10
      };
    });

    // Normalize to 100%
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return data.map(item => ({
      ...item,
      value: Math.round((item.value / total) * 100)
    }));
  }, [repository.language]);

  const techStack = useMemo(() => {
    // Simulate tech stack based on language
    const stacks: Record<string, string[]> = {
      'JavaScript': ['React', 'Node.js', 'Express', 'Webpack', 'ESLint'],
      'TypeScript': ['React', 'Node.js', 'Express', 'Vite', 'ESLint'],
      'Python': ['Django', 'Flask', 'NumPy', 'Pandas', 'PyTest'],
      'Java': ['Spring', 'Maven', 'JUnit', 'Hibernate', 'Gradle'],
      'C++': ['CMake', 'GTest', 'Boost', 'Qt', 'OpenCV']
    };

    return stacks[repository.language] || stacks['JavaScript'];
  }, [repository.language]);

  const renderLanguagePieChart = () => (
    <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Code2 className="w-5 h-5 text-blue-400" />
          <span>Language Distribution</span>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            Code Analysis
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {languageData.map((lang, index) => (
              <div key={lang.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="text-white font-medium">{lang.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-slate-200">{lang.value}%</div>
                  <div className="text-slate-400 text-xs">{lang.files} files</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTechStack = () => (
    <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Package className="w-5 h-5 text-green-400" />
          <span>Technology Stack</span>
          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
            Dependencies
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {techStack.map((tech, index) => (
              <div 
                key={tech}
                className="bg-slate-700/30 rounded-lg p-3 text-center hover:bg-slate-600/30 transition-colors"
              >
                <div className="text-white font-medium">{tech}</div>
                <div className="text-slate-400 text-xs">Framework</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-600/50">
            <h4 className="text-white font-medium mb-3">Stack Insights</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Primary Language:</span>
                <span className="text-slate-200">{repository.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Frameworks:</span>
                <span className="text-slate-200">{techStack.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Architecture:</span>
                <span className="text-slate-200">Component-based</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Build System:</span>
                <span className="text-slate-200">Modern</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderLanguageTrends = () => (
    <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <span>Language File Counts</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={languageData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={12} width={80} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Bar dataKey="files" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {renderLanguagePieChart()}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTechStack()}
        {renderLanguageTrends()}
      </div>
    </div>
  );
};
