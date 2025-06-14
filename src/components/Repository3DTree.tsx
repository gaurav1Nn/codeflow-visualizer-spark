
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TreeNodeProps {
  position: [number, number, number];
  type: 'folder' | 'file';
  name: string;
  isActive: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({ position, type, isActive }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current && isActive) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      {type === 'folder' ? (
        <mesh ref={meshRef}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial 
            color={isActive ? "#3B82F6" : "#64748B"} 
            transparent 
            opacity={0.8} 
          />
        </mesh>
      ) : (
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial 
            color={isActive ? "#10B981" : "#6B7280"} 
            transparent 
            opacity={0.7} 
          />
        </mesh>
      )}
    </group>
  );
};

const ConnectionLine: React.FC<{ start: [number, number, number]; end: [number, number, number] }> = ({ start, end }) => {
  const geometry = useMemo(() => {
    const points = [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end)
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [start, end]);

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
      color: "#64748B", 
      transparent: true, 
      opacity: 0.6 
    }))} />
  );
};

export const Repository3DTree: React.FC<{
  repositoryData?: any;
  className?: string;
}> = ({ className = '' }) => {
  const nodes = useMemo(() => [
    { position: [0, 2, 0] as [number, number, number], type: 'folder' as const, name: 'src', isActive: true },
    { position: [-1, 1, 0] as [number, number, number], type: 'folder' as const, name: 'components', isActive: false },
    { position: [1, 1, 0] as [number, number, number], type: 'folder' as const, name: 'pages', isActive: false },
    { position: [-1.5, 0, 0] as [number, number, number], type: 'file' as const, name: 'Header.tsx', isActive: true },
    { position: [-0.5, 0, 0] as [number, number, number], type: 'file' as const, name: 'Index.tsx', isActive: false },
    { position: [0.5, 0, 0] as [number, number, number], type: 'file' as const, name: 'App.tsx', isActive: true },
    { position: [1.5, 0, 0] as [number, number, number], type: 'file' as const, name: 'main.tsx', isActive: false },
  ], []);

  const connections = useMemo(() => [
    { start: [0, 2, 0] as [number, number, number], end: [-1, 1, 0] as [number, number, number] },
    { start: [0, 2, 0] as [number, number, number], end: [1, 1, 0] as [number, number, number] },
    { start: [-1, 1, 0] as [number, number, number], end: [-1.5, 0, 0] as [number, number, number] },
    { start: [-1, 1, 0] as [number, number, number], end: [-0.5, 0, 0] as [number, number, number] },
    { start: [1, 1, 0] as [number, number, number], end: [0.5, 0, 0] as [number, number, number] },
    { start: [1, 1, 0] as [number, number, number], end: [1.5, 0, 0] as [number, number, number] },
  ], []);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        
        {/* Render connections */}
        {connections.map((connection, index) => (
          <ConnectionLine
            key={index}
            start={connection.start}
            end={connection.end}
          />
        ))}
        
        {/* Render nodes */}
        {nodes.map((node, index) => (
          <TreeNode
            key={index}
            position={node.position}
            type={node.type}
            name={node.name}
            isActive={node.isActive}
          />
        ))}
      </Canvas>
    </div>
  );
};
