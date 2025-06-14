import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Network, 
  Code2, 
  GitBranch, 
  Layers,
  Zap,
  Target,
  Activity,
  FileText,
  Database,
  Settings,
  Package,
  Star,
  GitFork,
  Users,
  Calendar,
  TrendingUp,
  Eye,
  Download,
  ArrowLeft,
  FolderOpen
} from 'lucide-react';

interface RepositoryNode {
  id: string;
  name: string;
  type: 'repository' | 'component' | 'service' | 'config' | 'test' | 'asset' | 'documentation' | 'file';
  size: number;
  importance: number;
  connections: string[];
  position: { x: number; y: number };
  color: string;
  parent?: string;
  children?: RepositoryNode[];
  metadata: {
    language?: string;
    fileCount?: number;
    lastModified?: string;
    contributors?: number;
    complexity?: 'low' | 'medium' | 'high';
    extension?: string;
    imports?: string[];
    exports?: string[];
  };
}

interface RepositoryCodeVisualizationProps {
  repository: any;
  commits: any[];
  contributors: any[];
  branches: any[];
}

export const RepositoryCodeVisualization: React.FC<RepositoryCodeVisualizationProps> = ({ 
  repository, 
  commits,
  contributors,
  branches
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<RepositoryNode | null>(null);
  const [nodes, setNodes] = useState<RepositoryNode[]>([]);
  const [currentLevel, setCurrentLevel] = useState<string>('root');
  const [viewMode, setViewMode] = useState<'structure' | 'complexity' | 'activity'>('structure');
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Repository']);

  useEffect(() => {
    generateRepositoryStructure();
  }, [repository, commits, contributors, viewMode, currentLevel]);

  const generateRepositoryStructure = () => {
    if (currentLevel === 'root') {
      generateRootStructure();
    } else {
      generateDrillDownStructure(currentLevel);
    }
  };

  const generateRootStructure = () => {
    const repositoryNodes: RepositoryNode[] = [
      {
        id: 'repo-root',
        name: repository?.name || 'Repository',
        type: 'repository',
        size: 150,
        importance: 10,
        connections: ['src', 'config', 'docs', 'tests'],
        position: { x: 400, y: 250 },
        color: '#3B82F6',
        metadata: {
          language: repository?.language || 'TypeScript',
          fileCount: 50,
          lastModified: repository?.updated_at,
          contributors: contributors?.length || 0,
          complexity: 'high'
        }
      },
      {
        id: 'src',
        name: 'src/',
        type: 'component',
        size: 120,
        importance: 9,
        connections: ['components', 'hooks', 'services', 'utils'],
        position: { x: 200, y: 150 },
        color: '#10B981',
        children: [],
        metadata: {
          language: 'TypeScript',
          fileCount: 25,
          contributors: Math.max(1, Math.floor((contributors?.length || 1) * 0.8)),
          complexity: 'high'
        }
      },
      {
        id: 'components',
        name: 'components/',
        type: 'component',
        size: 100,
        importance: 8,
        connections: ['ui-components', 'features'],
        position: { x: 100, y: 100 },
        color: '#8B5CF6',
        parent: 'src',
        children: [],
        metadata: {
          language: 'TSX',
          fileCount: 15,
          contributors: Math.max(1, Math.floor((contributors?.length || 1) * 0.6)),
          complexity: 'medium'
        }
      },
      {
        id: 'hooks',
        name: 'hooks/',
        type: 'service',
        size: 80,
        importance: 7,
        connections: ['api-hooks', 'state-hooks'],
        position: { x: 300, y: 100 },
        color: '#F59E0B',
        parent: 'src',
        children: [],
        metadata: {
          language: 'TypeScript',
          fileCount: 8,
          contributors: Math.max(1, Math.floor((contributors?.length || 1) * 0.4)),
          complexity: 'medium'
        }
      },
      {
        id: 'services',
        name: 'services/',
        type: 'service',
        size: 90,
        importance: 8,
        connections: ['api', 'github-service'],
        position: { x: 150, y: 200 },
        color: '#EF4444',
        parent: 'src',
        children: [],
        metadata: {
          language: 'TypeScript',
          fileCount: 5,
          contributors: Math.max(1, Math.floor((contributors?.length || 1) * 0.3)),
          complexity: 'high'
        }
      },
      {
        id: 'config',
        name: 'config/',
        type: 'config',
        size: 60,
        importance: 6,
        connections: ['build-config', 'env-config'],
        position: { x: 600, y: 150 },
        color: '#6B7280',
        metadata: {
          language: 'JSON',
          fileCount: 8,
          contributors: Math.max(1, Math.floor((contributors?.length || 1) * 0.2)),
          complexity: 'low'
        }
      },
      {
        id: 'docs',
        name: 'docs/',
        type: 'documentation',
        size: 70,
        importance: 5,
        connections: [],
        position: { x: 600, y: 350 },
        color: '#84CC16',
        metadata: {
          language: 'Markdown',
          fileCount: 3,
          contributors: Math.max(1, Math.floor((contributors?.length || 1) * 0.5)),
          complexity: 'low'
        }
      },
      {
        id: 'tests',
        name: 'tests/',
        type: 'test',
        size: 65,
        importance: 6,
        connections: ['unit-tests', 'integration-tests'],
        position: { x: 200, y: 350 },
        color: '#F97316',
        metadata: {
          language: 'TypeScript',
          fileCount: 12,
          contributors: Math.max(1, Math.floor((contributors?.length || 1) * 0.4)),
          complexity: 'medium'
        }
      }
    ];

    setNodes(repositoryNodes);
    renderVisualization(repositoryNodes);
  };

  const generateDrillDownStructure = (parentId: string) => {
    let drillDownNodes: RepositoryNode[] = [];
    
    if (parentId === 'src') {
      drillDownNodes = [
        {
          id: 'components-dir',
          name: 'components/',
          type: 'component',
          size: 100,
          importance: 9,
          connections: ['GitHubIntegration', 'RepositoryDashboard', 'ui-folder'],
          position: { x: 200, y: 150 },
          color: '#8B5CF6',
          children: [],
          metadata: {
            language: 'TSX',
            fileCount: 15,
            complexity: 'high'
          }
        },
        {
          id: 'GitHubIntegration',
          name: 'GitHubIntegration.tsx',
          type: 'file',
          size: 80,
          importance: 8,
          connections: ['useGitHubData', 'RepositoryDashboard'],
          position: { x: 100, y: 80 },
          color: '#3B82F6',
          parent: 'components-dir',
          metadata: {
            language: 'TSX',
            extension: 'tsx',
            complexity: 'high',
            imports: ['useGitHubData', 'RepositoryDashboard', 'gsap'],
            exports: ['GitHubIntegration']
          }
        },
        {
          id: 'RepositoryDashboard',
          name: 'RepositoryDashboard.tsx',
          type: 'file',
          size: 85,
          importance: 8,
          connections: ['KeyMetricsCards', 'ContributorAnalytics', 'CodeActivityCharts'],
          position: { x: 300, y: 80 },
          color: '#10B981',
          parent: 'components-dir',
          metadata: {
            language: 'TSX',
            extension: 'tsx',
            complexity: 'high',
            imports: ['KeyMetricsCards', 'ContributorAnalytics', 'gsap'],
            exports: ['RepositoryDashboard']
          }
        },
        {
          id: 'hooks-dir',
          name: 'hooks/',
          type: 'service',
          size: 70,
          importance: 7,
          connections: ['useGitHubData', 'use-toast'],
          position: { x: 500, y: 150 },
          color: '#F59E0B',
          children: [],
          metadata: {
            language: 'TypeScript',
            fileCount: 3,
            complexity: 'medium'
          }
        },
        {
          id: 'useGitHubData',
          name: 'useGitHubData.ts',
          type: 'file',
          size: 60,
          importance: 7,
          connections: ['githubApi'],
          position: { x: 450, y: 80 },
          color: '#EF4444',
          parent: 'hooks-dir',
          metadata: {
            language: 'TypeScript',
            extension: 'ts',
            complexity: 'medium',
            imports: ['githubApi', 'react-query'],
            exports: ['useGitHubData']
          }
        },
        {
          id: 'services-dir',
          name: 'services/',
          type: 'service',
          size: 65,
          importance: 6,
          connections: ['githubApi'],
          position: { x: 200, y: 250 },
          color: '#EC4899',
          children: [],
          metadata: {
            language: 'TypeScript',
            fileCount: 1,
            complexity: 'medium'
          }
        },
        {
          id: 'githubApi',
          name: 'githubApi.ts',
          type: 'file',
          size: 55,
          importance: 6,
          connections: [],
          position: { x: 150, y: 320 },
          color: '#F97316',
          parent: 'services-dir',
          metadata: {
            language: 'TypeScript',
            extension: 'ts',
            complexity: 'medium',
            imports: ['fetch', 'types'],
            exports: ['githubApi', 'GitHubFileContent']
          }
        }
      ];
    } else if (parentId === 'components') {
      drillDownNodes = [
        {
          id: 'GitHubIntegration-file',
          name: 'GitHubIntegration.tsx',
          type: 'file',
          size: 80,
          importance: 9,
          connections: ['useGitHubData-hook', 'RepositoryDashboard-file'],
          position: { x: 150, y: 100 },
          color: '#3B82F6',
          metadata: {
            language: 'TSX',
            extension: 'tsx',
            complexity: 'high',
            imports: ['useGitHubData', 'RepositoryDashboard', 'gsap', 'Card', 'Button'],
            exports: ['GitHubIntegration']
          }
        },
        {
          id: 'RepositoryDashboard-file',
          name: 'RepositoryDashboard.tsx',
          type: 'file',
          size: 85,
          importance: 9,
          connections: ['KeyMetricsCards-file', 'ContributorAnalytics-file', 'CodeActivityCharts-file'],
          position: { x: 400, y: 100 },
          color: '#10B981',
          metadata: {
            language: 'TSX',
            extension: 'tsx',
            complexity: 'high',
            imports: ['KeyMetricsCards', 'ContributorAnalytics', 'CodeActivityCharts', 'Tabs'],
            exports: ['RepositoryDashboard']
          }
        },
        {
          id: 'RepositoryCodeVisualization-file',
          name: 'RepositoryCodeVisualization.tsx',
          type: 'file',
          size: 90,
          importance: 8,
          connections: ['gsap-lib'],
          position: { x: 650, y: 100 },
          color: '#8B5CF6',
          metadata: {
            language: 'TSX',
            extension: 'tsx',
            complexity: 'high',
            imports: ['gsap', 'Card', 'Button', 'Badge'],
            exports: ['RepositoryCodeVisualization']
          }
        },
        {
          id: 'ui-folder',
          name: 'ui/',
          type: 'component',
          size: 70,
          importance: 7,
          connections: ['card-component', 'button-component', 'badge-component'],
          position: { x: 300, y: 250 },
          color: '#F59E0B',
          children: [],
          metadata: {
            language: 'TSX',
            fileCount: 20,
            complexity: 'medium'
          }
        },
        {
          id: 'dashboard-folder',
          name: 'dashboard/',
          type: 'component',
          size: 75,
          importance: 8,
          connections: ['KeyMetricsCards-file', 'ContributorAnalytics-file'],
          position: { x: 150, y: 250 },
          color: '#EC4899',
          children: [],
          metadata: {
            language: 'TSX',
            fileCount: 5,
            complexity: 'high'
          }
        },
        {
          id: 'KeyMetricsCards-file',
          name: 'KeyMetricsCards.tsx',
          type: 'file',
          size: 60,
          importance: 7,
          connections: ['Card', 'recharts'],
          position: { x: 50, y: 350 },
          color: '#06B6D4',
          parent: 'dashboard-folder',
          metadata: {
            language: 'TSX',
            extension: 'tsx',
            complexity: 'medium',
            imports: ['Card', 'recharts', 'Badge'],
            exports: ['KeyMetricsCards']
          }
        },
        {
          id: 'ContributorAnalytics-file',
          name: 'ContributorAnalytics.tsx',
          type: 'file',
          size: 65,
          importance: 7,
          connections: ['recharts', 'Avatar'],
          position: { x: 250, y: 350 },
          color: '#84CC16',
          parent: 'dashboard-folder',
          metadata: {
            language: 'TSX',
            extension: 'tsx',
            complexity: 'medium',
            imports: ['recharts', 'Avatar', 'Card'],
            exports: ['ContributorAnalytics']
          }
        }
      ];
    }

    setNodes(drillDownNodes);
    renderVisualization(drillDownNodes);
  };

  const handleNodeClick = (node: RepositoryNode) => {
    console.log('Node clicked:', node.id, node);
    
    // Check if this node can be expanded
    const canExpand = node.children !== undefined || 
                     ['src', 'components', 'hooks', 'services', 'components-dir'].includes(node.id);
    
    if (canExpand) {
      console.log('Expanding node:', node.id);
      
      // Animate transition out
      gsap.to('.repo-node', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          console.log('Transition complete, setting level to:', node.id);
          setCurrentLevel(node.id);
          setBreadcrumb(prev => {
            const newBreadcrumb = [...prev, node.name];
            console.log('New breadcrumb:', newBreadcrumb);
            return newBreadcrumb;
          });
        }
      });
    } else {
      // Just select the node for details
      setSelectedNode(node);
      gsap.to(`[data-node-id="${node.id}"]`, {
        scale: 1.4,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  };

  const handleBackNavigation = () => {
    console.log('Back navigation clicked, current level:', currentLevel);
    
    if (currentLevel !== 'root') {
      gsap.to('.repo-node', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          // Determine the parent level
          let newLevel = 'root';
          let newBreadcrumb = ['Repository'];
          
          if (currentLevel === 'components') {
            newLevel = 'src';
            newBreadcrumb = ['Repository', 'src/'];
          }
          
          console.log('Setting new level:', newLevel);
          setCurrentLevel(newLevel);
          setBreadcrumb(newBreadcrumb);
        }
      });
    }
  };

  const renderVisualization = (nodeList: RepositoryNode[]) => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const width = 800;
    const height = 500;

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());

    // Create defs for patterns and markers
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Grid pattern
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', 'grid');
    pattern.setAttribute('width', '50');
    pattern.setAttribute('height', '50');
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 50 0 L 0 0 0 50');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#334155');
    path.setAttribute('stroke-width', '1');
    path.setAttribute('opacity', '0.2');
    
    pattern.appendChild(path);
    defs.appendChild(pattern);
    svg.appendChild(defs);

    // Background
    const backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    backgroundRect.setAttribute('width', '100%');
    backgroundRect.setAttribute('height', '100%');
    backgroundRect.setAttribute('fill', 'url(#grid)');
    svg.appendChild(backgroundRect);

    // Create arrow marker for connections
    const arrowMarker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    arrowMarker.setAttribute('id', 'arrowhead');
    arrowMarker.setAttribute('markerWidth', '10');
    arrowMarker.setAttribute('markerHeight', '7');
    arrowMarker.setAttribute('refX', '9');
    arrowMarker.setAttribute('refY', '3.5');
    arrowMarker.setAttribute('orient', 'auto');
    
    const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    arrowPath.setAttribute('points', '0 0, 10 3.5, 0 7');
    arrowPath.setAttribute('fill', '#64748B');
    arrowMarker.appendChild(arrowPath);
    defs.appendChild(arrowMarker);

    // Create connections with proper arrows
    nodeList.forEach((node) => {
      node.connections.forEach((connectionId) => {
        const targetNode = nodeList.find(n => n.id === connectionId || n.name.includes(connectionId));
        if (targetNode) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', node.position.x.toString());
          line.setAttribute('y1', node.position.y.toString());
          line.setAttribute('x2', targetNode.position.x.toString());
          line.setAttribute('y2', targetNode.position.y.toString());
          line.setAttribute('stroke', '#64748B');
          line.setAttribute('stroke-width', '2');
          line.setAttribute('opacity', '0.6');
          line.setAttribute('marker-end', 'url(#arrowhead)');
          line.setAttribute('class', 'connection-line');
          
          // Animate connections
          gsap.fromTo(line, 
            { strokeDasharray: "5,5", strokeDashoffset: 10 },
            { strokeDashoffset: 0, duration: 2, ease: "none", repeat: -1 }
          );
          
          svg.appendChild(line);
        }
      });
    });

    // Create nodes
    nodeList.forEach((node, index) => {
      const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      nodeGroup.setAttribute('class', 'repo-node');
      nodeGroup.setAttribute('data-node-id', node.id);
      nodeGroup.setAttribute('transform', `translate(${node.position.x}, ${node.position.y})`);
      nodeGroup.style.cursor = 'pointer';

      const radius = Math.max(25, node.size / 3);
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', radius.toString());
      circle.setAttribute('fill', node.color);
      circle.setAttribute('stroke', '#1E293B');
      circle.setAttribute('stroke-width', '3');
      circle.style.filter = 'drop-shadow(0px 4px 12px rgba(0,0,0,0.4))';

      // Expandable indicator
      const canExpand = node.children !== undefined || 
                       ['src', 'components', 'hooks', 'services', 'components-dir'].includes(node.id);
      
      if (canExpand) {
        const expandIndicator = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        expandIndicator.setAttribute('r', '8');
        expandIndicator.setAttribute('cx', (radius - 8).toString());
        expandIndicator.setAttribute('cy', (-radius + 8).toString());
        expandIndicator.setAttribute('fill', '#10B981');
        expandIndicator.setAttribute('stroke', 'white');
        expandIndicator.setAttribute('stroke-width', '2');
        
        const expandIcon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        expandIcon.setAttribute('x', (radius - 8).toString());
        expandIcon.setAttribute('y', (-radius + 12).toString());
        expandIcon.setAttribute('text-anchor', 'middle');
        expandIcon.setAttribute('fill', 'white');
        expandIcon.setAttribute('font-size', '10px');
        expandIcon.setAttribute('font-weight', 'bold');
        expandIcon.textContent = '+';
        
        nodeGroup.appendChild(expandIndicator);
        nodeGroup.appendChild(expandIcon);
      }

      // Node label with proper text wrapping
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '0.35em');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', '11px');
      text.setAttribute('font-weight', '600');
      
      // Better text handling for file names
      let displayName = node.name;
      if (displayName.length > 12) {
        if (displayName.includes('.')) {
          const parts = displayName.split('.');
          const extension = parts.pop();
          const baseName = parts.join('.');
          if (baseName.length > 8) {
            displayName = baseName.slice(0, 8) + '...' + (extension ? '.' + extension : '');
          }
        } else {
          displayName = displayName.slice(0, 10) + '...';
        }
      }
      text.textContent = displayName;

      // File count or metadata
      if (node.metadata.fileCount) {
        const metaText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        metaText.setAttribute('text-anchor', 'middle');
        metaText.setAttribute('dy', (radius + 20).toString());
        metaText.setAttribute('fill', '#94A3B8');
        metaText.setAttribute('font-size', '9px');
        metaText.textContent = `${node.metadata.fileCount} files`;
        nodeGroup.appendChild(metaText);
      }

      nodeGroup.appendChild(circle);
      nodeGroup.appendChild(text);
      svg.appendChild(nodeGroup);

      // Enhanced interactions
      nodeGroup.addEventListener('mouseenter', () => {
        gsap.to(circle, {
          scale: 1.15,
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

      // Entrance animation
      gsap.fromTo(nodeGroup, {
        scale: 0,
        opacity: 0,
        rotation: node.importance * 10
      }, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.8 + (index * 0.1),
        delay: index * 0.15,
        ease: "elastic.out(1, 0.5)",
        transformOrigin: "center"
      });
    });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'repository': '#3B82F6',
      'component': '#10B981',
      'service': '#F59E0B',
      'config': '#6B7280',
      'test': '#F97316',
      'asset': '#84CC16',
      'documentation': '#8B5CF6',
      'file': '#CBD5E1'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'repository': <Database className="w-4 h-4" />,
      'component': <Code2 className="w-4 h-4" />,
      'service': <Zap className="w-4 h-4" />,
      'config': <Settings className="w-4 h-4" />,
      'test': <Target className="w-4 h-4" />,
      'asset': <Package className="w-4 h-4" />,
      'documentation': <FileText className="w-4 h-4" />,
      'file': <FileText className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || <Activity className="w-4 h-4" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Visualization Canvas */}
      <div className="lg:col-span-3">
        <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Network className="w-5 h-5 text-blue-400" />
                  <span>Repository Architecture</span>
                </CardTitle>
                
                {/* Breadcrumb Navigation */}
                <div className="flex items-center space-x-2 text-sm">
                  {breadcrumb.map((crumb, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <span className="text-slate-500">/</span>}
                      <span className={index === breadcrumb.length - 1 ? "text-blue-300" : "text-slate-400"}>
                        {crumb}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {currentLevel !== 'root' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackNavigation}
                    className="text-slate-300 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                
                {(['structure', 'complexity', 'activity'] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode(mode)}
                    className={`text-xs ${viewMode === mode ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:text-white'}`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[500px] flex items-center justify-center">
            <div
              ref={containerRef}
              className="w-full h-full bg-gradient-to-br from-slate-900/30 to-blue-900/20 rounded-lg overflow-hidden relative"
            >
              <svg
                ref={svgRef}
                className="w-full h-full"
                style={{ background: "transparent" }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Repository Details Panel */}
      <div className="space-y-4">
        {/* Repository Overview */}
        <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Current Level</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <FolderOpen className="w-4 h-4 text-blue-400" />
              <span className="text-white font-medium">{breadcrumb[breadcrumb.length - 1]}</span>
            </div>
            <div className="text-xs text-slate-400">
              Click on nodes with + indicators to explore deeper into the structure
            </div>
          </CardContent>
        </Card>

        {/* Selected Node Details */}
        <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Node Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center space-x-2">
                  <div style={{ color: selectedNode.color }}>
                    {getTypeIcon(selectedNode.type)}
                  </div>
                  <span className="text-white font-medium text-sm">{selectedNode.name}</span>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                      {selectedNode.type}
                    </Badge>
                  </div>
                  
                  {selectedNode.metadata.language && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Language:</span>
                      <span className="text-slate-200">{selectedNode.metadata.language}</span>
                    </div>
                  )}
                  
                  {selectedNode.metadata.imports && (
                    <div className="pt-2 border-t border-slate-600/50">
                      <h4 className="text-slate-300 font-medium text-xs mb-2">Imports:</h4>
                      <div className="space-y-1">
                        {selectedNode.metadata.imports.slice(0, 3).map((imp, index) => (
                          <div key={index} className="text-xs text-slate-400">• {imp}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedNode.metadata.exports && (
                    <div className="pt-2 border-t border-slate-600/50">
                      <h4 className="text-slate-300 font-medium text-xs mb-2">Exports:</h4>
                      <div className="space-y-1">
                        {selectedNode.metadata.exports.slice(0, 3).map((exp, index) => (
                          <div key={index} className="text-xs text-slate-400">• {exp}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Eye className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-xs">Click on a node to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
