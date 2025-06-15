
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
  const animationsRef = useRef<gsap.core.Timeline[]>([]);

  useEffect(() => {
    if (visibleNodes.length > 0) {
      renderBubbleVisualization();
    }
    
    return () => {
      // Cleanup animations
      animationsRef.current.forEach(animation => animation.kill());
      animationsRef.current = [];
    };
  }, [visibleNodes, connections, showConnections, searchTerm]);

  const renderBubbleVisualization = () => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const width = 800;
    const height = 600;

    // Clear previous content and animations
    animationsRef.current.forEach(animation => animation.kill());
    animationsRef.current = [];
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
    feGaussianBlur.setAttribute('stdDeviation', '3');
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

    // Dark background with gradient
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', 'url(#bgGradient)');
    
    const bgGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    bgGradient.setAttribute('id', 'bgGradient');
    bgGradient.setAttribute('cx', '50%');
    bgGradient.setAttribute('cy', '50%');
    bgGradient.setAttribute('r', '50%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#1e293b');
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#0f172a');
    
    bgGradient.appendChild(stop1);
    bgGradient.appendChild(stop2);
    defs.appendChild(bgGradient);
    svg.appendChild(background);

    // Calculate bubble positions with improved clustering
    const positions = calculateClusteredPositions(visibleNodes, width, height);

    // Render connections first (behind bubbles)
    if (showConnections && connections.primary.length > 0) {
      renderConnections(svg, visibleNodes, positions, connections);
    }

    // Render nodes as bubbles with animations
    visibleNodes.forEach((node, index) => {
      const position = positions[index];
      if (position) {
        renderBubbleNode(svg, node, position, index);
      }
    });
  };

  const calculateClusteredPositions = (nodes: HierarchicalNode[], width: number, height: number) => {
    const positions: Array<{ x: number; y: number }> = [];
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Separate nodes by type and create clusters
    const directories = nodes.filter(n => n.type === 'directory');
    const tsxFiles = nodes.filter(n => n.extension === '.tsx');
    const tsFiles = nodes.filter(n => n.extension === '.ts');
    const otherFiles = nodes.filter(n => n.type === 'file' && !n.extension?.match(/\.(tsx?|jsx?)$/));
    
    let positionIndex = 0;
    
    // Position directories in outer ring with clustering
    directories.forEach((node, index) => {
      const angle = (index / Math.max(directories.length, 1)) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.35;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      positions[positionIndex] = { x, y };
      positionIndex++;
    });
    
    // Position TSX files in a spiral pattern
    tsxFiles.forEach((node, index) => {
      const spiral = index * 0.5;
      const angle = spiral * 2 * Math.PI;
      const radius = 80 + spiral * 8;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      positions[positionIndex] = { x, y };
      positionIndex++;
    });
    
    // Position TS files in inner cluster
    tsFiles.forEach((node, index) => {
      const angle = (index / Math.max(tsFiles.length, 1)) * 2 * Math.PI + Math.PI / 6;
      const radius = 60 + index * 5;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      positions[positionIndex] = { x, y };
      positionIndex++;
    });
    
    // Position other files randomly but clustered
    otherFiles.forEach((node, index) => {
      const angle = Math.random() * 2 * Math.PI;
      const radius = 120 + Math.random() * 100;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      positions[positionIndex] = { x, y };
      positionIndex++;
    });
    
    return positions;
  };

  const renderBubbleNode = (svg: SVGSVGElement, node: HierarchicalNode, position: { x: number; y: number }, index: number) => {
    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodeGroup.setAttribute('class', 'bubble-node');
    nodeGroup.setAttribute('data-node-id', node.id);
    nodeGroup.setAttribute('transform', `translate(${position.x}, ${position.y})`);
    nodeGroup.style.cursor = 'pointer';

    // Calculate bubble size intelligently
    const baseSize = node.type === 'directory' ? 35 : 25;
    const sizeMultiplier = node.size ? Math.min(Math.log(node.size / 100 + 1), 2) : 1;
    const radius = Math.max(baseSize + sizeMultiplier * 8, 18);

    // Create main bubble with gradient
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', radius.toString());
    circle.setAttribute('fill', getNodeColor(node));
    circle.setAttribute('stroke', getNodeStrokeColor(node));
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('opacity', '0.9');
    circle.setAttribute('filter', 'url(#glow)');

    // Create pulse ring for directories
    if (node.type === 'directory') {
      const pulseRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulseRing.setAttribute('r', (radius + 6).toString());
      pulseRing.setAttribute('fill', 'none');
      pulseRing.setAttribute('stroke', getNodeColor(node));
      pulseRing.setAttribute('stroke-width', '1');
      pulseRing.setAttribute('opacity', '0.4');
      nodeGroup.appendChild(pulseRing);
      
      // Animate pulse with proper cleanup
      const pulseAnimation = gsap.to(pulseRing, {
        scale: 1.3,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: "power2.out"
      });
      animationsRef.current.push(pulseAnimation);
    }

    // Create icon
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    icon.setAttribute('text-anchor', 'middle');
    icon.setAttribute('dominant-baseline', 'central');
    icon.setAttribute('dy', '-2');
    icon.setAttribute('fill', 'white');
    icon.setAttribute('font-size', '14px');
    icon.setAttribute('font-family', 'Arial, sans-serif');
    icon.textContent = getNodeIcon(node);

    // Create label with proper truncation
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'central');
    label.setAttribute('dy', '12');
    label.setAttribute('fill', 'white');
    label.setAttribute('font-size', '9px');
    label.setAttribute('font-weight', '600');
    label.setAttribute('font-family', 'Arial, sans-serif');
    const displayName = node.name.length > 10 ? node.name.slice(0, 10) + '...' : node.name;
    label.textContent = displayName;

    nodeGroup.appendChild(circle);
    nodeGroup.appendChild(icon);
    nodeGroup.appendChild(label);

    // Add smooth hover effects
    nodeGroup.addEventListener('mouseenter', () => {
      const hoverAnimation = gsap.timeline();
      hoverAnimation.to(circle, {
        scale: 1.15,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
      hoverAnimation.to(nodeGroup, {
        y: -3,
        duration: 0.3,
        ease: "back.out(1.7)"
      }, 0);
      animationsRef.current.push(hoverAnimation);
    });

    nodeGroup.addEventListener('mouseleave', () => {
      const resetAnimation = gsap.timeline();
      resetAnimation.to(circle, {
        scale: 1,
        duration: 0.25,
        ease: "power2.out"
      });
      resetAnimation.to(nodeGroup, {
        y: 0,
        duration: 0.25,
        ease: "power2.out"
      }, 0);
      animationsRef.current.push(resetAnimation);
    });

    nodeGroup.addEventListener('click', (e) => {
      e.stopPropagation();
      onNodeClick(node);
      
      // Click animation
      const clickAnimation = gsap.timeline();
      clickAnimation.to(circle, {
        scale: 0.9,
        duration: 0.1,
        ease: "power2.out"
      });
      clickAnimation.to(circle, {
        scale: 1,
        duration: 0.2,
        ease: "back.out(1.7)"
      });
      animationsRef.current.push(clickAnimation);
    });

    // Entrance animation with stagger
    gsap.set(nodeGroup, { scale: 0, opacity: 0 });
    const entranceAnimation = gsap.to(nodeGroup, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      delay: index * 0.03,
      ease: "back.out(1.7)"
    });
    animationsRef.current.push(entranceAnimation);

    svg.appendChild(nodeGroup);
  };

  const renderConnections = (svg: SVGSVGElement, nodes: HierarchicalNode[], positions: Array<{ x: number; y: number }>, connections: FilteredConnections) => {
    // Render only the most important connections to avoid clutter
    const connectionsToRender = connections.primary.slice(0, 5);
    
    connectionsToRender.forEach((connection, index) => {
      const sourceIndex = nodes.findIndex(n => n.id === connection.source);
      const targetIndex = nodes.findIndex(n => n.id === connection.target);
      
      if (sourceIndex >= 0 && targetIndex >= 0 && positions[sourceIndex] && positions[targetIndex]) {
        renderConnection(svg, positions[sourceIndex], positions[targetIndex], connection.strength, index * 0.1);
      }
    });
  };

  const renderConnection = (svg: SVGSVGElement, sourcePos: { x: number; y: number }, targetPos: { x: number; y: number }, strength: number, delay: number) => {
    // Create curved path for better visual appeal
    const midX = (sourcePos.x + targetPos.x) / 2;
    const midY = (sourcePos.y + targetPos.y) / 2;
    const distance = Math.sqrt(Math.pow(targetPos.x - sourcePos.x, 2) + Math.pow(targetPos.y - sourcePos.y, 2));
    const curvature = Math.min(distance * 0.2, 50);
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const pathData = `M ${sourcePos.x} ${sourcePos.y} Q ${midX} ${midY - curvature} ${targetPos.x} ${targetPos.y}`;
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', `rgba(100, 116, 139, ${0.3 + strength * 0.4})`);
    path.setAttribute('stroke-width', Math.max(1, strength * 3).toString());
    path.setAttribute('fill', 'none');
    path.setAttribute('marker-end', 'url(#arrowhead)');
    path.setAttribute('class', 'connection-line');

    // Animate path drawing
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    
    const pathAnimation = gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.2,
      delay: delay,
      ease: "power2.out"
    });
    animationsRef.current.push(pathAnimation);

    svg.appendChild(path);
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

  const getNodeStrokeColor = (node: HierarchicalNode): string => {
    if (node.type === 'directory') return '#A855F7';
    
    switch (node.extension) {
      case '.tsx':
      case '.jsx':
        return '#60A5FA';
      case '.ts':
      case '.js':
        return '#FBBF24';
      case '.css':
      case '.scss':
        return '#F472B6';
      case '.json':
        return '#34D399';
      case '.md':
        return '#9CA3AF';
      default:
        return '#94A3B8';
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
    <div className="w-full h-full bg-slate-900/30 rounded-lg overflow-hidden border border-slate-700/50">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: "transparent" }}
      />
    </div>
  );
};
