
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from 'lucide-react';
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
      renderHierarchicalView();
    }
  }, [visibleNodes, connections, showConnections, searchTerm]);

  const renderHierarchicalView = () => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const width = 800;
    const height = Math.max(600, visibleNodes.length * 40 + 100);

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());

    // Create definitions
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Primary connection arrow (blue)
    const primaryArrow = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    primaryArrow.setAttribute('id', 'primary-arrow');
    primaryArrow.setAttribute('markerWidth', '8');
    primaryArrow.setAttribute('markerHeight', '8');
    primaryArrow.setAttribute('refX', '7');
    primaryArrow.setAttribute('refY', '3');
    primaryArrow.setAttribute('orient', 'auto');
    
    const primaryPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    primaryPath.setAttribute('d', 'M0,0 L0,6 L6,3 z');
    primaryPath.setAttribute('fill', '#3B82F6');
    primaryArrow.appendChild(primaryPath);
    defs.appendChild(primaryArrow);

    // Secondary connection arrow (gray)
    const secondaryArrow = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    secondaryArrow.setAttribute('id', 'secondary-arrow');
    secondaryArrow.setAttribute('markerWidth', '6');
    secondaryArrow.setAttribute('markerHeight', '6');
    secondaryArrow.setAttribute('refX', '5');
    secondaryArrow.setAttribute('refY', '2');
    secondaryArrow.setAttribute('orient', 'auto');
    
    const secondaryPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    secondaryPath.setAttribute('d', 'M0,0 L0,4 L4,2 z');
    secondaryPath.setAttribute('fill', '#64748B');
    secondaryArrow.appendChild(secondaryPath);
    defs.appendChild(secondaryArrow);

    svg.appendChild(defs);

    // Dark background
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', '#0f172a');
    svg.appendChild(background);

    // Calculate positions for hierarchical layout
    const positions = calculateHierarchicalPositions(visibleNodes, width);

    // Render connections first (so they appear behind nodes)
    if (showConnections) {
      renderCleanConnections(svg, visibleNodes, positions, connections);
    }

    // Render nodes
    visibleNodes.forEach((node, index) => {
      const position = positions[index];
      renderHierarchicalNode(svg, node, position, index);
    });
  };

  const calculateHierarchicalPositions = (nodes: HierarchicalNode[], width: number) => {
    const positions = [];
    const nodeHeight = 35;
    const startY = 50;
    const leftMargin = 50;
    const indentSize = 25;

    nodes.forEach((node, index) => {
      const x = leftMargin + (node.level * indentSize);
      const y = startY + (index * nodeHeight);
      positions.push({ x, y });
    });

    return positions;
  };

  const renderHierarchicalNode = (svg: SVGSVGElement, node: HierarchicalNode, position: any, index: number) => {
    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodeGroup.setAttribute('class', 'hierarchical-node');
    nodeGroup.setAttribute('data-node-id', node.id);
    nodeGroup.setAttribute('transform', `translate(${position.x}, ${position.y})`);
    nodeGroup.style.cursor = 'pointer';

    // Background for better readability
    const nodeBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    nodeBg.setAttribute('x', '-5');
    nodeBg.setAttribute('y', '-12');
    nodeBg.setAttribute('width', '300');
    nodeBg.setAttribute('height', '24');
    nodeBg.setAttribute('fill', 'rgba(30, 41, 59, 0.6)');
    nodeBg.setAttribute('rx', '4');
    nodeGroup.appendChild(nodeBg);

    // Expansion indicator for directories
    if (node.type === 'directory' && node.children && node.children.length > 0) {
      const expandIcon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      expandIcon.setAttribute('x', '0');
      expandIcon.setAttribute('y', '0');
      expandIcon.setAttribute('text-anchor', 'middle');
      expandIcon.setAttribute('dy', '0.35em');
      expandIcon.setAttribute('fill', '#64748B');
      expandIcon.setAttribute('font-size', '12px');
      expandIcon.textContent = node.isExpanded ? '▼' : '▶';
      nodeGroup.appendChild(expandIcon);
    }

    // File/folder icon
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    icon.setAttribute('x', '20');
    icon.setAttribute('y', '0');
    icon.setAttribute('text-anchor', 'start');
    icon.setAttribute('dy', '0.35em');
    icon.setAttribute('fill', getNodeColor(node));
    icon.setAttribute('font-size', '14px');
    
    let iconText = '📄';
    if (node.type === 'directory') {
      iconText = node.isExpanded ? '📂' : '📁';
    } else if (node.extension === '.tsx' || node.extension === '.jsx') {
      iconText = '⚛️';
    } else if (node.extension === '.ts' || node.extension === '.js') {
      iconText = '📜';
    } else if (node.extension === '.css' || node.extension === '.scss') {
      iconText = '🎨';
    } else if (node.extension === '.json') {
      iconText = '📋';
    }
    
    icon.textContent = iconText;
    nodeGroup.appendChild(icon);

    // Node label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', '40');
    label.setAttribute('y', '0');
    label.setAttribute('text-anchor', 'start');
    label.setAttribute('dy', '0.35em');
    label.setAttribute('fill', 'white');
    label.setAttribute('font-size', '12px');
    label.setAttribute('font-weight', node.type === 'directory' ? '600' : '400');
    label.textContent = node.name;
    nodeGroup.appendChild(label);

    // Size info for files
    if (node.type === 'file' && node.size) {
      const sizeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      sizeLabel.setAttribute('x', `${40 + node.name.length * 7}`);
      sizeLabel.setAttribute('y', '0');
      sizeLabel.setAttribute('text-anchor', 'start');
      sizeLabel.setAttribute('dy', '0.35em');
      sizeLabel.setAttribute('fill', '#64748B');
      sizeLabel.setAttribute('font-size', '10px');
      sizeLabel.textContent = ` (${formatFileSize(node.size)})`;
      nodeGroup.appendChild(sizeLabel);
    }

    // Hover effects
    nodeGroup.addEventListener('mouseenter', () => {
      gsap.to(nodeBg, { fill: 'rgba(59, 130, 246, 0.2)', duration: 0.2 });
    });

    nodeGroup.addEventListener('mouseleave', () => {
      gsap.to(nodeBg, { fill: 'rgba(30, 41, 59, 0.6)', duration: 0.2 });
    });

    nodeGroup.addEventListener('click', () => onNodeClick(node));

    // Entrance animation
    gsap.fromTo(nodeGroup, {
      opacity: 0,
      x: -20
    }, {
      opacity: 1,
      x: 0,
      duration: 0.3,
      delay: index * 0.03,
      ease: "power2.out"
    });

    svg.appendChild(nodeGroup);
  };

  const renderCleanConnections = (svg: SVGSVGElement, nodes: HierarchicalNode[], positions: any[], connections: FilteredConnections) => {
    // Render primary connections (important ones)
    connections.primary.forEach((connection, index) => {
      const sourceIndex = nodes.findIndex(n => n.id === connection.source);
      const targetIndex = nodes.findIndex(n => n.id === connection.target);
      
      if (sourceIndex >= 0 && targetIndex >= 0) {
        renderConnection(svg, positions[sourceIndex], positions[targetIndex], 'primary', index * 0.1);
      }
    });

    // Render secondary connections (less important)
    connections.secondary.forEach((connection, index) => {
      const sourceIndex = nodes.findIndex(n => n.id === connection.source);
      const targetIndex = nodes.findIndex(n => n.id === connection.target);
      
      if (sourceIndex >= 0 && targetIndex >= 0) {
        renderConnection(svg, positions[sourceIndex], positions[targetIndex], 'secondary', (connections.primary.length + index) * 0.1);
      }
    });
  };

  const renderConnection = (svg: SVGSVGElement, sourcePos: any, targetPos: any, type: 'primary' | 'secondary', delay: number) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Calculate smooth curved path
    const startX = sourcePos.x + 280;
    const startY = sourcePos.y;
    const endX = targetPos.x - 10;
    const endY = targetPos.y;
    
    const controlX1 = startX + 30;
    const controlY1 = startY;
    const controlX2 = endX - 30;
    const controlY2 = endY;
    
    const pathData = `M ${startX} ${startY} C ${controlX1} ${controlY1} ${controlX2} ${controlY2} ${endX} ${endY}`;
    
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', type === 'primary' ? '#3B82F6' : '#64748B');
    path.setAttribute('stroke-width', type === 'primary' ? '2' : '1');
    path.setAttribute('opacity', type === 'primary' ? '0.8' : '0.5');
    path.setAttribute('marker-end', `url(#${type}-arrow)`);
    path.setAttribute('class', 'connection-path');

    // Animate path drawing
    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;
    
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1,
      delay: delay,
      ease: "power2.out"
    });

    svg.appendChild(path);
  };

  const getNodeColor = (node: HierarchicalNode): string => {
    if (node.type === 'directory') return '#8B5CF6';
    
    switch (node.language) {
      case 'TypeScript':
      case 'TSX':
        return '#3B82F6';
      case 'JavaScript':
      case 'JSX':
        return '#F59E0B';
      case 'CSS':
      case 'SCSS':
        return '#EC4899';
      case 'JSON':
        return '#10B981';
      case 'Markdown':
        return '#6B7280';
      default:
        return '#64748B';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="w-full h-full bg-slate-900/30 rounded-lg overflow-auto">
      <svg
        ref={svgRef}
        className="w-full min-h-full"
        style={{ background: "transparent" }}
      />
    </div>
  );
};
