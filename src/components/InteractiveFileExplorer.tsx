
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Code, 
  Database, 
  Search,
  Filter,
  Eye,
  ChevronDown,
  ChevronRight,
  Zap
} from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  size?: number;
  children?: FileNode[];
  depth: number;
}

interface InteractiveFileExplorerProps {
  files: FileNode[];
}

export const InteractiveFileExplorer: React.FC<InteractiveFileExplorerProps> = ({ files }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const explorerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (explorerRef.current) {
      gsap.fromTo(explorerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'directory') {
      return expandedFolders.has(file.path) 
        ? <FolderOpen className="w-4 h-4 text-blue-400" /> 
        : <Folder className="w-4 h-4 text-blue-500" />;
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, JSX.Element> = {
      'js': <Code className="w-4 h-4 text-yellow-400" />,
      'ts': <Code className="w-4 h-4 text-blue-400" />,
      'tsx': <Code className="w-4 h-4 text-blue-400" />,
      'jsx': <Code className="w-4 h-4 text-yellow-400" />,
      'json': <Database className="w-4 h-4 text-green-400" />,
      'md': <FileText className="w-4 h-4 text-gray-400" />,
    };
    
    return iconMap[extension || ''] || <FileText className="w-4 h-4 text-gray-400" />;
  };

  const getFileTypeColor = (file: FileNode) => {
    if (file.type === 'directory') return 'bg-blue-500/20 text-blue-300';
    
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

  const toggleFolder = (path: string, nodeRef?: HTMLDivElement) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);

    // Animate folder toggle
    if (nodeRef) {
      gsap.to(nodeRef, {
        scale: 1.05,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  };

  const handleFileSelect = (file: FileNode, nodeRef?: HTMLDivElement) => {
    setSelectedFile(file);
    
    // Animate selection
    if (nodeRef) {
      gsap.fromTo(nodeRef,
        { backgroundColor: "rgba(59, 130, 246, 0)" },
        { backgroundColor: "rgba(59, 130, 246, 0.2)", duration: 0.3, ease: "power2.out" }
      );
    }
  };

  const renderFileNode = (node: FileNode, index: number) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile?.path === node.path;
    const nodeRef = useRef<HTMLDivElement>(null);

    return (
      <div key={node.path} className="file-node">
        <div
          ref={nodeRef}
          className={`flex items-center space-x-3 py-2 px-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-slate-700/50 group ${
            isSelected ? 'bg-blue-500/20 border border-blue-500/30' : ''
          }`}
          style={{ 
            paddingLeft: `${node.depth * 20 + 12}px`,
            animationDelay: `${index * 0.05}s`
          }}
          onClick={() => {
            if (node.type === 'directory') {
              toggleFolder(node.path, nodeRef.current || undefined);
            } else {
              handleFileSelect(node, nodeRef.current || undefined);
            }
          }}
        >
          {node.type === 'directory' && (
            <div className="w-4 h-4 flex items-center justify-center transition-transform duration-200">
              {isExpanded ? 
                <ChevronDown className="w-3 h-3 text-slate-400" /> : 
                <ChevronRight className="w-3 h-3 text-slate-400" />
              }
            </div>
          )}
          
          <div className="transition-transform duration-200 group-hover:scale-110">
            {getFileIcon(node)}
          </div>
          
          <span className="text-slate-200 text-sm truncate flex-1 group-hover:text-white transition-colors duration-200">
            {node.name}
          </span>
          
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Badge variant="secondary" className={`text-xs ${getFileTypeColor(node)}`}>
              {node.type === 'directory' ? 'DIR' : node.name.split('.').pop()?.toUpperCase()}
            </Badge>
            
            {node.type === 'file' && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
                <Eye className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
        
        {node.type === 'directory' && isExpanded && node.children && (
          <div className="children-container">
            {node.children.map((child, childIndex) => renderFileNode(child, childIndex))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={explorerRef} className="space-y-6">
      {/* Enhanced Search and Filter */}
      <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>Interactive File Explorer</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search files and folders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <Button variant="outline" className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* File Tree */}
          <div className="max-h-96 overflow-y-auto space-y-1 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
            {files.map((file, index) => renderFileNode(file, index))}
          </div>
        </CardContent>
      </Card>

      {/* File Details Panel */}
      {selectedFile && (
        <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-white">File Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {getFileIcon(selectedFile)}
                <span className="text-white font-medium text-lg">{selectedFile.name}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Path:</span>
                    <span className="text-slate-200 font-mono text-xs">{selectedFile.path}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-slate-200">{selectedFile.type}</span>
                  </div>
                </div>
                
                {selectedFile.size && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Size:</span>
                    <span className="text-slate-200">{selectedFile.size} bytes</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
