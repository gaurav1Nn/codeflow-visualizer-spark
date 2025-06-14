
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Square, Circle, Triangle } from 'lucide-react';

const nodeTypes = [
  { type: 'class', color: '#3B82F6', icon: Square, label: 'Classes' },
  { type: 'method', color: '#10B981', icon: Circle, label: 'Methods' },
  { type: 'variable', color: '#8B5CF6', icon: Triangle, label: 'Variables' },
  { type: 'call', color: '#F59E0B', icon: Circle, label: 'Function Calls' }
];

const edgeTypes = [
  { type: 'contains', color: '#475569', label: 'Contains', style: 'solid' },
  { type: 'calls', color: '#3B82F6', label: 'Calls', style: 'dashed' },
  { type: 'uses', color: '#10B981', label: 'Uses', style: 'dotted' },
  { type: 'invokes', color: '#F59E0B', label: 'Invokes', style: 'solid' }
];

export const LegendPanel = () => {
  const legendRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate legend items on mount
    gsap.from(".legend-item", {
      x: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.5
    });

    // Add hover animations to legend items
    const legendItems = document.querySelectorAll('.legend-item');
    legendItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          scale: 1.05,
          backgroundColor: "rgba(51, 65, 85, 0.8)",
          duration: 0.3,
          ease: "power2.out"
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          scale: 1,
          backgroundColor: "rgba(51, 65, 85, 0.3)",
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });
  }, []);

  return (
    <Card className="h-full bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-green-400" />
          <span>Legend</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Node Types */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
            Node Types
          </h4>
          <div className="space-y-2">
            {nodeTypes.map((nodeType, index) => {
              const IconComponent = nodeType.icon;
              return (
                <div 
                  key={nodeType.type}
                  className="legend-item flex items-center space-x-3 p-2 rounded-lg bg-slate-700/30 cursor-pointer transition-all duration-300"
                >
                  <div 
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: nodeType.color }}
                  >
                    <IconComponent className="w-2 h-2 text-white" />
                  </div>
                  <span className="text-slate-300 text-sm">{nodeType.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edge Types */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
            Relationships
          </h4>
          <div className="space-y-2">
            {edgeTypes.map((edgeType, index) => (
              <div 
                key={edgeType.type}
                className="legend-item flex items-center space-x-3 p-2 rounded-lg bg-slate-700/30 cursor-pointer transition-all duration-300"
              >
                <div className="flex-1">
                  <div 
                    className="h-0.5 w-6"
                    style={{ 
                      backgroundColor: edgeType.color,
                      borderStyle: edgeType.style === 'solid' ? 'none' : edgeType.style,
                      borderWidth: edgeType.style !== 'solid' ? '1px 0' : '0'
                    }}
                  />
                </div>
                <span className="text-slate-300 text-sm">{edgeType.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
            Statistics
          </h4>
          <div className="space-y-3">
            <div className="legend-item p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm">Nodes</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                  5
                </Badge>
              </div>
            </div>
            <div className="legend-item p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm">Connections</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  5
                </Badge>
              </div>
            </div>
            <div className="legend-item p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm">Complexity</span>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                  Medium
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
