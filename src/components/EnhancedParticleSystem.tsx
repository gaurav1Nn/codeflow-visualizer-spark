
import React, { useEffect, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  type: 'glow' | 'sparkle' | 'spiral';
}

interface EnhancedParticleSystemProps {
  density?: 'light' | 'medium' | 'heavy';
  colors?: string[];
  interactive?: boolean;
}

export const EnhancedParticleSystem: React.FC<EnhancedParticleSystemProps> = ({
  density = 'medium',
  colors = ['#8b5cf6', '#3b82f6', '#ec4899', '#06b6d4'],
  interactive = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  const particleCount = density === 'light' ? 20 : density === 'medium' ? 40 : 60;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: ['glow', 'sparkle', 'spiral'][Math.floor(Math.random() * 3)] as 'glow' | 'sparkle' | 'spiral'
    }));

    // Create particle elements
    particlesRef.current.forEach(particle => {
      const element = document.createElement('div');
      element.className = `particle particle-${particle.type} animate-enhanced-float`;
      element.style.cssText = `
        position: absolute;
        left: ${particle.x}px;
        top: ${particle.y}px;
        width: ${particle.size}px;
        height: ${particle.size}px;
        opacity: ${particle.opacity};
        background: ${particle.type === 'glow' 
          ? `radial-gradient(circle, ${particle.color}80 0%, transparent 70%)`
          : particle.color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        animation-delay: ${Math.random() * 5}s;
        animation-duration: ${15 + Math.random() * 10}s;
        ${particle.type === 'sparkle' ? `box-shadow: 0 0 10px ${particle.color}80;` : ''}
        ${particle.type === 'spiral' ? `filter: blur(1px);` : ''}
      `;
      container.appendChild(element);
    });

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Animation loop
    const animate = () => {
      if (!container) return;

      const particles = container.querySelectorAll('.particle');
      
      particlesRef.current.forEach((particle, index) => {
        const element = particles[index] as HTMLElement;
        if (!element) return;

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Mouse interaction
        if (interactive) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.speedX += (dx / distance) * force * 0.01;
            particle.speedY += (dy / distance) * force * 0.01;
          }
        }

        // Boundary wrapping
        if (particle.x < -10) particle.x = window.innerWidth + 10;
        if (particle.x > window.innerWidth + 10) particle.x = -10;
        if (particle.y < -10) particle.y = window.innerHeight + 10;
        if (particle.y > window.innerHeight + 10) particle.y = -10;

        // Apply position
        element.style.left = `${particle.x}px`;
        element.style.top = `${particle.y}px`;

        // Damping
        particle.speedX *= 0.99;
        particle.speedY *= 0.99;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      // Clear particles
      const particles = container.querySelectorAll('.particle');
      particles.forEach(particle => particle.remove());
    };
  }, [particleCount, colors, interactive]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ overflow: 'hidden' }}
    />
  );
};
