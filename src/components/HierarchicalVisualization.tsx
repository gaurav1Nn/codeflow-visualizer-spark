
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
  const animationsRef = useRef<(gsap.core.Tween | gsap.core.Timeline)[]>([]);
  const hoverStatesRef = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (visibleNodes.length > 0) {
      renderBubbleVisualization();
    }
    
    return () => {
      // Cleanup all animations
      animationsRef.current.forEach(animation => {
        if (animation && animation.kill) {
          animation.kill();
        }
      });
      animationsRef.current = [];
      hoverStatesRef.current.clear();
    };
  }, [visibleNodes, connections, showConnections, searchTerm]);

  const addAnimation = (animation: gsap.core.Tween | gsap.core.Timeline) => {
    if (animation) {
      animationsRef.current.push(animation);
    }
  };

  const renderBubbleVisualization = () => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const width = 800;
    const height = 600;

    // Clear previous content and animations
    animationsRef.current.forEach(animation => {
      if (animation && animation.kill) {
        animation.kill();
      }
    });
    animationsRef.current = [];
    hoverStatesRef.current.clear();
    
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // Create definitions for gradients and filters
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Create arrow marker
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    arrow.setAttribute('id', 'arrowhead');
    arrow.setAttribute('markerWidth', '10');
    arrow.setAttribute('markerHeight', '7');
    arrow.setAttribute('refX', '9');
    arrow.setAttribute('refY', '3.5');
    arrow.setAttribute('orient', 'auto');
    arrow.setAttribute('markerUnits', 'strokeWidth');
    
    const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    arrowPath.setAttribute('points', '0 0, 10 3.5, 0 7');
    arrowPath.setAttribute('fill', '#64748B');
    arrow.appendChild(arrowPath);
    defs.appendChild(arrow);

    // Create glow filter
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '4');
    feGaussianBlur.setAttribute('result', 'coloredBlur');
    filter.appendChild(feGaussianBlur);
    
    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feMerge);
    defs.appendChild(filter);

    svg.appendChild(defs);

    // Dark background
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', '#0f172a');
    svg.appendChild(background);

    // Calculate optimized positions for better layout
    const positions = calculateCleanPositions(visibleNodes, width, height);

    // Render connections if enabled and not too many nodes
    if (showConnections && connections.primary.length > 0 && visibleNodes.length <= 15) {
      renderConnections(svg, visibleNodes, positions, connections);
    }

    // Render nodes
    visibleNodes.forEach((node, index) => {
      const position = positions[index];
      if (position) {
        renderBubbleNode(svg, node, position, index);
      }
    });
  };

  const calculateCleanPositions = (nodes: HierarchicalNode[], width: number, height: number) => {
    const positions: Array<{ x: number; y: number }> = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const padding = 60;
    
    // Improved layout for fewer nodes with better spacing
    const directories = nodes.filter(n => n.type === 'directory');
    const files = nodes.filter(n => n.type === 'file');
    
    let positionIndex = 0;
    const usedPositions: Array<{ x: number; y: number; radius: number }> = [];
    
    const checkCollision = (x: number, y: number, radius: number) => {
      return usedPositions.some(pos => {
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        return distance < (radius + pos.radius + 30); // More spacing
      });
    };
    
    const findValidPosition = (baseX: number, baseY: number, radius: number) => {
      for (let attempt = 0; attempt < 20; attempt++) {
        const angle = (attempt / 20) * 2 * Math.PI;
        const offset = attempt * 20;
        const x = Math.max(padding + radius, Math.min(width - padding - radius, baseX + Math.cos(angle) * offset));
        const y = Math.max(padding + radius, Math.min(height - padding - radius, baseY + Math.sin(angle) * offset));
        
        if (!checkCollision(x, y, radius)) {
          usedPositions.push({ x, y, radius });
          return { x, y };
        }
      }
      usedPositions.push({ x: baseX, y: baseY, radius });
      return { x: baseX, y: baseY };
    };
    
    // Position directories first with larger spacing
    directories.forEach((node, index) => {
      const angle = (index / Math.max(directories.length, 1)) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.25; // Closer to center
      const baseX = centerX + Math.cos(angle) * radius;
      const baseY = centerY + Math.sin(angle) * radius;
      const nodeRadius = 40; // Larger folders
      
      const position = findValidPosition(baseX, baseY, nodeRadius);
      positions[positionIndex] = position;
      positionIndex++;
    });
    
    // Position files around directories
    files.forEach((node, index) => {
      const angle = ((index + directories.length) / Math.max(nodes.length, 1)) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.35;
      const baseX = centerX + Math.cos(angle) * radius;
      const baseY = centerY + Math.sin(angle) * radius;
      const nodeRadius = 25;
      
      const position = findValidPosition(baseX, baseY, nodeRadius);
      positions[positionIndex] = position;
      positionIndex++;
    });
    
    return positions;
  };

  const renderBubbleNode = (svg: SVGSVGElement, node: HierarchicalNode, position: { x: number; y: number }, index: number) => {
    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodeGroup.setAttribute('transform', `translate(${position.x}, ${position.y})`);
    nodeGroup.style.cursor = 'pointer';

    // Calculate size based on type and expanded state
    const baseSize = node.type === 'directory' ? 
      (node.isExpanded ? 45 : 40) : 25;
    const radius = baseSize;

    // Create main bubble
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', radius.toString());
    circle.setAttribute('fill', getNodeColor(node));
    circle.setAttribute('stroke', getNodeStrokeColor(node));
    circle.setAttribute('stroke-width', node.isExpanded ? '3' : '2');
    circle.setAttribute('opacity', '0.9');
    circle.setAttribute('filter', 'url(#glow)');

    // Add expansion indicator for directories
    if (node.type === 'directory') {
      const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      indicator.setAttribute('r', (radius + 5).toString());
      indicator.setAttribute('fill', 'none');
      indicator.setAttribute('stroke', node.isExpanded ? '#10B981' : '#64748B');
      indicator.setAttribute('stroke-width', '1');
      indicator.setAttribute('opacity', '0.6');
      indicator.setAttribute('stroke-dasharray', node.isExpanded ? '0' : '5,5');
      nodeGroup.appendChild(indicator);
    }

    // Enhanced icon
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    icon.setAttribute('text-anchor', 'middle');
    icon.setAttribute('dominant-baseline', 'central');
    icon.setAttribute('fill', 'white');
    icon.setAttribute('font-size', node.type === 'directory' ? '18px' : '14px');
    icon.setAttribute('font-family', 'system-ui');
    icon.textContent = getNodeIcon(node);

    // Enhanced label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'central');
    label.setAttribute('dy', radius + 18);
    label.setAttribute('fill', 'white');
    label.setAttribute('font-size', '9px');
    label.setAttribute('font-weight', '600');
    label.setAttribute('font-family', 'system-ui');
    const maxLength = 10;
    const displayName = node.name.length > maxLength ? node.name.slice(0, maxLength) + '…' : node.name;
    label.textContent = displayName;

    nodeGroup.appendChild(circle);
    nodeGroup.appendChild(icon);
    nodeGroup.appendChild(label);

    // Smooth hover effects
    const handleMouseEnter = () => {
      const nodeId = node.id;
      if (hoverStatesRef.current.get(nodeId)) return;
      
      hoverStatesRef.current.set(nodeId, true);
      gsap.killTweensOf(nodeGroup);
      
      gsap.to(circle, {
        scale: 1.1,
        duration: 0.2,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      const nodeId = node.id;
      hoverStatesRef.current.set(nodeId, false);
      gsap.killTweensOf(nodeGroup);
      
      gsap.to(circle, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    };

    const handleClick = (e: Event) => {
      e.stopPropagation();
      onNodeClick(node);
    };

    nodeGroup.addEventListener('mouseenter', handleMouseEnter);
    nodeGroup.addEventListener('mouseleave', handleMouseLeave);
    nodeGroup.addEventListener('click', handleClick);

    // Entrance animation
    gsap.set(nodeGroup, { scale: 0, opacity: 0 });
    const entranceTween = gsap.to(nodeGroup, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      delay: index * 0.05,
      ease: "back.out(1.4)"
    });
    addAnimation(entranceTween);

    svg.appendChild(nodeGroup);
  };

  const renderConnections = (svg: SVGSVGElement, nodes: HierarchicalNode[], positions: Array<{ x: number; y: number }>, connections: FilteredConnections) => {
    // Only show primary connections to avoid clutter
    connections.primary.forEach((connection, index) => {
      const sourceIndex = nodes.findIndex(n => n.id === connection.source);
      const targetIndex = nodes.findIndex(n => n.id === connection.target);
      
      if (sourceIndex >= 0 && targetIndex >= 0 && positions[sourceIndex] && positions[targetIndex]) {
        renderConnection(svg, positions[sourceIndex], positions[targetIndex], index * 0.2);
      }
    });
  };

  const renderConnection = (svg: SVGSVGElement, sourcePos: { x: number; y: number }, targetPos: { x: number; y: number }, delay: number) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', sourcePos.x.toString());
    line.setAttribute('y1', sourcePos.y.toString());
    line.setAttribute('x2', targetPos.x.toString());
    line.setAttribute('y2', targetPos.y.toString());
    line.setAttribute('stroke', 'rgba(100, 116, 139, 0.4)');
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('opacity', '0');

    gsap.to(line, {
      opacity: 0.6,
      duration: 0.5,
      delay: delay,
      ease: "power2.out"
    });

    svg.appendChild(line);
  };

  const getNodeColor = (node: HierarchicalNode): string => {
    if (node.type === 'directory') {
      return node.isExpanded ? '#10B981' : '#8B5CF6';
    }
    
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

  const getNodeStrokeColor = (node: HierarchicalNode): string => {
    if (node.type === 'directory') {
      return node.isExpanded ? '#34D399' : '#A855F7';
    }
    
    switch (node.extension) {
      case '.tsx':
      case '.jsx':
        return '#60A5FA';
      case '.ts':
      case '.js':
        return '#FBBF24';
      default:
        return '#94A3B8';
    }
  };

  const getNodeIcon = (node: HierarchicalNode): string => {
    if (node.type === 'directory') {
      return node.isExpanded ? '📂' : '📁';
    }
    
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
    <div className="w-full h-full bg-slate-900/30 rounded-lg overflow-hidden border border-slate-700/50">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: "transparent" }}
      />
    </div>
  );
};
