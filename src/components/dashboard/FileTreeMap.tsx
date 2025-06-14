
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Code, 
  Search,
  Filter,
  BarChart3,
  Grid3X3
} from 'lucide-react';

interface FileTreeMapProps {
  repository: any;
}

export const FileTreeMap: React.FC<FileTreeMapProps> = ({ repository }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');

  // Simulate file structure based on repository language
  const fileStructure = useMemo(() => {
    const createFileStructure = (language: string) => {
      const structures: Record<string, any> = {
        'JavaScript': {
          'src/': {
            'components/': {
              'Header.jsx': { size: 2.4, type: 'jsx' },
              'Footer.jsx': { size: 1.8, type: 'jsx' },
              'Navigation.jsx': { size: 3.2, type: 'jsx' }
            },
            'pages/': {
              'Home.jsx': { size: 4.1, type: 'jsx' },
              'About.jsx': { size: 2.9, type: 'jsx' },
              'Contact.jsx': { size: 2.2, type: 'jsx' }
            },
            'utils/': {
              'helpers.js': { size: 1.5, type: 'js' },
              'api.js': { size: 3.8, type: 'js' }
            },
            'styles/': {
              'main.css': { size: 5.2, type: 'css' },
              'components.css': { size: 3.1, type: 'css' }
            },
            'App.js': { size: 2.8, type: 'js' },
            'index.js': { size: 1.2, type: 'js' }
          },
          'public/': {
            'index.html': { size: 1.8, type: 'html' },
            'favicon.ico': { size: 0.1, type: 'ico' }
          },
          'package.json': { size: 1.1, type: 'json' },
          'README.md': { size: 2.3, type: 'md' },
          '.gitignore': { size: 0.3, type: 'txt' }
        },
        'Python': {
          'src/': {
            'models/': {
              '__init__.py': { size: 0.1, type: 'py' },
              'user.py': { size: 3.2, type: 'py' },
              'database.py': { size: 4.5, type: 'py' }
            },
            'views/': {
              '__init__.py': { size: 0.1, type: 'py' },
              'main.py': { size: 5.8, type: 'py' },
              'auth.py': { size: 3.4, type: 'py' }
            },
            'utils/': {
              'helpers.py': { size: 2.1, type: 'py' },
              'config.py': { size: 1.8, type: 'py' }
            }
          },
          'tests/': {
            'test_models.py': { size: 2.9, type: 'py' },
            'test_views.py': { size: 3.7, type: 'py' }
          },
          'requirements.txt': { size: 0.8, type: 'txt' },
          'main.py': { size: 2.4, type: 'py' },
          'README.md': { size: 2.1, type: 'md' }
        }
      };

      return structures[language] || structures['JavaScript'];
    };

    return createFileStructure(repository.language || 'JavaScript');
  }, [repository.language]);

  const flattenFiles = (structure: any, path = ''): Array<{path: string, name: string, size: number, type: string}> => {
    const files: Array<{path: string, name: string, size: number, type: string}> = [];
    
    Object.entries(structure).forEach(([name, content]: [string, any]) => {
      const currentPath = path + name;
      
      if (content.size !== undefined) {
        // It's a file
        files.push({
          path: currentPath,
          name,
          size: content.size,
          type: content.type
        });
      } else {
        // It's a directory
        files.push(...flattenFiles(content, currentPath));
      }
    });
    
    return files;
  };

  const allFiles = useMemo(() => flattenFiles(fileStructure), [fileStructure]);
  
  const filteredFiles = useMemo(() => {
    return allFiles.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedFileType || file.type === selectedFileType;
      return matchesSearch && matchesType;
    });
  }, [allFiles, searchTerm, selectedFileType]);

  const fileTypes = useMemo(() => {
    const types = new Set(allFiles.map(file => file.type));
    return Array.from(types);
  }, [allFiles]);

  const getFileIcon = (type: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'jsx': <Code className="w-4 h-4 text-blue-400" />,
      'js': <Code className="w-4 h-4 text-yellow-400" />,
      'py': <Code className="w-4 h-4 text-green-400" />,
      'css': <FileText className="w-4 h-4 text-pink-400" />,
      'html': <Code className="w-4 h-4 text-orange-400" />,
      'json': <FileText className="w-4 h-4 text-gray-400" />,
      'md': <FileText className="w-4 h-4 text-blue-300" />,
      'txt': <FileText className="w-4 h-4 text-gray-300" />
    };
    return iconMap[type] || <FileText className="w-4 h-4 text-gray-400" />;
  };

  const getFileTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'jsx': 'bg-blue-500/20 text-blue-300',
      'js': 'bg-yellow-500/20 text-yellow-300',
      'py': 'bg-green-500/20 text-green-300',
      'css': 'bg-pink-500/20 text-pink-300',
      'html': 'bg-orange-500/20 text-orange-300',
      'json': 'bg-gray-500/20 text-gray-300',
      'md': 'bg-blue-500/20 text-blue-300',
      'txt': 'bg-gray-500/20 text-gray-300'
    };
    return colorMap[type] || 'bg-gray-500/20 text-gray-300';
  };

  const renderTreeView = () => {
    const renderDirectory = (structure: any, level = 0): JSX.Element[] => {
      return Object.entries(structure).map(([name, content]: [string, any]) => {
        const isFile = content.size !== undefined;
        
        return (
          <div 
            key={name} 
            className="select-none"
            style={{ paddingLeft: `${level * 20}px` }}
          >
            <div className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-slate-700/50 transition-colors">
              {isFile ? (
                <>
                  {getFileIcon(content.type)}
                  <span className="text-slate-200 text-sm">{name}</span>
                  <Badge variant="secondary" className={`text-xs ${getFileTypeColor(content.type)}`}>
                    {content.size}KB
                  </Badge>
                </>
              ) : (
                <>
                  <Folder className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-200 text-sm font-medium">{name}</span>
                </>
              )}
            </div>
            {!isFile && (
              <div>{renderDirectory(content, level + 1)}</div>
            )}
          </div>
        );
      });
    };

    return (
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {renderDirectory(fileStructure)}
      </div>
    );
  };

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
      {filteredFiles.map((file, index) => (
        <div 
          key={index}
          className="bg-slate-700/30 rounded-lg p-3 hover:bg-slate-600/30 transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2 mb-2">
            {getFileIcon(file.type)}
            <Badge variant="secondary" className={`text-xs ${getFileTypeColor(file.type)}`}>
              {file.type.toUpperCase()}
            </Badge>
          </div>
          <div className="text-white text-sm font-medium truncate">{file.name}</div>
          <div className="text-slate-400 text-xs">{file.size}KB</div>
        </div>
      ))}
    </div>
  );

  const renderFileStats = () => {
    const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);
    const typeStats = fileTypes.map(type => ({
      type,
      count: allFiles.filter(f => f.type === type).length,
      size: allFiles.filter(f => f.type === type).reduce((sum, f) => sum + f.size, 0)
    })).sort((a, b) => b.count - a.count);

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{allFiles.length}</div>
          <div className="text-slate-400 text-sm">Total Files</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{totalSize.toFixed(1)}KB</div>
          <div className="text-slate-400 text-sm">Total Size</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{fileTypes.length}</div>
          <div className="text-slate-400 text-sm">File Types</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">
            {typeStats[0]?.type.toUpperCase() || 'N/A'}
          </div>
          <div className="text-slate-400 text-sm">Primary Type</div>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Grid3X3 className="w-5 h-5 text-green-400" />
          <span>Codebase Structure</span>
          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
            Interactive
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderFileStats()}
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={selectedFileType || ''}
              onChange={(e) => setSelectedFileType(e.target.value || null)}
              className="bg-slate-700/50 border border-slate-600/50 rounded-md px-3 py-2 text-white text-sm"
            >
              <option value="">All Types</option>
              {fileTypes.map(type => (
                <option key={type} value={type}>{type.toUpperCase()}</option>
              ))}
            </select>
            
            <Button
              variant={viewMode === 'tree' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('tree')}
              className="border-slate-600/50"
            >
              Tree
            </Button>
            
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="border-slate-600/50"
            >
              Grid
            </Button>
          </div>
        </div>

        {viewMode === 'tree' ? renderTreeView() : renderGridView()}
      </CardContent>
    </Card>
  );
};
