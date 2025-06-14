
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleProps {
  count: number;
  flowDirection: 'horizontal' | 'vertical' | 'spiral';
  speed: number;
  color: string;
}

const ParticleFlow: React.FC<ParticleProps> = ({ count, flowDirection, speed, color }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      switch (flowDirection) {
        case 'horizontal':
          positions[i3] += speed * 0.01;
          if (positions[i3] > 5) positions[i3] = -5;
          break;
        case 'vertical':
          positions[i3 + 1] += speed * 0.01;
          if (positions[i3 + 1] > 5) positions[i3 + 1] = -5;
          break;
        case 'spiral':
          const radius = 3;
          const angle = clock.getElapsedTime() * speed * 0.1 + i * 0.1;
          positions[i3] = Math.cos(angle) * radius;
          positions[i3 + 1] = Math.sin(angle) * radius;
          positions[i3 + 2] = Math.sin(clock.getElapsedTime() + i * 0.1) * 2;
          break;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export const CodeFlowParticles: React.FC<{
  isActive: boolean;
  className?: string;
}> = ({ isActive, className = '' }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {isActive && (
          <>
            <ParticleFlow 
              count={50} 
              flowDirection="spiral" 
              speed={1} 
              color="#3B82F6" 
            />
            <ParticleFlow 
              count={30} 
              flowDirection="horizontal" 
              speed={0.8} 
              color="#8B5CF6" 
            />
            <ParticleFlow 
              count={25} 
              flowDirection="vertical" 
              speed={0.6} 
              color="#10B981" 
            />
          </>
        )}
      </Canvas>
    </div>
  );
};
