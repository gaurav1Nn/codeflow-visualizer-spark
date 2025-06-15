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

  const filterRelevantNodes = (nodes: HierarchicalNode[]): HierarchicalNode[] => {
    // If searching, show search results
    if (searchTerm) {
      return nodes;
    }

    // Filter out less important files to reduce clutter
    const filteredNodes = nodes.filter(node => {
      // Always show directories
      if (node.type === 'directory') {
        return true;
      }

      // Show important files
      const importantFiles = [
        'package.json', 'tsconfig.json', 'vite.config.ts', 'tailwind.config.ts',
        'README.md', '.gitignore', 'index.html', 'App.tsx', 'main.tsx'
      ];
      
      const importantExtensions = ['.tsx', '.ts', '.jsx', '.js'];
      const skipFiles = ['.d.ts', '.map', '.lock', '.log'];

      // Skip unimportant files
      if (skipFiles.some(ext => node.name.includes(ext))) {
        return false;
      }

      // Include important files
      if (importantFiles.includes(node.name)) {
        return true;
      }

      // Include files with important extensions
      if (importantExtensions.includes(node.extension || '')) {
        return true;
      }

      // Skip other files unless they're at root level
      return node.level === 0;
    });

    // Limit total nodes to prevent overcrowding
    return filteredNodes.slice(0, 20);
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

    // Filter nodes to show only relevant ones
    const relevantNodes = filterRelevantNodes(visibleNodes);
    
    // Calculate optimized positions with better spacing
    const positions = calculateOptimizedPositions(relevantNodes, width, height);

    // Render connections if enabled and not too many nodes
    if (showConnections && connections.primary.length > 0 && relevantNodes.length <= 12) {
      renderConnections(svg, relevantNodes, positions, connections);
    }

    // Render nodes
    relevantNodes.forEach((node, index) => {
      const position = positions[index];
      if (position) {
        renderBubbleNode(svg, node, position, index);
      }
    });
  };

  const calculateOptimizedPositions = (nodes: HierarchicalNode[], width: number, height: number) => {
    const positions: Array<{ x: number; y: number }> = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const minSpacing = 120; // Increased minimum spacing
    const padding = 100; // Increased padding
    
    // Separate directories and files
    const directories = nodes.filter(n => n.type === 'directory');
    const files = nodes.filter(n => n.type === 'file');
    
    let positionIndex = 0;
    const usedPositions: Array<{ x: number; y: number; radius: number }> = [];
    
    const checkCollision = (x: number, y: number, radius: number) => {
      return usedPositions.some(pos => {
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        return distance < (radius + pos.radius + minSpacing);
      });
    };
    
    const findValidPosition = (baseX: number, baseY: number, radius: number, maxAttempts = 50) => {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const angle = (attempt / maxAttempts) * 2 * Math.PI;
        const offset = Math.min(attempt * 35, 200); // Increased offset
        const x = Math.max(padding + radius, Math.min(width - padding - radius, baseX + Math.cos(angle) * offset));
        const y = Math.max(padding + radius, Math.min(height - padding - radius, baseY + Math.sin(angle) * offset));
        
        if (!checkCollision(x, y, radius)) {
          usedPositions.push({ x, y, radius });
          return { x, y };
        }
      }
      // Fallback position
      const fallbackX = Math.max(padding + radius, Math.min(width - padding - radius, baseX));
      const fallbackY = Math.max(padding + radius, Math.min(height - padding - radius, baseY));
      usedPositions.push({ x: fallbackX, y: fallbackY, radius });
      return { x: fallbackX, y: fallbackY };
    };
    
    // Position directories first (they're more important)
    if (directories.length === 1) {
      // Single directory in center
      const radius = 60;
      const position = findValidPosition(centerX, centerY, radius);
      positions[positionIndex] = position;
      positionIndex++;
    } else if (directories.length > 1) {
      // Multiple directories in organized layout
      directories.forEach((dir, index) => {
        const angle = (index / directories.length) * 2 * Math.PI;
        const radius = Math.min(width, height) * 0.25; // Increased radius for better spacing
        const baseX = centerX + Math.cos(angle) * radius;
        const baseY = centerY + Math.sin(angle) * radius;
        const nodeRadius = 55;
        
        const position = findValidPosition(baseX, baseY, nodeRadius);
        positions[positionIndex] = position;
        positionIndex++;
      });
    }
    
    // Position files around directories or in outer areas
    files.forEach((file, index) => {
      let baseX: number, baseY: number;
      
      if (directories.length > 0 && index < directories.length) {
        // Position around corresponding directory
        const dirIndex = index % directories.length;
        const dirPos = positions[dirIndex];
        if (dirPos) {
          const angle = (index / files.length) * 2 * Math.PI;
          const distance = 140; // Increased distance from directory
          baseX = dirPos.x + Math.cos(angle) * distance;
          baseY = dirPos.y + Math.sin(angle) * distance;
        } else {
          baseX = centerX;
          baseY = centerY;
        }
      } else {
        // Position in outer ring with better spacing
        const angle = (index / Math.max(files.length, 1)) * 2 * Math.PI;
        const radius = Math.min(width, height) * 0.35;
        baseX = centerX + Math.cos(angle) * radius;
        baseY = centerY + Math.sin(angle) * radius;
      }
      
      const nodeRadius = getNodeRadius(file);
      const position = findValidPosition(baseX, baseY, nodeRadius);
      positions[positionIndex] = position;
      positionIndex++;
    });
    
    return positions;
  };

  const getNodeRadius = (node: HierarchicalNode): number => {
    if (node.type === 'directory') {
      return node.level === 0 ? 55 : 40;
    }
    
    // Important files get larger radius
    const importantFiles = ['App.tsx', 'main.tsx', 'index.tsx', 'package.json'];
    if (importantFiles.includes(node.name)) {
      return 35;
    }
    
    return node.level === 0 ? 30 : 25;
  };

  const renderBubbleNode = (svg: SVGSVGElement, node: HierarchicalNode, position: { x: number; y: number }, index: number) => {
    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodeGroup.setAttribute('transform', `translate(${position.x.toString()}, ${position.y.toString()})`);
    nodeGroup.style.cursor = 'pointer';

    const radius = getNodeRadius(node);

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
      indicator.setAttribute('r', (radius + 8).toString());
      indicator.setAttribute('fill', 'none');
      indicator.setAttribute('stroke', node.isExpanded ? '#10B981' : '#64748B');
      indicator.setAttribute('stroke-width', '2');
      indicator.setAttribute('opacity', '0.7');
      indicator.setAttribute('stroke-dasharray', node.isExpanded ? '0' : '8,4');
      nodeGroup.appendChild(indicator);
    }

    // Enhanced icon
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    icon.setAttribute('text-anchor', 'middle');
    icon.setAttribute('dominant-baseline', 'central');
    icon.setAttribute('fill', 'white');
    icon.setAttribute('font-size', node.level === 0 ? '18px' : '14px');
    icon.setAttribute('font-family', 'system-ui');
    icon.textContent = getNodeIcon(node);

    // Enhanced label with better positioning
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'central');
    label.setAttribute('dy', (radius + 22).toString());
    label.setAttribute('fill', 'white');
    label.setAttribute('font-size', node.level === 0 ? '10px' : '9px');
    label.setAttribute('font-weight', '600');
    label.setAttribute('font-family', 'system-ui');
    const maxLength = node.level === 0 ? 10 : 8;
    const displayName = node.name.length > maxLength ? node.name.slice(0, maxLength) + '…' : node.name;
    label.textContent = displayName;

    // Add child count indicator for expanded directories
    if (node.type === 'directory' && node.isExpanded && node.children && node.children.length > 0) {
      const childCount = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      childCount.setAttribute('text-anchor', 'middle');
      childCount.setAttribute('dominant-baseline', 'central');
      childCount.setAttribute('dy', (radius + 38).toString());
      childCount.setAttribute('fill', '#10B981');
      childCount.setAttribute('font-size', '7px');
      childCount.setAttribute('font-weight', '500');
      childCount.setAttribute('font-family', 'system-ui');
      childCount.textContent = `${node.children.length} items`;
      nodeGroup.appendChild(childCount);
    }

    nodeGroup.appendChild(circle);
    nodeGroup.appendChild(icon);
    nodeGroup.appendChild(label);

    // Enhanced hover effects with smooth transitions
    const handleMouseEnter = () => {
      const nodeId = node.id;
      if (hoverStatesRef.current.get(nodeId)) return;
      
      hoverStatesRef.current.set(nodeId, true);
      gsap.killTweensOf([circle, icon, label]);
      
      const hoverTween = gsap.timeline()
        .to(circle, {
          scale: 1.15,
          filter: "url(#glow) brightness(1.2)",
          duration: 0.25,
          ease: "power2.out"
        })
        .to(icon, {
          scale: 1.1,
          duration: 0.2,
          ease: "power2.out"
        }, "-=0.15")
        .to(label, {
          fill: "#F8FAFC",
          fontSize: node.level === 0 ? "11px" : "10px",
          duration: 0.2,
          ease: "power2.out"
        }, "-=0.2");
      
      addAnimation(hoverTween);
    };

    const handleMouseLeave = () => {
      const nodeId = node.id;
      hoverStatesRef.current.set(nodeId, false);
      gsap.killTweensOf([circle, icon, label]);
      
      const exitTween = gsap.timeline()
        .to(circle, {
          scale: 1,
          filter: "url(#glow)",
          duration: 0.2,
          ease: "power2.out"
        })
        .to(icon, {
          scale: 1,
          duration: 0.15,
          ease: "power2.out"
        }, "-=0.1")
        .to(label, {
          fill: "white",
          fontSize: node.level === 0 ? "10px" : "9px",
          duration: 0.15,
          ease: "power2.out"
        }, "-=0.15");
      
      addAnimation(exitTween);
    };

    const handleClick = (e: Event) => {
      e.stopPropagation();
      
      // Add click animation
      const clickTween = gsap.timeline()
        .to(circle, {
          scale: 0.95,
          duration: 0.1,
          ease: "power2.inOut"
        })
        .to(circle, {
          scale: 1,
          duration: 0.2,
          ease: "back.out(1.4)"
        });
      
      addAnimation(clickTween);
      onNodeClick(node);
    };

    nodeGroup.addEventListener('mouseenter', handleMouseEnter);
    nodeGroup.addEventListener('mouseleave', handleMouseLeave);
    nodeGroup.addEventListener('click', handleClick);

    // Staggered entrance animation
    gsap.set(nodeGroup, { scale: 0, opacity: 0 });
    const entranceTween = gsap.to(nodeGroup, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      delay: index * 0.1,
      ease: "back.out(1.7)"
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

    const connectionTween = gsap.to(line, {
      opacity: 0.6,
      duration: 0.5,
      delay: delay,
      ease: "power2.out"
    });
    
    addAnimation(connectionTween);
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
