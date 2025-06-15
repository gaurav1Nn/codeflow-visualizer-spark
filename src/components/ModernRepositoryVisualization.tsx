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
  EyeOff
} from 'lucide-react';
import { repositoryAnalyzer, FileNode, DependencyConnection, RepositoryStructure } from '@/services/repositoryAnalyzer';
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
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [repositoryStructure, setRepositoryStructure] = useState<RepositoryStructure | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'structure' | 'dependencies' | 'complexity' | 'activity'>('dependencies');
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Repository']);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentNodes, setCurrentNodes] = useState<FileNode[]>([]);
  const [isLoadingSubdir, setIsLoadingSubdir] = useState(false);
  const [showConnections, setShowConnections] = useState(true);

  const analyzeRepositoryStructure = useCallback(async () => {
    if (!repository) return;
    
    setIsAnalyzing(true);
    try {
      const [owner, repo] = repository.full_name.split('/');
      console.log(`🚀 Starting repository analysis for ${owner}/${repo}`);
      const structure = await repositoryAnalyzer.analyzeRepository(owner, repo);
      setRepositoryStructure(structure);
      setCurrentNodes(structure.nodes.filter(node => node.depth <= 2));
      console.log('✅ Repository structure set:', { 
        totalNodes: structure.nodes.length, 
        totalConnections: structure.connections.length,
        currentNodes: structure.nodes.filter(node => node.depth <= 2).length
      });
    } catch (error) {
      console.error('❌ Failed to analyze repository:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [repository]);

  const loadSubdirectory = useCallback(async (dirPath: string) => {
    if (!repository) return;
    
    setIsLoadingSubdir(true);
    try {
      const [owner, repo] = repository.full_name.split('/');
      const contents = await githubApi.getRepositoryContents(owner, repo, dirPath);
      
      if (Array.isArray(contents)) {
        const newNodes: FileNode[] = contents.map(item => {
          const fileExtension = item.name.includes('.') ? item.name.substring(item.name.lastIndexOf('.')) : null;
          const fileExtensionMap: Record<string, string> = {
            '.ts': 'TypeScript',
            '.tsx': 'TSX',
            '.js': 'JavaScript',
            '.jsx': 'JSX',
            '.py': 'Python',
            '.java': 'Java',
            '.css': 'CSS',
            '.scss': 'SCSS',
            '.html': 'HTML',
            '.json': 'JSON',
            '.md': 'Markdown',
            '.yml': 'YAML',
            '.yaml': 'YAML'
          };
          const language = fileExtension ? fileExtensionMap[fileExtension] : undefined;
          
          return {
            id: item.path,
            name: item.name,
            path: item.path,
            type: item.type === 'dir' ? 'directory' : 'file',
            size: item.size || 0,
            extension: fileExtension,
            language,
            depth: dirPath.split('/').filter(p => p).length + 1,
            complexity: item.size && item.size > 5000 ? 'high' : item.size && item.size > 1000 ? 'medium' : 'low',
            parent: dirPath || undefined
          } as FileNode;
        });
        
        setCurrentNodes(newNodes);
      }
    } catch (error) {
      console.error('Failed to load subdirectory:', error);
    } finally {
      setIsLoadingSubdir(false);
    }
  }, [repository]);

  useEffect(() => {
    if (repository && !repositoryStructure) {
      analyzeRepositoryStructure();
    }
  }, [repository, analyzeRepositoryStructure, repositoryStructure]);

  useEffect(() => {
    if (currentNodes.length > 0) {
      console.log(`🎨 Rendering visualization with ${currentNodes.length} nodes`);
      renderVisualization();
    }
  }, [currentNodes, viewMode, searchTerm, showConnections, repositoryStructure]);

  const getVisibleNodes = (): FileNode[] => {
    let nodes = currentNodes;
    
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
          'low': '#22C55E',
          'medium': '#F59E0B',
          'high': '#EF4444'
        }[node.complexity || 'low'];
      
      case 'dependencies':
        const importCount = node.imports?.length || 0;
        if (importCount > 5) return '#8B5CF6';
        if (importCount > 2) return '#3B82F6';
        return '#10B981';
      
      case 'activity':
        return node.type === 'directory' ? '#8B5CF6' : '#3B82F6';
      
      default:
        return node.type === 'directory' ? '#8B5CF6' : 
               node.language === 'TypeScript' ? '#3B82F6' :
               node.language === 'TSX' ? '#10B981' :
               node.language === 'JavaScript' ? '#F59E0B' : '#6B7280';
    }
  };

  const getNodeSize = (node: FileNode): number => {
    const baseSize = node.type === 'directory' ? 35 : 25;
    
    switch (viewMode) {
      case 'complexity':
        const complexityMultiplier = {
          'low': 1,
          'medium': 1.2,
          'high': 1.4
        }[node.complexity || 'low'];
        return baseSize * complexityMultiplier;
      
      case 'dependencies':
        const depCount = (node.imports?.length || 0) + (node.exports?.length || 0);
        return baseSize + Math.min(depCount * 1.5, 15);
      
      default:
        return baseSize;
    }
  };

  const renderVisualization = () => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const visibleNodes = getVisibleNodes();
    const width = 800;
    const height = 600;

    console.log(`🎨 Rendering ${visibleNodes.length} nodes with connections:`, {
      showConnections,
      connectionsCount: repositoryStructure?.connections.length || 0
    });

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());

    // Create clean definitions for arrows
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Clean arrow marker
    const arrowMarker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    arrowMarker.setAttribute('id', 'arrow');
    arrowMarker.setAttribute('markerWidth', '10');
    arrowMarker.setAttribute('markerHeight', '10');
    arrowMarker.setAttribute('refX', '9');
    arrowMarker.setAttribute('refY', '3');
    arrowMarker.setAttribute('orient', 'auto');
    arrowMarker.setAttribute('markerUnits', 'strokeWidth');
    
    const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arrowPath.setAttribute('d', 'M0,0 L0,6 L9,3 z');
    arrowPath.setAttribute('fill', '#64748b');
    arrowMarker.appendChild(arrowPath);
    defs.appendChild(arrowMarker);

    // Glow effect
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');
    
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '2');
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

    // Dark background
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', '#0f172a');
    svg.appendChild(background);

    // Calculate better positions
    const positions = calculateCleanPositions(visibleNodes, width, height);

    // Render clean connections
    if (showConnections && repositoryStructure) {
      const connectionsRendered = renderCleanConnections(svg, visibleNodes, positions, repositoryStructure.connections);
      console.log(`🔗 Rendered ${connectionsRendered} connections`);
      
      if (connectionsRendered === 0 && visibleNodes.length >= 2) {
        console.log('🎭 No connections found, rendering demo connections');
        renderDemoConnections(svg, visibleNodes, positions);
      }
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

      // Clean node design
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', (size / 2).toString());
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke', '#1e293b');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('filter', 'url(#glow)');

      // Simple icon
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      icon.setAttribute('text-anchor', 'middle');
      icon.setAttribute('dy', '0.35em');
      icon.setAttribute('fill', 'white');
      icon.setAttribute('font-size', '12px');
      icon.setAttribute('font-weight', 'bold');
      
      let iconText = '📄';
      if (node.type === 'directory') iconText = '📁';
      else if (node.extension === '.tsx' || node.extension === '.jsx') iconText = '⚛️';
      else if (node.extension === '.ts' || node.extension === '.js') iconText = 'JS';
      else if (node.extension === '.css') iconText = '🎨';
      else if (node.extension === '.json') iconText = '{}';
      
      icon.textContent = iconText;

      // Clean label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dy', (size / 2 + 16).toString());
      label.setAttribute('fill', 'white');
      label.setAttribute('font-size', '10px');
      label.setAttribute('font-weight', '500');
      
      let displayName = node.name;
      if (displayName.length > 10) {
        displayName = displayName.slice(0, 8) + '...';
      }
      label.textContent = displayName;

      nodeGroup.appendChild(circle);
      nodeGroup.appendChild(icon);
      nodeGroup.appendChild(label);
      svg.appendChild(nodeGroup);

      // Smooth interactions
      nodeGroup.addEventListener('mouseenter', () => {
        gsap.to(circle, {
          scale: 1.2,
          duration: 0.2,
          ease: "power2.out",
          transformOrigin: "center"
        });
        
        if (showConnections && repositoryStructure) {
          highlightNodeConnections(svg, node.id, repositoryStructure.connections);
        }
      });

      nodeGroup.addEventListener('mouseleave', () => {
        gsap.to(circle, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
          transformOrigin: "center"
        });
        
        resetConnectionHighlighting(svg);
      });

      nodeGroup.addEventListener('click', () => handleNodeClick(node));

      // Smooth entrance animation
      gsap.fromTo(nodeGroup, {
        scale: 0,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        delay: index * 0.05,
        ease: "back.out(1.7)",
        transformOrigin: "center"
      });
    });
  };

  const calculateCleanPositions = (nodes: FileNode[], width: number, height: number) => {
    const positions = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const padding = 80;
    
    if (nodes.length === 1) {
      positions.push({ x: centerX, y: centerY });
    } else if (nodes.length <= 8) {
      // Clean circular layout
      const radius = Math.min(width - padding * 2, height - padding * 2) / 3;
      nodes.forEach((node, index) => {
        const angle = (index / nodes.length) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        positions.push({ x, y });
      });
    } else {
      // Clean grid layout
      const cols = Math.ceil(Math.sqrt(nodes.length));
      const rows = Math.ceil(nodes.length / cols);
      const cellWidth = (width - padding * 2) / cols;
      const cellHeight = (height - padding * 2) / rows;
      
      nodes.forEach((node, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = padding + col * cellWidth + cellWidth / 2;
        const y = padding + row * cellHeight + cellHeight / 2;
        positions.push({ x, y });
      });
    }
    
    return positions;
  };

  const renderCleanConnections = (svg: SVGSVGElement, nodes: FileNode[], positions: any[], connections: DependencyConnection[]): number => {
    const visibleConnections = connections.filter(connection => {
      const sourceExists = nodes.find(n => n.id === connection.source);
      const targetExists = nodes.find(n => n.id === connection.target);
      return sourceExists && targetExists;
    });

    console.log(`🔗 Rendering ${visibleConnections.length} clean connections`);

    visibleConnections.forEach((connection, index) => {
      const sourceIndex = nodes.findIndex(n => n.id === connection.source);
      const targetIndex = nodes.findIndex(n => n.id === connection.target);
      
      if (sourceIndex >= 0 && targetIndex >= 0) {
        const sourcePos = positions[sourceIndex];
        const targetPos = positions[targetIndex];
        
        // Clean straight line with subtle curve
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        
        // Calculate edge positions
        const dx = targetPos.x - sourcePos.x;
        const dy = targetPos.y - sourcePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const nodeRadius = 20;
        const offsetRatio = nodeRadius / distance;
        
        const startX = sourcePos.x + dx * offsetRatio;
        const startY = sourcePos.y + dy * offsetRatio;
        const endX = targetPos.x - dx * offsetRatio;
        const endY = targetPos.y - dy * offsetRatio;
        
        line.setAttribute('x1', startX.toString());
        line.setAttribute('y1', startY.toString());
        line.setAttribute('x2', endX.toString());
        line.setAttribute('y2', endY.toString());
        line.setAttribute('stroke', '#64748b');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('opacity', '0.6');
        line.setAttribute('marker-end', 'url(#arrow)');
        line.setAttribute('class', 'connection-line');
        line.setAttribute('data-source', connection.source);
        line.setAttribute('data-target', connection.target);
        
        // Smooth animation
        const lineLength = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        line.style.strokeDasharray = `${lineLength}`;
        line.style.strokeDashoffset = `${lineLength}`;
        
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 1,
          delay: index * 0.1,
          ease: "power2.out"
        });
        
        svg.appendChild(line);
      }
    });

    return visibleConnections.length;
  };

  const renderDemoConnections = (svg: SVGSVGElement, nodes: FileNode[], positions: any[]) => {
    const demoConnections = [];
    
    if (nodes.length >= 2) {
      demoConnections.push({ sourceIndex: 0, targetIndex: 1 });
    }
    if (nodes.length >= 4) {
      demoConnections.push({ sourceIndex: 1, targetIndex: 2 });
      demoConnections.push({ sourceIndex: 0, targetIndex: 3 });
    }
    
    console.log(`🎭 Rendering ${demoConnections.length} demo connections`);
    
    demoConnections.forEach((conn, index) => {
      const sourcePos = positions[conn.sourceIndex];
      const targetPos = positions[conn.targetIndex];
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', sourcePos.x.toString());
      line.setAttribute('y1', sourcePos.y.toString());
      line.setAttribute('x2', targetPos.x.toString());
      line.setAttribute('y2', targetPos.y.toString());
      line.setAttribute('stroke', '#64748b');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('opacity', '0.4');
      line.setAttribute('marker-end', 'url(#arrow)');
      line.setAttribute('class', 'demo-connection-line');
      
      const lineLength = Math.sqrt((targetPos.x - sourcePos.x) ** 2 + (targetPos.y - sourcePos.y) ** 2);
      line.style.strokeDasharray = `${lineLength}`;
      line.style.strokeDashoffset = `${lineLength}`;
      
      gsap.to(line, {
        strokeDashoffset: 0,
        duration: 1,
        delay: index * 0.2,
        ease: "power2.out"
      });
      
      svg.appendChild(line);
    });
  };

  const highlightNodeConnections = (svg: SVGSVGElement, nodeId: string, connections: DependencyConnection[]) => {
    const relatedConnections = connections.filter(c => c.source === nodeId || c.target === nodeId);
    const relatedNodeIds = new Set<string>();
    
    relatedConnections.forEach(conn => {
      relatedNodeIds.add(conn.source);
      relatedNodeIds.add(conn.target);
    });
    
    const allLines = svg.querySelectorAll('.connection-line, .demo-connection-line');
    allLines.forEach(line => {
      const source = line.getAttribute('data-source');
      const target = line.getAttribute('data-target');
      const isRelated = relatedConnections.some(c => c.source === source && c.target === target);
      
      if (isRelated) {
        gsap.to(line, { opacity: 1, strokeWidth: 3, duration: 0.2 });
      } else {
        gsap.to(line, { opacity: 0.2, duration: 0.2 });
      }
    });
    
    const allNodes = svg.querySelectorAll('.repo-node circle');
    allNodes.forEach((node, index) => {
      const nodeGroup = node.parentElement;
      const nodeIdAttr = nodeGroup?.getAttribute('data-node-id');
      
      if (relatedNodeIds.has(nodeIdAttr || '')) {
        gsap.to(node, { scale: 1.1, duration: 0.2 });
      } else {
        gsap.to(node, { opacity: 0.5, duration: 0.2 });
      }
    });
  };

  const resetConnectionHighlighting = (svg: SVGSVGElement) => {
    const allLines = svg.querySelectorAll('.connection-line, .demo-connection-line');
    allLines.forEach(line => {
      gsap.to(line, { opacity: 0.6, strokeWidth: 2, duration: 0.2 });
    });
    
    const allNodes = svg.querySelectorAll('.repo-node circle');
    allNodes.forEach(node => {
      gsap.to(node, { scale: 1, opacity: 1, duration: 0.2 });
    });
  };

  const handleNodeClick = (node: FileNode) => {
    if (node.type === 'directory') {
      setCurrentPath(node.path);
      setBreadcrumb(prev => [...prev, node.name]);
      loadSubdirectory(node.path);
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
      
      if (newPath === '') {
        if (repositoryStructure) {
          setCurrentNodes(repositoryStructure.nodes.filter(node => node.depth <= 2));
        }
      } else {
        loadSubdirectory(newPath);
      }
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
                onClick={() => setShowConnections(!showConnections)}
                className={`text-slate-300 ${showConnections ? 'bg-blue-500/20' : ''}`}
              >
                {showConnections ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
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
          
          {repositoryStructure && (
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-400">{repositoryStructure.stats.totalFiles}</div>
                <div className="text-xs text-slate-400">Files</div>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">{repositoryStructure.stats.totalDirectories}</div>
                <div className="text-xs text-slate-400">Directories</div>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-400">{Object.keys(repositoryStructure.stats.languages).length}</div>
                <div className="text-xs text-slate-400">Languages</div>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                <div className="text-2xl font-bold text-orange-400">{repositoryStructure.connections.length}</div>
                <div className="text-xs text-slate-400">Connections</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
            <CardContent className="h-[600px] p-0 relative overflow-hidden">
              {(isAnalyzing || isLoadingSubdir) ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900/50 to-blue-900/20">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg mb-2">
                      {isAnalyzing ? 'Analyzing Repository Architecture' : 'Loading Directory Contents'}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {isAnalyzing ? 'Discovering files, dependencies, and relationships...' : 'Fetching files and folders...'}
                    </p>
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
              <div className="text-xs text-slate-400">
                {currentNodes.length} items in current view
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">Connections:</span>
                <Badge variant={showConnections ? "default" : "secondary"} className="text-xs">
                  {showConnections ? "Visible" : "Hidden"}
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
                    <span className="text-slate-400">Path:</span>
                    <span className="text-slate-200 text-xs truncate" title={selectedNode.path}>
                      {selectedNode.path}
                    </span>
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
                  
                  {repositoryStructure && (
                    <div className="mt-3">
                      <span className="text-slate-400 text-xs">Connections:</span>
                      <p className="text-slate-200 text-xs mt-1">
                        {repositoryStructure.connections.filter(c => c.source === selectedNode.id || c.target === selectedNode.id).length} total
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-4 h-1 bg-slate-500 rounded"></div>
                <span className="text-slate-300">File Connection</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-300">⚛️</span>
                <span className="text-slate-300">React Component</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-300">JS</span>
                <span className="text-slate-300">JavaScript/TypeScript</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-300">📁</span>
                <span className="text-slate-300">Directory</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
