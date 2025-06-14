
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
  Activity
} from 'lucide-react';
import { repositoryAnalyzer, FileNode, DependencyConnection, RepositoryStructure } from '@/services/repositoryAnalyzer';

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
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [repositoryStructure, setRepositoryStructure] = useState<RepositoryStructure | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'structure' | 'dependencies' | 'complexity' | 'activity'>('structure');
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Repository']);
  const [zoomLevel, setZoomLevel] = useState(1);

  const analyzeRepositoryStructure = useCallback(async () => {
    if (!repository) return;
    
    setIsAnalyzing(true);
    try {
      const [owner, repo] = repository.full_name.split('/');
      const structure = await repositoryAnalyzer.analyzeRepository(owner, repo);
      setRepositoryStructure(structure);
      console.log('Repository structure analyzed:', structure);
    } catch (error) {
      console.error('Failed to analyze repository:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [repository]);

  useEffect(() => {
    if (repository && !repositoryStructure) {
      analyzeRepositoryStructure();
    }
  }, [repository, analyzeRepositoryStructure, repositoryStructure]);

  useEffect(() => {
    if (repositoryStructure) {
      renderVisualization();
    }
  }, [repositoryStructure, currentPath, viewMode, searchTerm]);

  const getVisibleNodes = (): FileNode[] => {
    if (!repositoryStructure) return [];
    
    let nodes = repositoryStructure.nodes;
    
    // Filter by current path
    if (currentPath) {
      nodes = nodes.filter(node => 
        node.path.startsWith(currentPath) && 
        node.path !== currentPath &&
        node.path.split('/').length === currentPath.split('/').length + 1
      );
    } else {
      nodes = nodes.filter(node => !node.path.includes('/') || node.depth === 0);
    }
    
    // Filter by search term
    if (searchTerm) {
      nodes = nodes.filter(node => 
        node.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return nodes;
  };

  const getNodeColor = (node: FileNode): string => {
    switch (viewMode) {
      case 'complexity':
        return {
          'low': '#10B981',
          'medium': '#F59E0B',
          'high': '#EF4444'
        }[node.complexity || 'low'];
      
      case 'dependencies':
        const importCount = node.imports?.length || 0;
        if (importCount > 5) return '#EF4444';
        if (importCount > 2) return '#F59E0B';
        return '#10B981';
      
      case 'activity':
        // Color based on file type for now
        return node.type === 'directory' ? '#8B5CF6' : '#3B82F6';
      
      default:
        return node.type === 'directory' ? '#8B5CF6' : 
               node.language === 'TypeScript' ? '#3B82F6' :
               node.language === 'TSX' ? '#10B981' :
               node.language === 'JavaScript' ? '#F59E0B' : '#6B7280';
    }
  };

  const getNodeSize = (node: FileNode): number => {
    const baseSize = node.type === 'directory' ? 40 : 30;
    
    switch (viewMode) {
      case 'complexity':
        const complexityMultiplier = {
          'low': 1,
          'medium': 1.3,
          'high': 1.6
        }[node.complexity || 'low'];
        return baseSize * complexityMultiplier;
      
      case 'dependencies':
        const depCount = (node.imports?.length || 0) + (node.exports?.length || 0);
        return baseSize + Math.min(depCount * 2, 20);
      
      default:
        return baseSize;
    }
  };

  const renderVisualization = () => {
    if (!svgRef.current || !repositoryStructure) return;

    const svg = svgRef.current;
    const visibleNodes = getVisibleNodes();
    const width = 800;
    const height = 600;

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());

    // Create modern background with gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    gradient.setAttribute('id', 'backgroundGradient');
    gradient.setAttribute('cx', '50%');
    gradient.setAttribute('cy', '50%');
    gradient.setAttribute('r', '50%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#1e293b');
    stop1.setAttribute('stop-opacity', '0.8');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#0f172a');
    stop2.setAttribute('stop-opacity', '1');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);

    // Glow filter
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '3');
    feGaussianBlur.setAttribute('result', 'coloredBlur');
    
    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    
    svg.appendChild(defs);

    // Background
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', 'url(#backgroundGradient)');
    svg.appendChild(background);

    // Calculate positions using force simulation algorithm
    const positions = calculateNodePositions(visibleNodes, width, height);

    // Render connections first (behind nodes)
    if (viewMode === 'dependencies') {
      renderConnections(svg, visibleNodes, positions);
    }

    // Render nodes
    visibleNodes.forEach((node, index) => {
      const position = positions[index];
      const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      nodeGroup.setAttribute('class', 'repo-node modern-node');
      nodeGroup.setAttribute('data-node-id', node.id);
      nodeGroup.setAttribute('transform', `translate(${position.x}, ${position.y})`);
      nodeGroup.style.cursor = 'pointer';

      const size = getNodeSize(node);
      const color = getNodeColor(node);

      // Modern node with glassmorphism effect
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', (size / 2).toString());
      circle.setAttribute('fill', color);
      circle.setAttribute('fill-opacity', '0.8');
      circle.setAttribute('stroke', 'rgba(255,255,255,0.2)');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('filter', 'url(#glow)');
      circle.style.backdropFilter = 'blur(10px)';

      // Icon based on file type
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      icon.setAttribute('text-anchor', 'middle');
      icon.setAttribute('dy', '0.35em');
      icon.setAttribute('fill', 'white');
      icon.setAttribute('font-size', '12px');
      icon.textContent = node.type === 'directory' ? '📁' : '📄';

      // Label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dy', (size / 2 + 15).toString());
      label.setAttribute('fill', 'white');
      label.setAttribute('font-size', '11px');
      label.setAttribute('font-weight', '500');
      
      let displayName = node.name;
      if (displayName.length > 15) {
        displayName = displayName.slice(0, 12) + '...';
      }
      label.textContent = displayName;

      // Metadata
      if (viewMode === 'complexity' && node.complexity) {
        const complexityBadge = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        complexityBadge.setAttribute('cx', (size / 2 - 5).toString());
        complexityBadge.setAttribute('cy', (-size / 2 + 5).toString());
        complexityBadge.setAttribute('r', '6');
        complexityBadge.setAttribute('fill', color);
        complexityBadge.setAttribute('stroke', 'white');
        complexityBadge.setAttribute('stroke-width', '2');
        nodeGroup.appendChild(complexityBadge);
      }

      nodeGroup.appendChild(circle);
      nodeGroup.appendChild(icon);
      nodeGroup.appendChild(label);
      svg.appendChild(nodeGroup);

      // Enhanced interactions
      nodeGroup.addEventListener('mouseenter', () => {
        gsap.to(circle, {
          scale: 1.2,
          duration: 0.3,
          ease: "back.out(1.7)",
          transformOrigin: "center"
        });
      });

      nodeGroup.addEventListener('mouseleave', () => {
        gsap.to(circle, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          transformOrigin: "center"
        });
      });

      nodeGroup.addEventListener('click', () => handleNodeClick(node));

      // Entrance animation with stagger
      gsap.fromTo(nodeGroup, {
        scale: 0,
        opacity: 0,
        rotationY: 180
      }, {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        duration: 0.8,
        delay: index * 0.05,
        ease: "back.out(1.7)",
        transformOrigin: "center"
      });
    });
  };

  const calculateNodePositions = (nodes: FileNode[], width: number, height: number) => {
    // Simple circular layout for now - can be enhanced with force simulation
    const positions = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    nodes.forEach((node, index) => {
      if (nodes.length === 1) {
        positions.push({ x: centerX, y: centerY });
      } else {
        const angle = (index / nodes.length) * 2 * Math.PI;
        const nodeRadius = node.type === 'directory' ? radius * 0.7 : radius;
        const x = centerX + Math.cos(angle) * nodeRadius;
        const y = centerY + Math.sin(angle) * nodeRadius;
        positions.push({ x, y });
      }
    });
    
    return positions;
  };

  const renderConnections = (svg: SVGSVGElement, nodes: FileNode[], positions: any[]) => {
    if (!repositoryStructure) return;
    
    repositoryStructure.connections.forEach(connection => {
      const sourceIndex = nodes.findIndex(n => n.id === connection.source);
      const targetIndex = nodes.findIndex(n => n.id === connection.target);
      
      if (sourceIndex >= 0 && targetIndex >= 0) {
        const sourcePos = positions[sourceIndex];
        const targetPos = positions[targetIndex];
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', sourcePos.x.toString());
        line.setAttribute('y1', sourcePos.y.toString());
        line.setAttribute('x2', targetPos.x.toString());
        line.setAttribute('y2', targetPos.y.toString());
        line.setAttribute('stroke', 'rgba(147, 197, 253, 0.6)');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('opacity', '0.7');
        
        // Animated dashes
        gsap.fromTo(line, 
          { strokeDasharray: "5,5", strokeDashoffset: 10 },
          { strokeDashoffset: 0, duration: 2, ease: "none", repeat: -1 }
        );
        
        svg.appendChild(line);
      }
    });
  };

  const handleNodeClick = (node: FileNode) => {
    if (node.type === 'directory') {
      setCurrentPath(node.path);
      setBreadcrumb(prev => [...prev, node.name]);
    } else {
      setSelectedNode(node);
    }
  };

  const handleBackNavigation = () => {
    if (currentPath) {
      const pathParts = currentPath.split('/');
      pathParts.pop();
      const newPath = pathParts.join('/');
      setCurrentPath(newPath);
      setBreadcrumb(prev => prev.slice(0, -1));
    }
  };

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    const container = containerRef.current;
    if (!container) return;
    
    switch (direction) {
      case 'in':
        setZoomLevel(prev => Math.min(prev * 1.2, 3));
        break;
      case 'out':
        setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
        break;
      case 'reset':
        setZoomLevel(1);
        break;
    }
    
    gsap.to(container.querySelector('svg'), {
      scale: zoomLevel,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <div className="space-y-6">
      {/* Modern Control Panel */}
      <Card className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-slate-700/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3 text-white">
              <Network className="w-6 h-6 text-blue-400" />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Repository Architecture
              </span>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleZoom('out')}
                className="text-slate-300"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleZoom('in')}
                className="text-slate-300"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleZoom('reset')}
                className="text-slate-300"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 mt-4">
            {currentPath && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackNavigation}
                className="text-slate-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            
            <div className="flex items-center space-x-2 text-sm">
              {breadcrumb.map((crumb, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {index > 0 && <span className="text-slate-500">/</span>}
                  <span className={index === breadcrumb.length - 1 ? "text-blue-300" : "text-slate-400"}>
                    {crumb}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search and View Controls */}
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
                <TabsTrigger value="structure" className="text-xs">
                  <Layers className="w-3 h-3 mr-1" />
                  Structure
                </TabsTrigger>
                <TabsTrigger value="dependencies" className="text-xs">
                  <GitBranch className="w-3 h-3 mr-1" />
                  Dependencies
                </TabsTrigger>
                <TabsTrigger value="complexity" className="text-xs">
                  <Filter className="w-3 h-3 mr-1" />
                  Complexity
                </TabsTrigger>
                <TabsTrigger value="activity" className="text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  Activity
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Stats Display */}
          {repositoryStructure && (
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-blue-500/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-400">{repositoryStructure.stats.totalFiles}</div>
                <div className="text-xs text-slate-400">Files</div>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-400">{repositoryStructure.stats.totalDirectories}</div>
                <div className="text-xs text-slate-400">Directories</div>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-400">{Object.keys(repositoryStructure.stats.languages).length}</div>
                <div className="text-xs text-slate-400">Languages</div>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-400">{repositoryStructure.connections.length}</div>
                <div className="text-xs text-slate-400">Connections</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
            <CardContent className="h-[600px] p-0 relative overflow-hidden">
              {isAnalyzing ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900/50 to-blue-900/20">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg mb-2">Analyzing Repository Structure</p>
                    <p className="text-slate-400 text-sm">Discovering files, dependencies, and relationships...</p>
                  </div>
                </div>
              ) : (
                <div
                  ref={containerRef}
                  className="w-full h-full bg-gradient-to-br from-slate-900/30 to-blue-900/20 relative"
                >
                  <svg
                    ref={svgRef}
                    className="w-full h-full"
                    style={{ background: "transparent" }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Details Panel */}
        <div className="space-y-4">
          <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Current View</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <FolderOpen className="w-4 h-4 text-blue-400" />
                <span className="text-white font-medium">{breadcrumb[breadcrumb.length - 1]}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
              </Badge>
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
                  
                  {selectedNode.imports && selectedNode.imports.length > 0 && (
                    <div className="pt-2 border-t border-slate-600/50">
                      <h4 className="text-slate-300 font-medium text-xs mb-2">Imports ({selectedNode.imports.length}):</h4>
                      <div className="space-y-1 max-h-20 overflow-y-auto">
                        {selectedNode.imports.slice(0, 5).map((imp, index) => (
                          <div key={index} className="text-xs text-slate-400 truncate">• {imp}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedNode.exports && selectedNode.exports.length > 0 && (
                    <div className="pt-2 border-t border-slate-600/50">
                      <h4 className="text-slate-300 font-medium text-xs mb-2">Exports ({selectedNode.exports.length}):</h4>
                      <div className="space-y-1 max-h-20 overflow-y-auto">
                        {selectedNode.exports.slice(0, 5).map((exp, index) => (
                          <div key={index} className="text-xs text-slate-400 truncate">• {exp}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
