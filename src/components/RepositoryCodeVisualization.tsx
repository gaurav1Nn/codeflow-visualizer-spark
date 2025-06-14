
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
  Download
} from 'lucide-react';

interface RepositoryNode {
  id: string;
  name: string;
  type: 'repository' | 'component' | 'service' | 'config' | 'test' | 'asset' | 'documentation';
  size: number;
  importance: number;
  connections: string[];
  position: { x: number; y: number };
  color: string;
  metadata: {
    language?: string;
    fileCount?: number;
    lastModified?: string;
    contributors?: number;
    complexity?: 'low' | 'medium' | 'high';
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
  const [viewMode, setViewMode] = useState<'structure' | 'complexity' | 'activity'>('structure');

  useEffect(() => {
    generateRepositoryStructure();
  }, [repository, commits, contributors, viewMode]);

  const generateRepositoryStructure = () => {
    const repositoryNodes: RepositoryNode[] = [
      // Main repository node
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
      // Source code structure
      {
        id: 'src',
        name: 'src/',
        type: 'component',
        size: 120,
        importance: 9,
        connections: ['components', 'hooks', 'services', 'utils'],
        position: { x: 200, y: 100 },
        color: '#10B981',
        metadata: {
          language: 'TypeScript',
          fileCount: 25,
          contributors: Math.max(1, Math.floor(contributors.length * 0.8)),
          complexity: 'high'
        }
      },
      // Components
      {
        id: 'components',
        name: 'Components',
        type: 'component',
        size: 100,
        importance: 8,
        connections: ['ui-components', 'features'],
        position: { x: 100, y: 50 },
        color: '#8B5CF6',
        metadata: {
          language: 'TSX',
          fileCount: 15,
          contributors: Math.max(1, Math.floor(contributors.length * 0.6)),
          complexity: 'medium'
        }
      },
      // Hooks and logic
      {
        id: 'hooks',
        name: 'Hooks',
        type: 'service',
        size: 80,
        importance: 7,
        connections: ['api-hooks', 'state-hooks'],
        position: { x: 300, y: 50 },
        color: '#F59E0B',
        metadata: {
          language: 'TypeScript',
          fileCount: 8,
          contributors: Math.max(1, Math.floor(contributors.length * 0.4)),
          complexity: 'medium'
        }
      },
      // Services
      {
        id: 'services',
        name: 'Services',
        type: 'service',
        size: 90,
        importance: 8,
        connections: ['api', 'github-service'],
        position: { x: 150, y: 150 },
        color: '#EF4444',
        metadata: {
          language: 'TypeScript',
          fileCount: 5,
          contributors: Math.max(1, Math.floor(contributors.length * 0.3)),
          complexity: 'high'
        }
      },
      // Configuration
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
      // Documentation
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
      // Tests
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

    // Adjust node sizes and colors based on view mode
    if (viewMode === 'complexity') {
      repositoryNodes.forEach(node => {
        const complexityMultiplier = {
          'low': 0.8,
          'medium': 1,
          'high': 1.3
        };
        node.size *= complexityMultiplier[node.metadata.complexity || 'medium'];
      });
    } else if (viewMode === 'activity') {
      repositoryNodes.forEach(node => {
        const activityMultiplier = (node.metadata.contributors || 1) / Math.max(1, contributors.length);
        node.size *= (0.7 + activityMultiplier * 0.6);
      });
    }

    setNodes(repositoryNodes);
    renderVisualization(repositoryNodes);
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

    // Create connections with animated flow
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
          
          // Add animated flow effect
          gsap.fromTo(line, 
            { strokeDasharray: "10,10", strokeDashoffset: 20 },
            { strokeDashoffset: 0, duration: 3, ease: "none", repeat: -1 }
          );
          
          svg.appendChild(line);
        }
      });
    });

    // Create repository nodes
    nodeList.forEach((node, index) => {
      const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      nodeGroup.setAttribute('class', 'repo-node');
      nodeGroup.setAttribute('transform', `translate(${node.position.x}, ${node.position.y})`);
      nodeGroup.style.cursor = 'pointer';

      // Create main circle with repository-specific styling
      const radius = Math.max(25, node.size / 3);
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', radius.toString());
      circle.setAttribute('fill', node.color);
      circle.setAttribute('stroke', '#1E293B');
      circle.setAttribute('stroke-width', '4');
      circle.style.filter = 'drop-shadow(0px 6px 20px rgba(0,0,0,0.5))';

      // Create importance indicator ring
      const importanceRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      importanceRing.setAttribute('r', (radius + 8).toString());
      importanceRing.setAttribute('fill', 'none');
      importanceRing.setAttribute('stroke', node.color);
      importanceRing.setAttribute('stroke-width', Math.max(2, node.importance / 3).toString());
      importanceRing.setAttribute('opacity', '0.3');
      importanceRing.setAttribute('stroke-dasharray', `${node.importance * 5},5`);

      // Create text label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '0.35em');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', '12px');
      text.setAttribute('font-weight', '700');
      text.textContent = node.name.length > 10 ? node.name.slice(0, 8) + '...' : node.name;

      // Create type indicator with icon
      const typeIndicator = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      typeIndicator.setAttribute('r', '6');
      typeIndicator.setAttribute('cx', (radius - 8).toString());
      typeIndicator.setAttribute('cy', (-radius + 8).toString());
      typeIndicator.setAttribute('fill', getTypeColor(node.type));
      typeIndicator.setAttribute('stroke', 'white');
      typeIndicator.setAttribute('stroke-width', '2');

      // Metadata display
      if (node.metadata.fileCount) {
        const metaText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        metaText.setAttribute('text-anchor', 'middle');
        metaText.setAttribute('dy', (radius + 20).toString());
        metaText.setAttribute('fill', '#94A3B8');
        metaText.setAttribute('font-size', '10px');
        metaText.textContent = `${node.metadata.fileCount} files`;
        nodeGroup.appendChild(metaText);
      }

      nodeGroup.appendChild(importanceRing);
      nodeGroup.appendChild(circle);
      nodeGroup.appendChild(text);
      nodeGroup.appendChild(typeIndicator);
      svg.appendChild(nodeGroup);

      // Enhanced interactions
      nodeGroup.addEventListener('mouseenter', () => {
        gsap.to(circle, {
          scale: 1.3,
          duration: 0.3,
          ease: "back.out(1.7)",
          transformOrigin: "center"
        });
        
        gsap.to(importanceRing, {
          opacity: 0.8,
          scale: 1.2,
          duration: 0.3,
          ease: "power2.out",
          transformOrigin: "center"
        });

        // Highlight connections
        const connectedLines = svg.querySelectorAll('.connection-line');
        connectedLines.forEach(line => {
          gsap.to(line, { opacity: 0.1, duration: 0.2 });
        });
      });

      nodeGroup.addEventListener('mouseleave', () => {
        gsap.to(circle, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          transformOrigin: "center"
        });
        
        gsap.to(importanceRing, {
          opacity: 0.3,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          transformOrigin: "center"
        });

        const connectedLines = svg.querySelectorAll('.connection-line');
        connectedLines.forEach(line => {
          gsap.to(line, { opacity: 0.4, duration: 0.2 });
        });
      });

      nodeGroup.addEventListener('click', () => {
        setSelectedNode(node);
        
        gsap.to(circle, {
          scale: 1.4,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
          transformOrigin: "center"
        });
      });

      // Repository-specific entrance animation
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

      // Repository activity pulse
      gsap.to(importanceRing, {
        strokeDashoffset: -50,
        duration: 4 + (node.importance * 0.2),
        repeat: -1,
        ease: "none"
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
      'documentation': '#8B5CF6'
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
      'documentation': <FileText className="w-4 h-4" />
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
              <CardTitle className="flex items-center space-x-2 text-white">
                <Network className="w-5 h-5 text-blue-400" />
                <span>Repository Architecture</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  {repository.name}
                </Badge>
              </CardTitle>
              
              <div className="flex items-center space-x-2">
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
            <CardTitle className="text-white text-sm">Repository Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <Star className="w-3 h-3 text-yellow-400" />
                <span className="text-slate-300">{repository.stargazers_count}</span>
              </div>
              <div className="flex items-center space-x-2">
                <GitFork className="w-3 h-3 text-green-400" />
                <span className="text-slate-300">{repository.forks_count}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-3 h-3 text-blue-400" />
                <span className="text-slate-300">{contributors.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <GitBranch className="w-3 h-3 text-purple-400" />
                <span className="text-slate-300">{branches.length}</span>
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-600/50">
              <div className="flex items-center space-x-2 text-xs">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span className="text-slate-400">Updated {new Date(repository.updated_at).toLocaleDateString()}</span>
              </div>
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
                  
                  {selectedNode.metadata.fileCount && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Files:</span>
                      <span className="text-slate-200">{selectedNode.metadata.fileCount}</span>
                    </div>
                  )}
                  
                  {selectedNode.metadata.contributors && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Contributors:</span>
                      <span className="text-slate-200">{selectedNode.metadata.contributors}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Importance:</span>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div 
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < selectedNode.importance / 2 ? 'bg-yellow-400' : 'bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {selectedNode.connections.length > 0 && (
                  <div className="pt-2 border-t border-slate-600/50">
                    <h4 className="text-slate-300 font-medium text-xs mb-2">Connected to:</h4>
                    <div className="space-y-1">
                      {selectedNode.connections.slice(0, 3).map((connectionId) => {
                        const connectedNode = nodes.find(n => n.id === connectionId);
                        return connectedNode ? (
                          <div key={connectionId} className="flex items-center space-x-2 text-xs">
                            <div style={{ color: connectedNode.color }}>
                              {getTypeIcon(connectedNode.type)}
                            </div>
                            <span className="text-slate-400">{connectedNode.name}</span>
                          </div>
                        ) : null;
                      })}
                      {selectedNode.connections.length > 3 && (
                        <div className="text-slate-500 text-xs">
                          +{selectedNode.connections.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
