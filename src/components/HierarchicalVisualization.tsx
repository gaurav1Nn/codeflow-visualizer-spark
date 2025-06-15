
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { HierarchicalNode, FilteredConnections } from '@/services/repositoryHierarchy';

interface HierarchicalVisualizationProps {
  hierarchy: HierarchicalNode[];
  visibleNodes: HierarchicalNode[];
  connections: FilteredConnections;
  onNodeClick: (node: HierarchicalNode) => void;
  showConnections: boolean;
  searchTerm: string;
}

export const HierarchicalVisualization: React.FC<HierarchicalVisualizationProps> = ({
  hierarchy,
  visibleNodes,
  connections,
  onNodeClick,
  showConnections,
  searchTerm
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (visibleNodes.length > 0) {
      renderBubbleVisualization();
    }
  }, [visibleNodes, connections, showConnections, searchTerm]);

  const renderBubbleVisualization = () => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const width = 800;
    const height = 600;

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());

    // Create definitions for arrows
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    arrow.setAttribute('id', 'arrowhead');
    arrow.setAttribute('markerWidth', '10');
    arrow.setAttribute('markerHeight', '7');
    arrow.setAttribute('refX', '9');
    arrow.setAttribute('refY', '3.5');
    arrow.setAttribute('orient', 'auto');
    
    const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    arrowPath.setAttribute('points', '0 0, 10 3.5, 0 7');
    arrowPath.setAttribute('fill', '#64748B');
    arrow.appendChild(arrowPath);
    defs.appendChild(arrow);
    svg.appendChild(defs);

    // Dark background
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', '#0f172a');
    svg.appendChild(background);

    // Calculate bubble positions using force-directed layout simulation
    const positions = calculateBubblePositions(visibleNodes, width, height);

    // Render connections first
    if (showConnections) {
      renderConnections(svg, visibleNodes, positions, connections);
    }

    // Render nodes as bubbles
    visibleNodes.forEach((node, index) => {
      const position = positions[index];
      renderBubbleNode(svg, node, position, index);
    });
  };

  const calculateBubblePositions = (nodes: HierarchicalNode[], width: number, height: number) => {
    const positions = [];
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Group nodes by type
    const directories = nodes.filter(n => n.type === 'directory');
    const files = nodes.filter(n => n.type === 'file');
    
    let positionIndex = 0;
    
    // Position directories in outer ring
    directories.forEach((node, index) => {
      const angle = (index / directories.length) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.3;
      positions[positionIndex] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
      positionIndex++;
    });
    
    // Position files in inner area
    files.forEach((node, index) => {
      const angle = (index / files.length) * 2 * Math.PI + Math.PI / 4;
      const radius = Math.min(width, height) * 0.15;
      positions[positionIndex] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
      positionIndex++;
    });
    
    return positions;
  };

  const renderBubbleNode = (svg: SVGSVGElement, node: HierarchicalNode, position: any, index: number) => {
    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodeGroup.setAttribute('class', 'bubble-node');
    nodeGroup.setAttribute('data-node-id', node.id);
    nodeGroup.setAttribute('transform', `translate(${position.x}, ${position.y})`);
    nodeGroup.style.cursor = 'pointer';

    // Calculate bubble size based on file size or importance
    const baseSize = node.type === 'directory' ? 40 : 25;
    const sizeMultiplier = node.size ? Math.min(Math.log(node.size / 100), 3) : 1;
    const radius = Math.max(baseSize + sizeMultiplier * 5, 20);

    // Create main bubble
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', radius.toString());
    circle.setAttribute('fill', getNodeColor(node));
    circle.setAttribute('stroke', '#1e293b');
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('opacity', '0.9');
    circle.style.filter = 'drop-shadow(0px 4px 12px rgba(0,0,0,0.3))';

    // Create pulse ring for directories
    if (node.type === 'directory') {
      const pulseRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulseRing.setAttribute('r', (radius + 8).toString());
      pulseRing.setAttribute('fill', 'none');
      pulseRing.setAttribute('stroke', getNodeColor(node));
      pulseRing.setAttribute('stroke-width', '1');
      pulseRing.setAttribute('opacity', '0.3');
      nodeGroup.appendChild(pulseRing);
      
      // Animate pulse
      gsap.to(pulseRing, {
        scale: 1.2,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: "power2.out"
      });
    }

    // Create icon
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    icon.setAttribute('text-anchor', 'middle');
    icon.setAttribute('dy', '-5');
    icon.setAttribute('fill', 'white');
    icon.setAttribute('font-size', '16px');
    icon.textContent = getNodeIcon(node);

    // Create label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dy', '10');
    label.setAttribute('fill', 'white');
    label.setAttribute('font-size', '10px');
    label.setAttribute('font-weight', '500');
    const displayName = node.name.length > 12 ? node.name.slice(0, 12) + '...' : node.name;
    label.textContent = displayName;

    nodeGroup.appendChild(circle);
    nodeGroup.appendChild(icon);
    nodeGroup.appendChild(label);

    // Add hover effects
    nodeGroup.addEventListener('mouseenter', () => {
      gsap.to(circle, {
        scale: 1.1,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
      gsap.to(nodeGroup, {
        y: -5,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
    });

    nodeGroup.addEventListener('mouseleave', () => {
      gsap.to(circle, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(nodeGroup, {
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    nodeGroup.addEventListener('click', () => onNodeClick(node));

    // Entrance animation
    gsap.fromTo(nodeGroup, {
      scale: 0,
      opacity: 0
    }, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      delay: index * 0.05,
      ease: "back.out(1.7)"
    });

    svg.appendChild(nodeGroup);
  };

  const renderConnections = (svg: SVGSVGElement, nodes: HierarchicalNode[], positions: any[], connections: FilteredConnections) => {
    // Only render primary connections to avoid clutter
    connections.primary.slice(0, 3).forEach((connection, index) => {
      const sourceIndex = nodes.findIndex(n => n.id === connection.source);
      const targetIndex = nodes.findIndex(n => n.id === connection.target);
      
      if (sourceIndex >= 0 && targetIndex >= 0) {
        renderConnection(svg, positions[sourceIndex], positions[targetIndex], index * 0.2);
      }
    });
  };

  const renderConnection = (svg: SVGSVGElement, sourcePos: any, targetPos: any, delay: number) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', sourcePos.x.toString());
    line.setAttribute('y1', sourcePos.y.toString());
    line.setAttribute('x2', targetPos.x.toString());
    line.setAttribute('y2', targetPos.y.toString());
    line.setAttribute('stroke', '#64748B');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('opacity', '0.6');
    line.setAttribute('marker-end', 'url(#arrowhead)');
    line.setAttribute('class', 'connection-line');

    // Animate line drawing
    const length = Math.sqrt(Math.pow(targetPos.x - sourcePos.x, 2) + Math.pow(targetPos.y - sourcePos.y, 2));
    line.style.strokeDasharray = `${length}`;
    line.style.strokeDashoffset = `${length}`;
    
    gsap.to(line, {
      strokeDashoffset: 0,
      duration: 1,
      delay: delay,
      ease: "power2.out"
    });

    svg.appendChild(line);
  };

  const getNodeColor = (node: HierarchicalNode): string => {
    if (node.type === 'directory') return '#8B5CF6';
    
    switch (node.extension) {
      case '.tsx':
      case '.jsx':
        return '#3B82F6';
      case '.ts':
      case '.js':
        return '#F59E0B';
      case '.css':
      case '.scss':
        return '#EC4899';
      case '.json':
        return '#10B981';
      case '.md':
        return '#6B7280';
      default:
        return '#64748B';
    }
  };

  const getNodeIcon = (node: HierarchicalNode): string => {
    if (node.type === 'directory') return '📁';
    
    switch (node.extension) {
      case '.tsx':
      case '.jsx':
        return '⚛️';
      case '.ts':
      case '.js':
        return '📜';
      case '.css':
      case '.scss':
        return '🎨';
      case '.json':
        return '📋';
      case '.md':
        return '📝';
      default:
        return '📄';
    }
  };

  return (
    <div className="w-full h-full bg-slate-900/30 rounded-lg overflow-hidden">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: "transparent" }}
      />
    </div>
  );
};
