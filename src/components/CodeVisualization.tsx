
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
  Activity
} from 'lucide-react';

interface CodeNode {
  id: string;
  name: string;
  type: 'class' | 'function' | 'component' | 'module';
  size: number;
  connections: string[];
  position: { x: number; y: number };
  color: string;
}

interface CodeVisualizationProps {
  repository: any;
  files: any[];
}

export const CodeVisualization: React.FC<CodeVisualizationProps> = ({ 
  repository, 
  files 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<CodeNode | null>(null);
  const [nodes, setNodes] = useState<CodeNode[]>([]);

  useEffect(() => {
    generateCodeStructure();
  }, [repository, files]);

  const generateCodeStructure = () => {
    // Generate mock code structure for visualization
    const mockNodes: CodeNode[] = [
      {
        id: 'main',
        name: 'App.tsx',
        type: 'component',
        size: 100,
        connections: ['router', 'header', 'content'],
        position: { x: 300, y: 150 },
        color: '#3B82F6'
      },
      {
        id: 'router',
        name: 'Router',
        type: 'module',
        size: 80,
        connections: ['pages'],
        position: { x: 150, y: 100 },
        color: '#10B981'
      },
      {
        id: 'header',
        name: 'Header',
        type: 'component',
        size: 60,
        connections: ['navigation'],
        position: { x: 300, y: 50 },
        color: '#8B5CF6'
      },
      {
        id: 'content',
        name: 'Content',
        type: 'component',
        size: 90,
        connections: ['dashboard'],
        position: { x: 450, y: 100 },
        color: '#F59E0B'
      },
      {
        id: 'pages',
        name: 'Pages',
        type: 'module',
        size: 70,
        connections: ['dashboard'],
        position: { x: 150, y: 200 },
        color: '#EF4444'
      },
      {
        id: 'dashboard',
        name: 'Dashboard',
        type: 'component',
        size: 120,
        connections: ['charts', 'metrics'],
        position: { x: 300, y: 250 },
        color: '#06B6D4'
      },
      {
        id: 'charts',
        name: 'Charts',
        type: 'component',
        size: 85,
        connections: [],
        position: { x: 200, y: 350 },
        color: '#84CC16'
      },
      {
        id: 'metrics',
        name: 'Metrics',
        type: 'component',
        size: 75,
        connections: [],
        position: { x: 400, y: 350 },
        color: '#F97316'
      }
    ];

    setNodes(mockNodes);
    renderVisualization(mockNodes);
  };

  const renderVisualization = (nodeList: CodeNode[]) => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const width = 600;
    const height = 400;

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());

    // Create connections first (so they appear behind nodes)
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
          line.setAttribute('stroke-width', '2');
          line.setAttribute('opacity', '0.6');
          line.setAttribute('class', 'connection-line');
          
          // Add subtle animation to connections
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
      nodeGroup.setAttribute('class', 'code-node');
      nodeGroup.setAttribute('transform', `translate(${node.position.x}, ${node.position.y})`);
      nodeGroup.style.cursor = 'pointer';

      // Create main circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const radius = Math.max(20, node.size / 4);
      circle.setAttribute('r', radius.toString());
      circle.setAttribute('fill', node.color);
      circle.setAttribute('stroke', '#1E293B');
      circle.setAttribute('stroke-width', '3');
      circle.style.filter = 'drop-shadow(0px 4px 12px rgba(0,0,0,0.4))';

      // Create pulsing ring
      const pulseRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulseRing.setAttribute('r', (radius + 10).toString());
      pulseRing.setAttribute('fill', 'none');
      pulseRing.setAttribute('stroke', node.color);
      pulseRing.setAttribute('stroke-width', '2');
      pulseRing.setAttribute('opacity', '0');

      // Create text label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '0.35em');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', '11px');
      text.setAttribute('font-weight', '600');
      text.textContent = node.name.length > 8 ? node.name.slice(0, 8) + '...' : node.name;

      // Create type indicator
      const typeIndicator = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      typeIndicator.setAttribute('r', '4');
      typeIndicator.setAttribute('cx', (radius - 8).toString());
      typeIndicator.setAttribute('cy', (-radius + 8).toString());
      typeIndicator.setAttribute('fill', getTypeColor(node.type));
      typeIndicator.setAttribute('stroke', 'white');
      typeIndicator.setAttribute('stroke-width', '1');

      nodeGroup.appendChild(pulseRing);
      nodeGroup.appendChild(circle);
      nodeGroup.appendChild(text);
      nodeGroup.appendChild(typeIndicator);
      svg.appendChild(nodeGroup);

      // Add interactions
      nodeGroup.addEventListener('mouseenter', () => {
        gsap.to(circle, {
          scale: 1.2,
          duration: 0.3,
          ease: "back.out(1.7)",
          transformOrigin: "center"
        });
        
        gsap.to(pulseRing, {
          opacity: 0.6,
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out",
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
        
        gsap.to(pulseRing, {
          opacity: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          transformOrigin: "center"
        });
      });

      nodeGroup.addEventListener('click', () => {
        setSelectedNode(node);
        
        // Highlight selection
        gsap.to(circle, {
          scale: 1.3,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
          transformOrigin: "center"
        });
      });

      // Entrance animation
      gsap.fromTo(nodeGroup, {
        scale: 0,
        opacity: 0,
        rotation: 180
      }, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "back.out(1.7)",
        transformOrigin: "center"
      });

      // Continuous subtle animation
      gsap.to(nodeGroup, {
        y: "+=5",
        duration: 2 + index * 0.3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'component': '#3B82F6',
      'module': '#10B981',
      'class': '#8B5CF6',
      'function': '#F59E0B'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'component': <Code2 className="w-4 h-4" />,
      'module': <Layers className="w-4 h-4" />,
      'class': <Target className="w-4 h-4" />,
      'function': <Zap className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || <Activity className="w-4 h-4" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Visualization Canvas */}
      <div className="lg:col-span-2">
        <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Network className="w-5 h-5 text-blue-400" />
              <span>Code Structure Visualization</span>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                Interactive
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-96 flex items-center justify-center">
            <div
              ref={containerRef}
              className="w-full h-full bg-gradient-to-br from-slate-900/50 to-blue-900/20 rounded-lg overflow-hidden relative"
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

      {/* Node Details */}
      <div>
        <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Node Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center space-x-3">
                  <div style={{ color: selectedNode.color }}>
                    {getTypeIcon(selectedNode.type)}
                  </div>
                  <span className="text-white font-medium text-lg">{selectedNode.name}</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                      {selectedNode.type}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Size:</span>
                    <span className="text-slate-200">{selectedNode.size} lines</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Connections:</span>
                    <span className="text-slate-200">{selectedNode.connections.length}</span>
                  </div>
                </div>

                {selectedNode.connections.length > 0 && (
                  <div>
                    <h4 className="text-slate-300 font-medium mb-2">Connected to:</h4>
                    <div className="space-y-1">
                      {selectedNode.connections.map((connectionId) => {
                        const connectedNode = nodes.find(n => n.id === connectionId);
                        return connectedNode ? (
                          <div key={connectionId} className="flex items-center space-x-2 text-sm">
                            <div style={{ color: connectedNode.color }}>
                              {getTypeIcon(connectedNode.type)}
                            </div>
                            <span className="text-slate-400">{connectedNode.name}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Network className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">Click on a node to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
