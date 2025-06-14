
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface VortexProps {
  count: number;
  intensity: number;
  isActive: boolean;
}

const VortexPoints: React.FC<VortexProps> = ({ count, intensity, isActive }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 5;
      const angle = (i / count) * Math.PI * 2;
      const height = (Math.random() - 0.5) * 8;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current || !isActive) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const time = clock.getElapsedTime() * intensity;
      const angle = time + (i / count) * Math.PI * 2;
      const radius = 3 + Math.sin(time + i * 0.1) * 2;
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 2] = Math.sin(angle) * radius;
      positions[i3 + 1] += Math.sin(time + i * 0.1) * 0.02;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#3B82F6"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export const DataVortex3D: React.FC<{
  isActive: boolean;
  intensity?: number;
  className?: string;
}> = ({ isActive, intensity = 1, className = '' }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 5, 5]} intensity={0.6} />
        
        {isActive && (
          <>
            <VortexPoints count={100} intensity={intensity} isActive={isActive} />
            <VortexPoints count={50} intensity={intensity * 0.8} isActive={isActive} />
          </>
        )}
      </Canvas>
    </div>
  );
};
