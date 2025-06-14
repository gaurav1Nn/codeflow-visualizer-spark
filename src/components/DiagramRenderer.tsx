
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import * as d3 from 'd3';

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

    const svg = d3.select(svgRef.current);
    const container = d3.select(containerRef.current);
    
    // Clear previous content
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;

    svg.attr("width", width).attr("height", height);

    // Create groups for edges and nodes
    const edgeGroup = svg.append("g").attr("class", "edges");
    const nodeGroup = svg.append("g").attr("class", "nodes");

    // Color mapping for node types
    const nodeColors = {
      class: "#3B82F6",
      method: "#10B981", 
      variable: "#8B5CF6",
      call: "#F59E0B"
    };

    // Draw edges with GSAP animation
    const edges = edgeGroup
      .selectAll(".edge")
      .data(data.edges)
      .enter()
      .append("line")
      .attr("class", "edge")
      .attr("x1", d => {
        const sourceNode = data.nodes.find(n => n.id === d.source);
        return sourceNode ? sourceNode.x : 0;
      })
      .attr("y1", d => {
        const sourceNode = data.nodes.find(n => n.id === d.source);
        return sourceNode ? sourceNode.y : 0;
      })
      .attr("x2", d => {
        const targetNode = data.nodes.find(n => n.id === d.target);
        return targetNode ? targetNode.x : 0;
      })
      .attr("y2", d => {
        const targetNode = data.nodes.find(n => n.id === d.target);
        return targetNode ? targetNode.y : 0;
      })
      .attr("stroke", "#475569")
      .attr("stroke-width", 2)
      .attr("opacity", 0);

    // Draw nodes
    const nodeElements = nodeGroup
      .selectAll(".node")
      .data(data.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);

    // Add circles for nodes
    nodeElements
      .append("circle")
      .attr("r", d => d.type === 'class' ? 25 : 20)
      .attr("fill", d => nodeColors[d.type as keyof typeof nodeColors] || "#64748B")
      .attr("stroke", "#1E293B")
      .attr("stroke-width", 3)
      .style("filter", "drop-shadow(0px 4px 8px rgba(0,0,0,0.3))")
      .style("cursor", "pointer");

    // Add labels
    nodeElements
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .text(d => d.label.length > 12 ? d.label.slice(0, 12) + "..." : d.label);

    // Add tooltips on hover
    nodeElements
      .on("mouseenter", function(event, d) {
        gsap.to(this.querySelector("circle"), {
          scale: 1.2,
          duration: 0.3,
          ease: "power2.out",
          transformOrigin: "center"
        });
      })
      .on("mouseleave", function(event, d) {
        gsap.to(this.querySelector("circle"), {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          transformOrigin: "center"
        });
      });

    // Animate nodes entrance
    gsap.from(nodeElements.nodes(), {
      scale: 0,
      opacity: 0,
      rotation: 180,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out(1.7)",
      transformOrigin: "center"
    });

    // Animate edges entrance
    gsap.to(edges.nodes(), {
      opacity: 0.7,
      duration: 1,
      stagger: 0.1,
      delay: 0.5,
      ease: "power2.inOut"
    });

    // Add flowing particles along edges
    edges.each(function(d, i) {
      const line = d3.select(this);
      const sourceNode = data.nodes.find(n => n.id === d.source);
      const targetNode = data.nodes.find(n => n.id === d.target);
      
      if (sourceNode && targetNode) {
        const particle = svg.append("circle")
          .attr("r", 3)
          .attr("fill", "#3B82F6")
          .attr("opacity", 0.8)
          .attr("cx", sourceNode.x)
          .attr("cy", sourceNode.y);

        gsap.to(particle.node(), {
          attr: { cx: targetNode.x, cy: targetNode.y },
          duration: 2,
          repeat: -1,
          ease: "power1.inOut",
          delay: i * 0.5
        });
      }
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
