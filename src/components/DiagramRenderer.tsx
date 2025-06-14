
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface Node {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
}

interface Edge {
  source: string;
  target: string;
  type: string;
}

interface DiagramData {
  nodes: Node[];
  edges: Edge[];
}

interface DiagramRendererProps {
  data: DiagramData;
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = svgRef.current;
    const width = 600;
    const height = 400;

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());

    // Color mapping for node types
    const nodeColors = {
      class: "#3B82F6",
      method: "#10B981", 
      variable: "#8B5CF6",
      call: "#F59E0B"
    };

    // Create edges
    data.edges.forEach((edge, index) => {
      const sourceNode = data.nodes.find(n => n.id === edge.source);
      const targetNode = data.nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', sourceNode.x.toString());
        line.setAttribute('y1', sourceNode.y.toString());
        line.setAttribute('x2', targetNode.x.toString());
        line.setAttribute('y2', targetNode.y.toString());
        line.setAttribute('stroke', '#475569');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('class', 'edge');
        line.style.opacity = '0';
        svg.appendChild(line);

        // Animate edge entrance
        gsap.to(line, {
          opacity: 0.7,
          duration: 1,
          delay: 0.5 + index * 0.1,
          ease: "power2.inOut"
        });
      }
    });

    // Create nodes
    data.nodes.forEach((node, index) => {
      const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      nodeGroup.setAttribute('class', 'node');
      nodeGroup.setAttribute('transform', `translate(${node.x}, ${node.y})`);

      // Create circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', node.type === 'class' ? '25' : '20');
      circle.setAttribute('fill', nodeColors[node.type as keyof typeof nodeColors] || '#64748B');
      circle.setAttribute('stroke', '#1E293B');
      circle.setAttribute('stroke-width', '3');
      circle.style.filter = 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))';
      circle.style.cursor = 'pointer';

      // Create text label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '0.35em');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', '12px');
      text.setAttribute('font-weight', '600');
      text.textContent = node.label.length > 12 ? node.label.slice(0, 12) + '...' : node.label;

      nodeGroup.appendChild(circle);
      nodeGroup.appendChild(text);
      svg.appendChild(nodeGroup);

      // Add hover effects
      nodeGroup.addEventListener('mouseenter', () => {
        gsap.to(circle, {
          scale: 1.2,
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
      });

      // Animate node entrance
      gsap.from(nodeGroup, {
        scale: 0,
        opacity: 0,
        rotation: 180,
        duration: 0.8,
        delay: index * 0.1,
        ease: "back.out(1.7)",
        transformOrigin: "center"
      });
    });

  }, [data]);

  return (
    <div 
      ref={containerRef}
      className="diagram-container w-full h-full flex items-center justify-center"
    >
      <svg
        ref={svgRef}
        className="max-w-full max-h-full"
        style={{ background: "transparent" }}
      />
    </div>
  );
};
