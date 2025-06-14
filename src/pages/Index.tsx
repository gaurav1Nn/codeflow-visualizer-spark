
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Header } from '@/components/Header';
import { CodeInputPanel } from '@/components/CodeInputPanel';
import { VisualizationCanvas } from '@/components/VisualizationCanvas';
import { AIAnalysisPanel } from '@/components/AIAnalysisPanel';
import { LegendPanel } from '@/components/LegendPanel';

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Page load animation
    const tl = gsap.timeline();
    
    tl.from(".header", { 
      y: -100, 
      opacity: 0, 
      duration: 0.8, 
      ease: "back.out(1.7)" 
    })
    .from(".code-panel", { 
      x: -300, 
      opacity: 0, 
      duration: 0.6, 
      ease: "power3.out" 
    }, "-=0.4")
    .from(".canvas-container", { 
      scale: 0.8, 
      opacity: 0, 
      duration: 0.8, 
      ease: "power2.out" 
    }, "-=0.4")
    .from(".ai-panel", { 
      y: 100, 
      opacity: 0, 
      duration: 0.6, 
      ease: "power3.out" 
    }, "-=0.4")
    .from(".legend-panel", { 
      x: 300, 
      opacity: 0, 
      duration: 0.6, 
      ease: "power3.out" 
    }, "-=0.4");

    // Background particles animation
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      gsap.to(particle, {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: index * 0.2
      });
    });

  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden"
    >
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="header">
        <Header />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 p-6 h-[calc(100vh-80px)]">
        {/* Code Input Panel */}
        <div className="code-panel col-span-12 lg:col-span-3">
          <CodeInputPanel />
        </div>

        {/* Visualization Canvas */}
        <div className="canvas-container col-span-12 lg:col-span-6">
          <VisualizationCanvas />
        </div>

        {/* Legend Panel */}
        <div className="legend-panel col-span-12 lg:col-span-3">
          <LegendPanel />
        </div>

        {/* AI Analysis Panel */}
        <div className="ai-panel col-span-12">
          <AIAnalysisPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
