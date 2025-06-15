
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Code, 
  Database, 
  Settings,
  ChevronDown,
  ChevronRight,
  Eye,
  Download
} from 'lucide-react';
import { githubApi, GitHubFileContent } from '@/services/githubApi';

interface RepositoryStructureProps {
  owner: string;
  repo: string;
}

interface FileNode extends GitHubFileContent {
  children?: FileNode[];
  depth: number;
  isExpanded?: boolean;
}

export const RepositoryStructure: React.FC<RepositoryStructureProps> = ({ owner, repo }) => {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['']));

  useEffect(() => {
    loadRepositoryStructure();
  }, [owner, repo]);

  const loadRepositoryStructure = async () => {
    try {
      setIsLoading(true);
      const contents = await githubApi.getRepositoryContents(owner, repo);
      
      // Type guard to ensure we have an array
      if (Array.isArray(contents)) {
        const tree = await buildFileTree(contents, 0);
        setFileTree(tree);
      } else {
        // If it's a single file, wrap it in an array
        const tree = await buildFileTree([contents], 0);
        setFileTree(tree);
      }
    } catch (error) {
      console.error('Error loading repository structure:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buildFileTree = async (contents: GitHubFileContent[], depth: number): Promise<FileNode[]> => {
    const nodes: FileNode[] = [];
    
    for (const item of contents) {
      const node: FileNode = {
        ...item,
        depth,
        children: item.type === 'dir' ? [] : undefined,
        isExpanded: depth === 0
      };
      
      // Load children for directories if at root level or commonly important folders
      if (item.type === 'dir' && (depth === 0 || ['src', 'components', 'pages', 'hooks'].includes(item.name))) {
        try {
          const childContents = await githubApi.getRepositoryContents(owner, repo, item.path);
          
          // Type guard to ensure we have an array for building the tree
          if (Array.isArray(childContents)) {
            node.children = await buildFileTree(childContents, depth + 1);
          } else {
            // If it's a single file, wrap it in an array
            node.children = await buildFileTree([childContents], depth + 1);
          }
        } catch (error) {
          console.error(`Error loading contents for ${item.path}:`, error);
        }
      }
      
      nodes.push(node);
    }
    
    return nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'dir' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  };

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'dir') {
      return expandedFolders.has(file.path) ? <FolderOpen className="w-4 h-4 text-blue-400" /> : <Folder className="w-4 h-4 text-blue-400" />;
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, JSX.Element> = {
      'js': <Code className="w-4 h-4 text-yellow-400" />,
      'ts': <Code className="w-4 h-4 text-blue-400" />,
      'tsx': <Code className="w-4 h-4 text-blue-400" />,
      'jsx': <Code className="w-4 h-4 text-yellow-400" />,
      'json': <Database className="w-4 h-4 text-green-400" />,
      'md': <FileText className="w-4 h-4 text-gray-400" />,
      'config': <Settings className="w-4 h-4 text-orange-400" />,
    };
    
    return iconMap[extension || ''] || <FileText className="w-4 h-4 text-gray-400" />;
  };

  const getFileTypeColor = (file: FileNode) => {
    if (file.type === 'dir') return 'bg-blue-500/20 text-blue-300';
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    const colorMap: Record<string, string> = {
      'js': 'bg-yellow-500/20 text-yellow-300',
      'ts': 'bg-blue-500/20 text-blue-300',
      'tsx': 'bg-blue-500/20 text-blue-300',
      'jsx': 'bg-yellow-500/20 text-yellow-300',
      'json': 'bg-green-500/20 text-green-300',
      'md': 'bg-gray-500/20 text-gray-300',
    };
    
    return colorMap[extension || ''] || 'bg-gray-500/20 text-gray-300';
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileNode = (node: FileNode) => {
    const isExpanded = expandedFolders.has(node.path);
    
    return (
      <div key={node.path} className="select-none">
        <div
          className={`flex items-center space-x-2 py-1 px-2 rounded cursor-pointer hover:bg-slate-700/50 transition-colors ${
            selectedFile?.path === node.path ? 'bg-blue-500/20 border border-blue-500/30' : ''
          }`}
          style={{ paddingLeft: `${node.depth * 20 + 8}px` }}
          onClick={() => {
            if (node.type === 'dir') {
              toggleFolder(node.path);
            } else {
              setSelectedFile(node);
            }
          }}
        >
          {node.type === 'dir' && (
            <div className="w-4 h-4 flex items-center justify-center">
              {isExpanded ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
            </div>
          )}
          {getFileIcon(node)}
          <span className="text-slate-200 text-sm truncate flex-1">{node.name}</span>
          <Badge variant="secondary" className={`text-xs ${getFileTypeColor(node)}`}>
            {node.type === 'dir' ? 'DIR' : node.name.split('.').pop()?.toUpperCase()}
          </Badge>
          {node.type === 'file' && (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
              <Eye className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        {node.type === 'dir' && isExpanded && node.children && (
          <div>
            {node.children.map(renderFileNode)}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-300">Loading repository structure...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* File Tree */}
      <div className="lg:col-span-2">
        <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Folder className="w-5 h-5 text-blue-400" />
              <span>Repository Structure</span>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                {fileTree.length} items
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div className="space-y-1">
              {fileTree.map(renderFileNode)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Details */}
      <div>
        <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">File Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  {getFileIcon(selectedFile)}
                  <span className="text-white font-medium">{selectedFile.name}</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Path:</span>
                    <span className="text-slate-200">{selectedFile.path}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-slate-200">{selectedFile.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Size:</span>
                    <span className="text-slate-200">{selectedFile.size} bytes</span>
                  </div>
                </div>

                {selectedFile.download_url && (
                  <Button 
                    variant="outline" 
                    className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                    onClick={() => window.open(selectedFile.download_url, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    View Raw File
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">Select a file to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
