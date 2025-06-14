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
        name: repository.name,
        type: 'repository',
        size: 150,
        importance: 10,
        connections: ['src', 'config', 'docs', 'tests'],
        position: { x: 400, y: 200 },
        color: '#3B82F6',
        metadata: {
          language: repository.language,
          fileCount: 50,
          lastModified: repository.updated_at,
          contributors: contributors.length,
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
        position: { x: 200, y: 100 },
        color: '#10B981',
        children: [],
        metadata: {
          language: 'TypeScript',
          fileCount: 25,
          contributors: Math.max(1, Math.floor(contributors.length * 0.8)),
          complexity: 'high'
        }
      },
      {
        id: 'components',
        name: 'Components',
        type: 'component',
        size: 100,
        importance: 8,
        connections: ['ui-components', 'features'],
        position: { x: 100, y: 50 },
        color: '#8B5CF6',
        parent: 'src',
        metadata: {
          language: 'TSX',
          fileCount: 15,
          contributors: Math.max(1, Math.floor(contributors.length * 0.6)),
          complexity: 'medium'
        }
      },
      {
        id: 'hooks',
        name: 'Hooks',
        type: 'service',
        size: 80,
        importance: 7,
        connections: ['api-hooks', 'state-hooks'],
        position: { x: 300, y: 50 },
        color: '#F59E0B',
        parent: 'src',
        metadata: {
          language: 'TypeScript',
          fileCount: 8,
          contributors: Math.max(1, Math.floor(contributors.length * 0.4)),
          complexity: 'medium'
        }
      },
      {
        id: 'services',
        name: 'Services',
        type: 'service',
        size: 90,
        importance: 8,
        connections: ['api', 'github-service'],
        position: { x: 150, y: 150 },
        color: '#EF4444',
        parent: 'src',
        metadata: {
          language: 'TypeScript',
          fileCount: 5,
          contributors: Math.max(1, Math.floor(contributors.length * 0.3)),
          complexity: 'high'
        }
      },
      {
        id: 'config',
        name: 'Config',
        type: 'config',
        size: 60,
        importance: 6,
        connections: ['build-config', 'env-config'],
        position: { x: 600, y: 100 },
        color: '#6B7280',
        metadata: {
          language: 'JSON',
          fileCount: 8,
          contributors: Math.max(1, Math.floor(contributors.length * 0.2)),
          complexity: 'low'
        }
      },
      {
        id: 'docs',
        name: 'Documentation',
        type: 'documentation',
        size: 70,
        importance: 5,
        connections: [],
        position: { x: 600, y: 300 },
        color: '#84CC16',
        metadata: {
          language: 'Markdown',
          fileCount: 3,
          contributors: Math.max(1, Math.floor(contributors.length * 0.5)),
          complexity: 'low'
        }
      },
      {
        id: 'tests',
        name: 'Tests',
        type: 'test',
        size: 65,
        importance: 6,
        connections: ['unit-tests', 'integration-tests'],
        position: { x: 200, y: 300 },
        color: '#F97316',
        metadata: {
          language: 'TypeScript',
          fileCount: 12,
          contributors: Math.max(1, Math.floor(contributors.length * 0.4)),
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
          connections: ['GitHubIntegration.tsx', 'RepositoryDashboard.tsx', 'ui-folder'],
          position: { x: 200, y: 150 },
          color: '#8B5CF6',
          metadata: {
            language: 'TSX',
            fileCount: 15,
            complexity: 'high'
          }
        },
        {
          id: 'GitHubIntegration.tsx',
          name: 'GitHubIntegration.tsx',
          type: 'file',
          size: 80,
          importance: 8,
          connections: ['useGitHubData.ts', 'RepositoryDashboard.tsx'],
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
          id: 'RepositoryDashboard.tsx',
          name: 'RepositoryDashboard.tsx',
          type: 'file',
          size: 85,
          importance: 8,
          connections: ['GitHubIntegration.tsx', 'KeyMetricsCards.tsx', 'ContributorAnalytics.tsx'],
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
          connections: ['useGitHubData.ts', 'use-toast.ts'],
          position: { x: 500, y: 150 },
          color: '#F59E0B',
          metadata: {
            language: 'TypeScript',
            fileCount: 3,
            complexity: 'medium'
          }
        },
        {
          id: 'useGitHubData.ts',
          name: 'useGitHubData.ts',
          type: 'file',
          size: 60,
          importance: 7,
          connections: ['GitHubIntegration.tsx', 'githubApi.ts'],
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
          connections: ['githubApi.ts'],
          position: { x: 200, y: 250 },
          color: '#EC4899',
          metadata: {
            language: 'TypeScript',
            fileCount: 1,
            complexity: 'medium'
          }
        },
        {
          id: 'githubApi.ts',
          name: 'githubApi.ts',
          type: 'file',
          size: 55,
          importance: 6,
          connections: ['useGitHubData.ts'],
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
    }

    setNodes(drillDownNodes);
    renderVisualization(drillDownNodes);
  };

  const handleNodeClick = (node: RepositoryNode) => {
    if (node.children !== undefined || ['src', 'components', 'hooks', 'services'].includes(node.id)) {
      // Animate transition
      gsap.to('.repo-node', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          setCurrentLevel(node.id);
          setBreadcrumb([...breadcrumb, node.name]);
        }
      });
    } else {
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
    if (currentLevel !== 'root') {
      gsap.to('.repo-node', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          setCurrentLevel('root');
          setBreadcrumb(['Repository']);
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

    // Create animated background grid
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
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

    const backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    backgroundRect.setAttribute('width', '100%');
    backgroundRect.setAttribute('height', '100%');
    backgroundRect.setAttribute('fill', 'url(#grid)');
    svg.appendChild(backgroundRect);

    // Create animated connections with import/export relationships
    nodeList.forEach((node) => {
      node.connections.forEach((connectionId) => {
        const targetNode = nodeList.find(n => n.id === connectionId);
        if (targetNode) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', node.position.x.toString());
          line.setAttribute('y1', node.position.y.toString());
          line.setAttribute('x2', targetNode.position.x.toString());
          line.setAttribute('y2', targetNode.position.y.toString());
          line.setAttribute('stroke', '#475569');
          line.setAttribute('stroke-width', '3');
          line.setAttribute('opacity', '0.4');
          line.setAttribute('class', 'connection-line');
          
          // Add directional arrow for imports/exports
          const arrowMarker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
          arrowMarker.setAttribute('id', `arrow-${node.id}-${connectionId}`);
          arrowMarker.setAttribute('viewBox', '0 0 10 10');
          arrowMarker.setAttribute('refX', '5');
          arrowMarker.setAttribute('refY', '3');
          arrowMarker.setAttribute('markerWidth', '6');
          arrowMarker.setAttribute('markerHeight', '6');
          arrowMarker.setAttribute('orient', 'auto');
          
          const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          arrowPath.setAttribute('d', 'M0,0 L0,6 L9,3 z');
          arrowPath.setAttribute('fill', '#475569');
          arrowMarker.appendChild(arrowPath);
          defs.appendChild(arrowMarker);
          
          line.setAttribute('marker-end', `url(#arrow-${node.id}-${connectionId})`);
          
          // Add animated flow effect
          gsap.fromTo(line, 
            { strokeDasharray: "10,10", strokeDashoffset: 20 },
            { strokeDashoffset: 0, duration: 3, ease: "none", repeat: -1 }
          );
          
          svg.appendChild(line);
        }
      });
    });

    // Create repository nodes with enhanced interactions
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
      circle.setAttribute('stroke-width', '4');
      circle.style.filter = 'drop-shadow(0px 6px 20px rgba(0,0,0,0.5))';

      // Add clickable indicator for expandable nodes
      if (node.children !== undefined || ['src', 'components', 'hooks', 'services'].includes(node.id)) {
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

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '0.35em');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', '12px');
      text.setAttribute('font-weight', '700');
      text.textContent = node.name.length > 10 ? node.name.slice(0, 8) + '...' : node.name;

      // File count display
      if (node.metadata.fileCount) {
        const metaText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        metaText.setAttribute('text-anchor', 'middle');
        metaText.setAttribute('dy', (radius + 20).toString());
        metaText.setAttribute('fill', '#94A3B8');
        metaText.setAttribute('font-size', '10px');
        metaText.textContent = `${node.metadata.fileCount} files`;
        nodeGroup.appendChild(metaText);
      }

      nodeGroup.appendChild(circle);
      nodeGroup.appendChild(text);
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

      // Entrance animation
      gsap.fromTo(nodeGroup, {
        scale: 0,
        opacity: 0,
        rotation: node.importance * 20
      }, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1 + (index * 0.1),
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
