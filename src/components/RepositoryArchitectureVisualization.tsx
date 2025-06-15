
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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
  Filter,
  Layers,
  Activity,
  Download,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  extension?: string;
  language?: string;
  imports?: string[];
  exports?: string[];
  x: number;
  y: number;
  depth: number;
}

interface Connection {
  source: string;
  target: string;
  type: 'import' | 'export' | 'dependency' | 'hierarchy';
  strength: number;
}

interface RepositoryStats {
  totalFiles: number;
  totalDirectories: number;
  languages: Record<string, number>;
  connections: number;
}

interface RepositoryArchitectureVisualizationProps {
  repository: any;
  commits: any[];
  contributors: any[];
  branches: any[];
}

export const RepositoryArchitectureVisualization: React.FC<RepositoryArchitectureVisualizationProps> = ({
  repository,
  commits,
  contributors,
  branches
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [nodes, setNodes] = useState<FileNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [stats, setStats] = useState<RepositoryStats>({
    totalFiles: 0,
    totalDirectories: 0,
    languages: {},
    connections: 0
  });
  
  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'structure' | 'dependencies' | 'complexity' | 'activity'>('dependencies');
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Repository']);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentPath, setCurrentPath] = useState('');
  const [showConnections, setShowConnections] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  
  // Mock data generation for demo purposes
  const generateMockData = useCallback(() => {
    const mockNodes: FileNode[] = [
      // Root files
      { id: 'src/App.tsx', name: 'App.tsx', path: 'src/App.tsx', type: 'file', size: 2500, extension: '.tsx', language: 'TypeScript', x: 400, y: 200, depth: 1, imports: ['src/components/Header.tsx', 'src/pages/Index.tsx'], exports: ['App'] },
      { id: 'src/main.tsx', name: 'main.tsx', path: 'src/main.tsx', type: 'file', size: 800, extension: '.tsx', language: 'TypeScript', x: 600, y: 200, depth: 1, imports: ['src/App.tsx'], exports: [] },
      
      // Components
      { id: 'src/components/Header.tsx', name: 'Header.tsx', path: 'src/components/Header.tsx', type: 'file', size: 1200, extension: '.tsx', language: 'TypeScript', x: 200, y: 350, depth: 2, imports: ['src/components/ui/button.tsx'], exports: ['Header'] },
      { id: 'src/components/GitHubIntegration.tsx', name: 'GitHubIntegration.tsx', path: 'src/components/GitHubIntegration.tsx', type: 'file', size: 8500, extension: '.tsx', language: 'TypeScript', x: 350, y: 450, depth: 2, imports: ['src/hooks/useGitHubData.ts', 'src/services/githubApi.ts'], exports: ['GitHubIntegration'] },
      { id: 'src/components/Enhanced3DVisualization.tsx', name: 'Enhanced3DVisualization.tsx', path: 'src/components/Enhanced3DVisualization.tsx', type: 'file', size: 4200, extension: '.tsx', language: 'TypeScript', x: 500, y: 400, depth: 2, imports: ['src/components/Repository3DTree.tsx', 'src/components/CodeFlowParticles.tsx'], exports: ['Enhanced3DVisualization'] },
      
      // Pages
      { id: 'src/pages/Index.tsx', name: 'Index.tsx', path: 'src/pages/Index.tsx', type: 'file', size: 3500, extension: '.tsx', language: 'TypeScript', x: 650, y: 350, depth: 2, imports: ['src/components/Header.tsx', 'src/components/GitHubIntegration.tsx', 'src/components/Enhanced3DVisualization.tsx'], exports: ['Index'] },
      
      // Hooks
      { id: 'src/hooks/useGitHubData.ts', name: 'useGitHubData.ts', path: 'src/hooks/useGitHubData.ts', type: 'file', size: 2800, extension: '.ts', language: 'TypeScript', x: 150, y: 550, depth: 3, imports: ['src/services/githubApi.ts'], exports: ['useGitHubData'] },
      
      // Services
      { id: 'src/services/githubApi.ts', name: 'githubApi.ts', path: 'src/services/githubApi.ts', type: 'file', size: 4500, extension: '.ts', language: 'TypeScript', x: 100, y: 650, depth: 3, imports: [], exports: ['githubApi', 'GitHubRepository', 'GitHubCommit'] },
      
      // UI Components
      { id: 'src/components/ui/button.tsx', name: 'button.tsx', path: 'src/components/ui/button.tsx', type: 'file', size: 900, extension: '.tsx', language: 'TypeScript', x: 50, y: 450, depth: 3, imports: [], exports: ['Button'] },
      { id: 'src/components/ui/card.tsx', name: 'card.tsx', path: 'src/components/ui/card.tsx', type: 'file', size: 1100, extension: '.tsx', language: 'TypeScript', x: 750, y: 500, depth: 3, imports: [], exports: ['Card', 'CardHeader', 'CardContent'] },
      
      // 3D Components
      { id: 'src/components/Repository3DTree.tsx', name: 'Repository3DTree.tsx', path: 'src/components/Repository3DTree.tsx', type: 'file', size: 3200, extension: '.tsx', language: 'TypeScript', x: 400, y: 550, depth: 3, imports: [], exports: ['Repository3DTree'] },
      { id: 'src/components/CodeFlowParticles.tsx', name: 'CodeFlowParticles.tsx', path: 'src/components/CodeFlowParticles.tsx', type: 'file', size: 2600, extension: '.tsx', language: 'TypeScript', x: 600, y: 550, depth: 3, imports: [], exports: ['CodeFlowParticles'] }
    ];

    const mockConnections: Connection[] = [
      // App.tsx connections
      { source: 'src/App.tsx', target: 'src/components/Header.tsx', type: 'import', strength: 1 },
      { source: 'src/App.tsx', target: 'src/pages/Index.tsx', type: 'import', strength: 1 },
      { source: 'src/main.tsx', target: 'src/App.tsx', type: 'import', strength: 1 },
      
      // Header connections
      { source: 'src/components/Header.tsx', target: 'src/components/ui/button.tsx', type: 'import', strength: 1 },
      
      // GitHubIntegration connections
      { source: 'src/components/GitHubIntegration.tsx', target: 'src/hooks/useGitHubData.ts', type: 'import', strength: 1 },
      { source: 'src/components/GitHubIntegration.tsx', target: 'src/services/githubApi.ts', type: 'import', strength: 0.5 },
      
      // Enhanced3DVisualization connections
      { source: 'src/components/Enhanced3DVisualization.tsx', target: 'src/components/Repository3DTree.tsx', type: 'import', strength: 1 },
      { source: 'src/components/Enhanced3DVisualization.tsx', target: 'src/components/CodeFlowParticles.tsx', type: 'import', strength: 1 },
      
      // Index page connections
      { source: 'src/pages/Index.tsx', target: 'src/components/Header.tsx', type: 'import', strength: 1 },
      { source: 'src/pages/Index.tsx', target: 'src/components/GitHubIntegration.tsx', type: 'import', strength: 1 },
      { source: 'src/pages/Index.tsx', target: 'src/components/Enhanced3DVisualization.tsx', type: 'import', strength: 1 },
      
      // Hook connections
      { source: 'src/hooks/useGitHubData.ts', target: 'src/services/githubApi.ts', type: 'import', strength: 1 }
    ];

    const mockStats: RepositoryStats = {
      totalFiles: mockNodes.filter(n => n.type === 'file').length,
      totalDirectories: mockNodes.filter(n => n.type === 'directory').length,
      languages: {
        'TypeScript': mockNodes.filter(n => n.language === 'TypeScript').length,
        'JavaScript': 2,
        'CSS': 1
      },
      connections: mockConnections.length
    };

    setNodes(mockNodes);
    setConnections(mockConnections);
    setStats(mockStats);
    setIsAnalyzing(false);
  }, []);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      generateMockData();
    }, 1500);
  }, [generateMockData]);

  const getNodeColor = (node: FileNode): string => {
    switch (viewMode) {
      case 'complexity':
        if (node.size > 5000) return '#EF4444'; // High complexity - red
        if (node.size > 2000) return '#F59E0B'; // Medium complexity - orange
        return '#10B981'; // Low complexity - green
      
      case 'dependencies':
        const importCount = node.imports?.length || 0;
        if (importCount > 3) return '#8B5CF6'; // Purple for high dependencies
        if (importCount > 1) return '#3B82F6'; // Blue for medium dependencies
        return '#10B981'; // Green for low dependencies
      
      case 'activity':
        return '#F59E0B'; // Orange for activity view
      
      default:
        if (node.language === 'TypeScript') return '#3B82F6';
        if (node.language === 'JavaScript') return '#F59E0B';
        return '#6B7280';
    }
  };

  const getNodeSize = (node: FileNode): number => {
    const baseSize = 20;
    switch (viewMode) {
      case 'complexity':
        return baseSize + Math.min((node.size / 1000) * 5, 25);
      case 'dependencies':
        return baseSize + (node.imports?.length || 0) * 3;
      default:
        return baseSize;
    }
  };

  const filteredNodes = useMemo(() => {
    return nodes.filter(node => 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.path.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [nodes, searchTerm]);

  const renderVisualization = () => {
    if (!svgRef.current || filteredNodes.length === 0) return;

    const svg = svgRef.current;
    const width = 800;
    const height = 600;

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());

    // Create definitions for gradients and markers
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Arrow marker
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
    polygon.setAttribute('fill', '#64748B');
    marker.appendChild(polygon);
    defs.appendChild(marker);

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
    background.setAttribute('fill', '#0f172a');
    svg.appendChild(background);

    // Render connections first (behind nodes)
    if (showConnections) {
      connections.forEach(connection => {
        const sourceNode = filteredNodes.find(n => n.id === connection.source);
        const targetNode = filteredNodes.find(n => n.id === connection.target);
        
        if (sourceNode && targetNode) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', sourceNode.x.toString());
          line.setAttribute('y1', sourceNode.y.toString());
          line.setAttribute('x2', targetNode.x.toString());
          line.setAttribute('y2', targetNode.y.toString());
          line.setAttribute('stroke', connection.type === 'import' ? '#3B82F6' : '#8B5CF6');
          line.setAttribute('stroke-width', (connection.strength * 2).toString());
          line.setAttribute('opacity', '0.6');
          line.setAttribute('marker-end', 'url(#arrowhead)');
          
          // Add connection type styling
          if (connection.type === 'dependency') {
            line.setAttribute('stroke-dasharray', '5,5');
          }
          
          svg.appendChild(line);
        }
      });
    }

    // Render nodes
    filteredNodes.forEach((node, index) => {
      const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      nodeGroup.setAttribute('class', 'repo-node');
      nodeGroup.setAttribute('data-node-id', node.id);
      nodeGroup.setAttribute('transform', `translate(${node.x}, ${node.y})`);
      nodeGroup.style.cursor = 'pointer';

      const size = getNodeSize(node);
      const color = getNodeColor(node);

      // Node circle with glow effect
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', (size / 2).toString());
      circle.setAttribute('fill', color);
      circle.setAttribute('fill-opacity', '0.8');
      circle.setAttribute('stroke', 'rgba(255,255,255,0.3)');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('filter', 'url(#glow)');

      // File type icon
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      icon.setAttribute('text-anchor', 'middle');
      icon.setAttribute('dy', '0.35em');
      icon.setAttribute('fill', 'white');
      icon.setAttribute('font-size', '10px');
      icon.setAttribute('font-weight', 'bold');
      
      let iconText = '📄';
      if (node.type === 'directory') iconText = '📁';
      else if (node.extension === '.tsx' || node.extension === '.jsx') iconText = '⚛️';
      else if (node.extension === '.ts' || node.extension === '.js') iconText = '🔧';
      else if (node.extension === '.css' || node.extension === '.scss') iconText = '🎨';
      
      icon.textContent = iconText;

      // Label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dy', (size / 2 + 15).toString());
      label.setAttribute('fill', 'white');
      label.setAttribute('font-size', '10px');
      label.setAttribute('font-weight', '500');
      
      let displayName = node.name;
      if (displayName.length > 12) {
        displayName = displayName.slice(0, 9) + '...';
      }
      label.textContent = displayName;

      // Connection count badge for dependencies view
      if (viewMode === 'dependencies' && node.imports && node.imports.length > 0) {
        const badge = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        badge.setAttribute('cx', (size / 2 - 5).toString());
        badge.setAttribute('cy', (-size / 2 + 5).toString());
        badge.setAttribute('r', '8');
        badge.setAttribute('fill', '#F59E0B');
        badge.setAttribute('stroke', 'white');
        badge.setAttribute('stroke-width', '2');
        
        const badgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        badgeText.setAttribute('x', (size / 2 - 5).toString());
        badgeText.setAttribute('y', (-size / 2 + 9).toString());
        badgeText.setAttribute('text-anchor', 'middle');
        badgeText.setAttribute('fill', 'white');
        badgeText.setAttribute('font-size', '8px');
        badgeText.setAttribute('font-weight', 'bold');
        badgeText.textContent = node.imports.length.toString();
        
        nodeGroup.appendChild(badge);
        nodeGroup.appendChild(badgeText);
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
        
        // Highlight connected nodes
        if (showConnections) {
          const relatedConnections = connections.filter(c => c.source === node.id || c.target === node.id);
          relatedConnections.forEach(conn => {
            const relatedNodeId = conn.source === node.id ? conn.target : conn.source;
            const relatedNodeElement = svg.querySelector(`[data-node-id="${relatedNodeId}"] circle`);
            if (relatedNodeElement) {
              gsap.to(relatedNodeElement, { scale: 1.1, duration: 0.2 });
            }
          });
        }
      });

      nodeGroup.addEventListener('mouseleave', () => {
        gsap.to(circle, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          transformOrigin: "center"
        });
        
        // Reset all node scales
        const allCircles = svg.querySelectorAll('circle');
        allCircles.forEach(c => {
          gsap.to(c, { scale: 1, duration: 0.2 });
        });
      });

      nodeGroup.addEventListener('click', () => {
        setSelectedNode(node);
        
        // Pulse effect on selection
        gsap.fromTo(circle, 
          { scale: 1 },
          { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.inOut" }
        );
      });

      // Entrance animation with stagger
      gsap.fromTo(nodeGroup, {
        scale: 0,
        opacity: 0,
        rotation: 180
      }, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        delay: index * 0.03,
        ease: "back.out(1.7)"
      });
    });
  };

  useEffect(() => {
    if (filteredNodes.length > 0) {
      renderVisualization();
    }
  }, [filteredNodes, viewMode, showConnections, connections]);

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    const container = containerRef.current;
    if (!container) return;
    
    let newZoom = zoomLevel;
    switch (direction) {
      case 'in':
        newZoom = Math.min(zoomLevel * 1.2, 3);
        break;
      case 'out':
        newZoom = Math.max(zoomLevel / 1.2, 0.5);
        break;
      case 'reset':
        newZoom = 1;
        break;
    }
    
    setZoomLevel(newZoom);
    gsap.to(container.querySelector('svg'), {
      scale: newZoom,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const exportVisualization = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = 800;
    canvas.height = 600;
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = 'repository-architecture.png';
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
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
              <Button
                variant="ghost"
                size="sm"
                onClick={exportVisualization}
                className="text-slate-300"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Stats Display */}
          <div className="grid grid-cols-4 gap-4 text-center mt-4">
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400">{stats.totalFiles}</div>
              <div className="text-xs text-slate-400">Files</div>
            </div>
            <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">{stats.totalDirectories}</div>
              <div className="text-xs text-slate-400">Directories</div>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-400">{Object.keys(stats.languages).length}</div>
              <div className="text-xs text-slate-400">Languages</div>
            </div>
            <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
              <div className="text-2xl font-bold text-orange-400">{stats.connections}</div>
              <div className="text-xs text-slate-400">Connections</div>
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
                    <p className="text-white text-lg mb-2">Analyzing Repository Architecture</p>
                    <p className="text-slate-400 text-sm">Discovering file connections and dependencies...</p>
                  </div>
                </div>
              ) : (
                <div
                  ref={containerRef}
                  className="w-full h-full bg-gradient-to-br from-slate-900/30 to-blue-900/20 relative overflow-hidden"
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
              <CardTitle className="text-white text-sm flex items-center space-x-2">
                <FolderOpen className="w-4 h-4 text-blue-400" />
                <span>Current View</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="outline" className="text-xs">
                {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
              </Badge>
              <div className="text-xs text-slate-400">
                {filteredNodes.length} files displayed
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
                <CardTitle className="text-white text-sm flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>File Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Name:</span>
                    <span className="text-slate-200 font-medium">{selectedNode.name}</span>
                  </div>
                  
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
                    <span className="text-slate-400">Imports:</span>
                    <span className="text-slate-200">{selectedNode.imports?.length || 0}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Exports:</span>
                    <span className="text-slate-200">{selectedNode.exports?.length || 0}</span>
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-slate-400 text-xs">Path:</span>
                    <p className="text-slate-200 text-xs mt-1 break-all">
                      {selectedNode.path}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-slate-300">Import Connection</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-slate-300">Export Connection</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-0.5 bg-slate-500" style={{ borderStyle: 'dashed' }}></div>
                <span className="text-slate-300">Dependency</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-300">⚛️</span>
                <span className="text-slate-300">React Component</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-300">🔧</span>
                <span className="text-slate-300">TypeScript/JavaScript</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
