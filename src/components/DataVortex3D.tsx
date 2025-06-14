
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const VortexParticles: React.FC<{ count: number; radius: number; isActive: boolean }> = ({ 
  count, 
  radius, 
  isActive 
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const spiralRadius = (i / count) * radius;
      const angle = (i / count) * Math.PI * 10;
      
      positions[i3] = Math.cos(angle) * spiralRadius;
      positions[i3 + 1] = (i / count - 0.5) * 10;
      positions[i3 + 2] = Math.sin(angle) * spiralRadius;
      
      scales[i] = Math.random() * 0.5 + 0.5;
    }
    
    return { positions, scales };
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (!pointsRef.current || !isActive) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const progress = (i / count);
      const spiralRadius = progress * radius * (1 - progress * 0.8);
      const angle = progress * Math.PI * 10 + time * 2;
      const height = (progress - 0.5) * 10;
      
      // Spiral inward motion
      positions[i3] = Math.cos(angle) * spiralRadius;
      positions[i3 + 1] = height - time * 0.5;
      positions[i3 + 2] = Math.sin(angle) * spiralRadius;
      
      // Reset particles that reach the center
      if (spiralRadius < 0.1 || positions[i3 + 1] < -6) {
        const resetRadius = radius;
        const resetAngle = Math.random() * Math.PI * 2;
        positions[i3] = Math.cos(resetAngle) * resetRadius;
        positions[i3 + 1] = 5;
        positions[i3 + 2] = Math.sin(resetAngle) * resetRadius;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={particlesPosition.positions} stride={3}>
      <PointMaterial
        transparent
        color="#00ff88"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const CentralCore: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.5;
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      
      if (isActive) {
        const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.2;
        sphereRef.current.scale.setScalar(scale);
      }
    }
  });

  return (
    <mesh ref={sphereRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial 
        color="#ff0088" 
        emissive="#440022"
        transparent 
        opacity={0.8}
      />
    </mesh>
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
        camera={{ position: [0, 3, 8], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 0]} intensity={1} color="#ff0088" />
        <pointLight position={[0, 5, 5]} intensity={0.5} color="#0088ff" />
        
        <CentralCore isActive={isActive} />
        
        <VortexParticles 
          count={100 * intensity} 
          radius={4} 
          isActive={isActive} 
        />
        
        <VortexParticles 
          count={50 * intensity} 
          radius={6} 
          isActive={isActive} 
        />
      </Canvas>
    </div>
  );
};
