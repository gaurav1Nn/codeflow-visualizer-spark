import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Network, 
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowLeft,
  FolderOpen,
  FileText,
  GitBranch,
  Eye,
  Filter,
  Layers,
  Activity,
  EyeOff,
  TreePine
} from 'lucide-react';
import { repositoryAnalyzer, FileNode, DependencyConnection, RepositoryStructure } from '@/services/repositoryAnalyzer';
import { repositoryHierarchy, HierarchicalNode, FilteredConnections } from '@/services/repositoryHierarchy';
import { HierarchicalVisualization } from './HierarchicalVisualization';
import { githubApi } from '@/services/githubApi';

interface ModernRepositoryVisualizationProps {
  repository: any;
  commits: any[];
  contributors: any[];
  branches: any[];
}

export const ModernRepositoryVisualization: React.FC<ModernRepositoryVisualizationProps> = ({ 
  repository, 
  commits,
  contributors,
  branches
}) => {
  const [repositoryStructure, setRepositoryStructure] = useState<RepositoryStructure | null>(null);
  const [hierarchy, setHierarchy] = useState<HierarchicalNode[]>([]);
  const [visibleNodes, setVisibleNodes] = useState<HierarchicalNode[]>([]);
  const [filteredConnections, setFilteredConnections] = useState<FilteredConnections>({
    primary: [],
    secondary: [],
    total: 0
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'hierarchy' | 'network' | 'complexity'>('hierarchy');
  const [selectedNode, setSelectedNode] = useState<HierarchicalNode | null>(null);
  const [showConnections, setShowConnections] = useState(true);

  const analyzeRepositoryStructure = useCallback(async () => {
    if (!repository) return;
    
    setIsAnalyzing(true);
    try {
      const [owner, repo] = repository.full_name.split('/');
      console.log(`🚀 Starting repository analysis for ${owner}/${repo}`);
      const structure = await repositoryAnalyzer.analyzeRepository(owner, repo);
      setRepositoryStructure(structure);
      
      // Build hierarchy with all folders collapsed initially
      const hierarchicalNodes = repositoryHierarchy.buildHierarchy(structure.nodes);
      setHierarchy(hierarchicalNodes);
      
      // Show only root level nodes initially
      updateVisibleNodes(hierarchicalNodes, structure.connections);
      
      console.log('✅ Repository structure and hierarchy built');
    } catch (error) {
      console.error('❌ Failed to analyze repository:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [repository]);

  const updateVisibleNodes = (currentHierarchy: HierarchicalNode[], connections: DependencyConnection[]) => {
    // Get visible nodes based on expansion state
    let visible = repositoryHierarchy.getVisibleNodes(currentHierarchy);
    
    // Apply search filter
    if (searchTerm) {
      visible = visible.filter(node => 
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.path.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // If searching, expand relevant paths
      if (searchTerm && currentHierarchy.length > 0) {
        const expandedHierarchy = repositoryHierarchy.expandPath(currentHierarchy, searchTerm);
        setHierarchy(expandedHierarchy);
        visible = repositoryHierarchy.getVisibleNodes(expandedHierarchy).filter(node => 
          node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.path.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }
    
    setVisibleNodes(visible);
    
    // Update filtered connections
    const filtered = repositoryHierarchy.filterConnections(connections, visible);
    setFilteredConnections(filtered);
  };

  const handleNodeClick = useCallback((node: HierarchicalNode) => {
    if (node.type === 'directory') {
      // Toggle directory expansion
      const newHierarchy = repositoryHierarchy.toggleNodeExpansion(hierarchy, node.id);
      setHierarchy(newHierarchy);
      updateVisibleNodes(newHierarchy, repositoryStructure?.connections || []);
    } else {
      // Select file for details
      setSelectedNode(node);
    }
  }, [hierarchy, repositoryStructure]);

  const resetView = () => {
    if (repositoryStructure) {
      // Collapse all and show only root level
      const freshHierarchy = repositoryHierarchy.collapseAll(hierarchy);
      setHierarchy(freshHierarchy);
      setSearchTerm('');
      setSelectedNode(null);
      updateVisibleNodes(freshHierarchy, repositoryStructure.connections);
    }
  };

  useEffect(() => {
    if (repository && !repositoryStructure) {
      analyzeRepositoryStructure();
    }
  }, [repository, analyzeRepositoryStructure, repositoryStructure]);

  useEffect(() => {
    if (hierarchy.length > 0 && repositoryStructure) {
      updateVisibleNodes(hierarchy, repositoryStructure.connections);
    }
  }, [searchTerm, hierarchy, repositoryStructure]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-slate-700/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3 text-white">
              <TreePine className="w-6 h-6 text-green-400" />
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Repository Structure
              </span>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConnections(!showConnections)}
                className={`text-slate-300 ${showConnections ? 'bg-blue-500/20' : ''}`}
              >
                {showConnections ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetView}
                className="text-slate-300"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search files and folders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600/50 text-white"
              />
            </div>
            
            <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <TabsList className="bg-slate-700/50 border-slate-600/50">
                <TabsTrigger value="hierarchy" className="text-xs">
                  <TreePine className="w-3 h-3 mr-1" />
                  Tree
                </TabsTrigger>
                <TabsTrigger value="network" className="text-xs">
                  <Network className="w-3 h-3 mr-1" />
                  Network
                </TabsTrigger>
                <TabsTrigger value="complexity" className="text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  Complexity
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {repositoryStructure && (
            <div className="grid grid-cols-5 gap-3 text-center">
              <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                <div className="text-xl font-bold text-blue-400">{repositoryStructure.stats.totalFiles}</div>
                <div className="text-xs text-slate-400">Files</div>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                <div className="text-xl font-bold text-green-400">{repositoryStructure.stats.totalDirectories}</div>
                <div className="text-xs text-slate-400">Folders</div>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                <div className="text-xl font-bold text-purple-400">{Object.keys(repositoryStructure.stats.languages).length}</div>
                <div className="text-xs text-slate-400">Languages</div>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                <div className="text-xl font-bold text-orange-400">{filteredConnections.primary.length}</div>
                <div className="text-xs text-slate-400">Key Links</div>
              </div>
              <div className="bg-gray-500/10 rounded-lg p-3 border border-gray-500/20">
                <div className="text-xl font-bold text-gray-400">{visibleNodes.length}</div>
                <div className="text-xs text-slate-400">Visible</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
            <CardContent className="h-[600px] p-4 relative overflow-hidden">
              {isAnalyzing ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900/50 to-blue-900/20">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg mb-2">Analyzing Repository Structure</p>
                    <p className="text-slate-400 text-sm">Building hierarchical view...</p>
                  </div>
                </div>
              ) : (
                <HierarchicalVisualization
                  hierarchy={hierarchy}
                  visibleNodes={visibleNodes}
                  connections={filteredConnections}
                  onNodeClick={handleNodeClick}
                  showConnections={showConnections}
                  searchTerm={searchTerm}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-slate-400">
                Click folders to expand/collapse their contents
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-300">📁</span>
                <span className="text-slate-400 text-xs">Collapsed folder</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-300">📂</span>
                <span className="text-slate-400 text-xs">Expanded folder</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">Showing:</span>
                <Badge variant="outline" className="text-xs">
                  {visibleNodes.length} of {hierarchy.length} items
                </Badge>
              </div>
            </CardContent>
          </Card>

          {selectedNode && (
            <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">File Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium text-sm">{selectedNode.name}</span>
                </div>
                
                <div className="space-y-2 text-xs">
                  {selectedNode.language && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Language:</span>
                      <Badge variant="secondary" className="text-xs">
                        {selectedNode.language}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Size:</span>
                    <span className="text-slate-200">{selectedNode.size} bytes</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Level:</span>
                    <span className="text-slate-200">{selectedNode.level}</span>
                  </div>
                  
                  {selectedNode.complexity && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Complexity:</span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          selectedNode.complexity === 'high' ? 'bg-red-500/20 text-red-300' :
                          selectedNode.complexity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'
                        }`}
                      >
                        {selectedNode.complexity}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Connection Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-4 h-1 bg-blue-500 rounded"></div>
                <span className="text-slate-300">Primary Import</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-4 h-1 bg-slate-500 rounded"></div>
                <span className="text-slate-300">Secondary Link</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-300">📂</span>
                <span className="text-slate-300">Expandable Folder</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-300">⚛️</span>
                <span className="text-slate-300">React Component</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
