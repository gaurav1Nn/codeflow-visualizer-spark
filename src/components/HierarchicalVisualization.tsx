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
  const animationsRef = useRef<gsap.core.Tween[]>([]);
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

  const killAnimationsForElement = (element: Element) => {
    gsap.killTweensOf(element);
    // Remove from our tracking array
    animationsRef.current = animationsRef.current.filter(anim => 
      anim && !anim.targets().includes(element)
    );
  };

  const addAnimation = (animation: gsap.core.Tween) => {
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

    // Create enhanced glow filter
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

    // Create hover glow filter
    const hoverFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    hoverFilter.setAttribute('id', 'hover-glow');
    hoverFilter.setAttribute('x', '-50%');
    hoverFilter.setAttribute('y', '-50%');
    hoverFilter.setAttribute('width', '200%');
    hoverFilter.setAttribute('height', '200%');
    
    const hoverBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    hoverBlur.setAttribute('stdDeviation', '6');
    hoverBlur.setAttribute('result', 'hoverBlur');
    hoverFilter.appendChild(hoverBlur);
    
    const hoverMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const hoverMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    hoverMergeNode1.setAttribute('in', 'hoverBlur');
    const hoverMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    hoverMergeNode2.setAttribute('in', 'SourceGraphic');
    hoverMerge.appendChild(hoverMergeNode1);
    hoverMerge.appendChild(hoverMergeNode2);
    hoverFilter.appendChild(hoverMerge);
    defs.appendChild(hoverFilter);

    svg.appendChild(defs);

    // Dark background with enhanced gradient
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', 'url(#bgGradient)');
    
    const bgGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    bgGradient.setAttribute('id', 'bgGradient');
    bgGradient.setAttribute('cx', '50%');
    bgGradient.setAttribute('cy', '50%');
    bgGradient.setAttribute('r', '60%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#1e293b');
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '70%');
    stop2.setAttribute('stop-color', '#0f172a');
    const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop3.setAttribute('offset', '100%');
    stop3.setAttribute('stop-color', '#020617');
    
    bgGradient.appendChild(stop1);
    bgGradient.appendChild(stop2);
    bgGradient.appendChild(stop3);
    defs.appendChild(bgGradient);
    svg.appendChild(background);

    // Calculate improved bubble positions
    const positions = calculateOptimizedPositions(visibleNodes, width, height);

    // Render connections with better performance
    if (showConnections && connections.primary.length > 0) {
      renderOptimizedConnections(svg, visibleNodes, positions, connections);
    }

    // Render nodes with enhanced animations
    visibleNodes.forEach((node, index) => {
      const position = positions[index];
      if (position) {
        renderEnhancedBubbleNode(svg, node, position, index);
      }
    });
  };

  const calculateOptimizedPositions = (nodes: HierarchicalNode[], width: number, height: number) => {
    const positions: Array<{ x: number; y: number }> = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const padding = 40;
    
    // Improved clustering with collision detection
    const directories = nodes.filter(n => n.type === 'directory');
    const tsxFiles = nodes.filter(n => n.extension === '.tsx');
    const tsFiles = nodes.filter(n => n.extension === '.ts');
    const otherFiles = nodes.filter(n => n.type === 'file' && !n.extension?.match(/\.(tsx?|jsx?)$/));
    
    let positionIndex = 0;
    const usedPositions: Array<{ x: number; y: number; radius: number }> = [];
    
    const checkCollision = (x: number, y: number, radius: number) => {
      return usedPositions.some(pos => {
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        return distance < (radius + pos.radius + 20); // 20px minimum spacing
      });
    };
    
    const findValidPosition = (baseX: number, baseY: number, radius: number, maxAttempts = 10) => {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const angle = (attempt / maxAttempts) * 2 * Math.PI;
        const offset = attempt * 15;
        const x = Math.max(padding + radius, Math.min(width - padding - radius, baseX + Math.cos(angle) * offset));
        const y = Math.max(padding + radius, Math.min(height - padding - radius, baseY + Math.sin(angle) * offset));
        
        if (!checkCollision(x, y, radius)) {
          usedPositions.push({ x, y, radius });
          return { x, y };
        }
      }
      // Fallback to original position if no valid position found
      usedPositions.push({ x: baseX, y: baseY, radius });
      return { x: baseX, y: baseY };
    };
    
    // Position directories in outer ring
    directories.forEach((node, index) => {
      const angle = (index / Math.max(directories.length, 1)) * 2 * Math.PI - Math.PI / 2;
      const radius = Math.min(width, height) * 0.32;
      const baseX = centerX + Math.cos(angle) * radius;
      const baseY = centerY + Math.sin(angle) * radius;
      const nodeRadius = 35;
      
      const position = findValidPosition(baseX, baseY, nodeRadius);
      positions[positionIndex] = position;
      positionIndex++;
    });
    
    // Position TSX files in middle ring
    tsxFiles.forEach((node, index) => {
      const angle = (index / Math.max(tsxFiles.length, 1)) * 2 * Math.PI + Math.PI / 4;
      const radius = Math.min(width, height) * 0.22;
      const baseX = centerX + Math.cos(angle) * radius;
      const baseY = centerY + Math.sin(angle) * radius;
      const nodeRadius = 28;
      
      const position = findValidPosition(baseX, baseY, nodeRadius);
      positions[positionIndex] = position;
      positionIndex++;
    });
    
    // Position TS files in inner ring
    tsFiles.forEach((node, index) => {
      const angle = (index / Math.max(tsFiles.length, 1)) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.12;
      const baseX = centerX + Math.cos(angle) * radius;
      const baseY = centerY + Math.sin(angle) * radius;
      const nodeRadius = 25;
      
      const position = findValidPosition(baseX, baseY, nodeRadius);
      positions[positionIndex] = position;
      positionIndex++;
    });
    
    // Position other files randomly but organized
    otherFiles.forEach((node, index) => {
      const angle = (Math.random() + index * 0.5) * 2 * Math.PI;
      const radius = 80 + Math.random() * 120;
      const baseX = centerX + Math.cos(angle) * radius;
      const baseY = centerY + Math.sin(angle) * radius;
      const nodeRadius = 22;
      
      const position = findValidPosition(baseX, baseY, nodeRadius);
      positions[positionIndex] = position;
      positionIndex++;
    });
    
    return positions;
  };

  const renderEnhancedBubbleNode = (svg: SVGSVGElement, node: HierarchicalNode, position: { x: number; y: number }, index: number) => {
    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodeGroup.setAttribute('class', 'bubble-node');
    nodeGroup.setAttribute('data-node-id', node.id);
    nodeGroup.setAttribute('transform', `translate(${position.x}, ${position.y})`);
    nodeGroup.style.cursor = 'pointer';

    // Calculate bubble size with better scaling
    const baseSize = node.type === 'directory' ? 35 : 25;
    const sizeMultiplier = node.size ? Math.min(Math.log(node.size / 100 + 1), 1.8) : 1;
    const radius = Math.max(baseSize + sizeMultiplier * 6, 18);

    // Create main bubble with enhanced styling
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', radius.toString());
    circle.setAttribute('fill', getNodeColor(node));
    circle.setAttribute('stroke', getNodeStrokeColor(node));
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('opacity', '0.92');
    circle.setAttribute('filter', 'url(#glow)');

    // Create subtle pulse ring for directories only
    if (node.type === 'directory') {
      const pulseRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulseRing.setAttribute('r', (radius + 8).toString());
      pulseRing.setAttribute('fill', 'none');
      pulseRing.setAttribute('stroke', getNodeColor(node));
      pulseRing.setAttribute('stroke-width', '1');
      pulseRing.setAttribute('opacity', '0.3');
      nodeGroup.appendChild(pulseRing);
      
      // Subtle pulse animation
      const pulseAnimation = gsap.to(pulseRing, {
        scale: 1.2,
        opacity: 0.1,
        duration: 3,
        repeat: -1,
        ease: "sine.inOut"
      });
      addAnimation(pulseAnimation);
    }

    // Enhanced icon with better positioning
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    icon.setAttribute('text-anchor', 'middle');
    icon.setAttribute('dominant-baseline', 'central');
    icon.setAttribute('dy', '-1');
    icon.setAttribute('fill', 'white');
    icon.setAttribute('font-size', node.type === 'directory' ? '16px' : '13px');
    icon.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
    icon.textContent = getNodeIcon(node);

    // Enhanced label with better truncation
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'central');
    label.setAttribute('dy', radius > 30 ? '14' : '12');
    label.setAttribute('fill', 'white');
    label.setAttribute('font-size', '8px');
    label.setAttribute('font-weight', '600');
    label.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
    const maxLength = radius > 30 ? 12 : 8;
    const displayName = node.name.length > maxLength ? node.name.slice(0, maxLength) + '…' : node.name;
    label.textContent = displayName;

    nodeGroup.appendChild(circle);
    nodeGroup.appendChild(icon);
    nodeGroup.appendChild(label);

    // Enhanced hover effects with proper state management
    const handleMouseEnter = () => {
      const nodeId = node.id;
      if (hoverStatesRef.current.get(nodeId)) return; // Already hovering
      
      hoverStatesRef.current.set(nodeId, true);
      killAnimationsForElement(nodeGroup);
      
      // Enhanced hover animation with scale and glow
      const hoverTween = gsap.timeline()
        .to(circle, {
          scale: 1.1,
          filter: 'url(#hover-glow)',
          duration: 0.25,
          ease: "power2.out"
        })
        .to([icon, label], {
          scale: 1.05,
          duration: 0.25,
          ease: "power2.out"
        }, 0);
      
      addAnimation(hoverTween);
    };

    const handleMouseLeave = () => {
      const nodeId = node.id;
      if (!hoverStatesRef.current.get(nodeId)) return; // Not hovering
      
      hoverStatesRef.current.set(nodeId, false);
      killAnimationsForElement(nodeGroup);
      
      // Reset animation
      const resetTween = gsap.timeline()
        .to(circle, {
          scale: 1,
          filter: 'url(#glow)',
          duration: 0.2,
          ease: "power2.out"
        })
        .to([icon, label], {
          scale: 1,
          duration: 0.2,
          ease: "power2.out"
        }, 0);
      
      addAnimation(resetTween);
    };

    const handleClick = (e: Event) => {
      e.stopPropagation();
      killAnimationsForElement(nodeGroup);
      
      // Enhanced click feedback
      const clickTween = gsap.timeline()
        .to(circle, {
          scale: 0.95,
          duration: 0.08,
          ease: "power2.out"
        })
        .to(circle, {
          scale: hoverStatesRef.current.get(node.id) ? 1.1 : 1,
          duration: 0.15,
          ease: "back.out(2)"
        });
      
      addAnimation(clickTween);
      onNodeClick(node);
    };

    nodeGroup.addEventListener('mouseenter', handleMouseEnter);
    nodeGroup.addEventListener('mouseleave', handleMouseLeave);
    nodeGroup.addEventListener('click', handleClick);

    // Smooth entrance animation with better stagger
    gsap.set(nodeGroup, { scale: 0, opacity: 0 });
    const entranceTween = gsap.to(nodeGroup, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      delay: Math.min(index * 0.025, 1),
      ease: "back.out(1.4)"
    });
    addAnimation(entranceTween);

    svg.appendChild(nodeGroup);
  };

  const renderOptimizedConnections = (svg: SVGSVGElement, nodes: HierarchicalNode[], positions: Array<{ x: number; y: number }>, connections: FilteredConnections) => {
    // Show only the top 3 most important connections
    const connectionsToRender = connections.primary.slice(0, 3);
    
    connectionsToRender.forEach((connection, index) => {
      const sourceIndex = nodes.findIndex(n => n.id === connection.source);
      const targetIndex = nodes.findIndex(n => n.id === connection.target);
      
      if (sourceIndex >= 0 && targetIndex >= 0 && positions[sourceIndex] && positions[targetIndex]) {
        renderEnhancedConnection(svg, positions[sourceIndex], positions[targetIndex], connection.strength, index * 0.15);
      }
    });
  };

  const renderEnhancedConnection = (svg: SVGSVGElement, sourcePos: { x: number; y: number }, targetPos: { x: number; y: number }, strength: number, delay: number) => {
    // Create smooth curved path
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate control points for smooth curve
    const curvature = Math.min(distance * 0.15, 40);
    const midX = (sourcePos.x + targetPos.x) / 2;
    const midY = (sourcePos.y + targetPos.y) / 2;
    
    // Perpendicular offset for curve
    const perpX = -dy / distance * curvature;
    const perpY = dx / distance * curvature;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const pathData = `M ${sourcePos.x} ${sourcePos.y} Q ${midX + perpX} ${midY + perpY} ${targetPos.x} ${targetPos.y}`;
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', `rgba(100, 116, 139, ${0.4 + strength * 0.3})`);
    path.setAttribute('stroke-width', Math.max(1.5, strength * 2.5).toString());
    path.setAttribute('fill', 'none');
    path.setAttribute('marker-end', 'url(#arrowhead)');
    path.setAttribute('class', 'connection-line');
    path.setAttribute('opacity', '0');

    // Smooth path drawing animation
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    
    const pathTween = gsap.timeline()
      .to(path, {
        opacity: 0.8,
        duration: 0.3,
        delay: delay,
        ease: "power2.out"
      })
      .to(path, {
        strokeDashoffset: 0,
        duration: 1,
        ease: "power2.out"
      }, delay + 0.2);
    
    addAnimation(pathTween);
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
