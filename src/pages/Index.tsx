
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Header } from '@/components/Header';
import { GitHubIntegration } from '@/components/GitHubIntegration';
import { ProfessionalHero } from '@/components/ProfessionalHero';
import { StatsSection } from '@/components/StatsSection';
import { FeaturesGrid } from '@/components/FeaturesGrid';

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Enhanced page load animation sequence
    const tl = gsap.timeline();
    
    tl.from(".header", { 
      y: -100, 
      opacity: 0, 
      duration: 1.2, 
      ease: "back.out(1.7)" 
    })
    .from(".hero-section", { 
      scale: 0.95,
      opacity: 0, 
      duration: 1.5, 
      ease: "power3.out" 
    }, "-=0.8")
    .from(".stats-section", { 
      y: 60, 
      opacity: 0, 
      duration: 1.2, 
      ease: "power3.out" 
    }, "-=0.6")
    .from(".features-grid", { 
      y: 80, 
      opacity: 0, 
      duration: 1.2, 
      ease: "power3.out" 
    }, "-=0.4")
    .from(".main-content", { 
      y: 100, 
      opacity: 0, 
      duration: 1.2, 
      ease: "power3.out" 
    }, "-=0.2");

    // Enhanced background mesh animation
    const meshElements = document.querySelectorAll('.mesh-gradient');
    meshElements.forEach((mesh, index) => {
      gsap.to(mesh, {
        rotation: 360,
        duration: "random(20, 40)",
        repeat: -1,
        ease: "none",
        delay: index * 2
      });
    });

    // Enhanced particle system
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      gsap.to(particle, {
        y: "random(-50, 50)",
        x: "random(-50, 50)",
        rotation: "random(0, 360)",
        duration: "random(4, 8)",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: index * 0.1
      });
    });

    // Floating elements with enhanced motion
    gsap.to(".floating-element", {
      y: "random(-30, 30)",
      x: "random(-20, 20)",
      rotation: "random(-15, 15)",
      duration: "random(6, 10)",
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      stagger: {
        amount: 2,
        from: "random"
      }
    });

  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-purple-950/20 relative overflow-hidden"
    >
      {/* Enhanced Multi-Layer Background System */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Mesh Gradients */}
        <div className="mesh-gradient absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/15 to-pink-500/10 rounded-full blur-3xl opacity-60" />
        <div className="mesh-gradient absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-bl from-green-500/10 via-blue-500/15 to-purple-500/10 rounded-full blur-3xl opacity-50" />
        <div className="mesh-gradient absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-tr from-purple-500/10 via-pink-500/15 to-orange-500/10 rounded-full blur-3xl opacity-40" />
        
        {/* Enhanced Particle System */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="particle absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
            }}
          >
            <div className={`w-full h-full rounded-full ${
              Math.random() > 0.5 ? 'bg-blue-400/20' : 
              Math.random() > 0.5 ? 'bg-purple-400/20' : 'bg-pink-400/20'
            }`} />
          </div>
        ))}
        
        {/* Geometric Floating Elements */}
        <div className="floating-element absolute top-20 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/15 rounded-xl blur-xl rotate-45" />
        <div className="floating-element absolute top-40 right-1/3 w-16 h-16 bg-gradient-to-br from-green-500/10 to-blue-500/15 rounded-full blur-lg" />
        <div className="floating-element absolute bottom-40 left-1/2 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/15 rounded-2xl blur-xl -rotate-12" />
        <div className="floating-element absolute top-1/2 right-20 w-12 h-12 bg-gradient-to-br from-orange-500/10 to-red-500/15 rounded-lg blur-md rotate-30" />
      </div>

      {/* Multi-layer Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-slate-900/10 backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-900/5 to-purple-900/10 backdrop-blur-[0.3px]" />

      {/* Professional Header */}
      <div className="header relative z-50">
        <Header />
      </div>

      {/* Enhanced Hero Section */}
      <div className="hero-section relative z-20">
        <ProfessionalHero />
      </div>

      {/* Stats Section */}
      <div className="stats-section relative z-20">
        <StatsSection />
      </div>

      {/* Features Grid */}
      <div className="features-grid relative z-20">
        <FeaturesGrid />
      </div>

      {/* New 3D Visualization Section */}
      <div className="relative z-20 px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <Enhanced3DVisualization />
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content relative z-10 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <GitHubIntegration />
        </div>
      </div>
    </div>
  );
};

export default Index;
