
import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface TreeNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  children?: TreeNode[];
  position: [number, number, number];
  color: string;
}

interface TreeNodeProps {
  node: TreeNode;
  onNodeClick: (node: TreeNode) => void;
  isExpanded: boolean;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({ node, onNodeClick, isExpanded }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (meshRef.current) {
      gsap.fromTo(meshRef.current.scale, 
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 0.8, ease: "bounce.out" }
      );
    }
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  const handleClick = () => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: 1.2, y: 1.2, z: 1.2,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
    onNodeClick(node);
  };

  return (
    <group ref={groupRef} position={node.position}>
      {node.type === 'directory' ? (
        <Box
          ref={meshRef}
          args={[0.8, 0.8, 0.8]}
          onClick={handleClick}
        >
          <meshStandardMaterial color={node.color} transparent opacity={0.8} />
        </Box>
      ) : (
        <Sphere
          ref={meshRef}
          args={[0.4]}
          onClick={handleClick}
        >
          <meshStandardMaterial color={node.color} transparent opacity={0.9} />
        </Sphere>
      )}
      
      <Text
        position={[0, -1, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {node.name.length > 8 ? `${node.name.slice(0, 8)}...` : node.name}
      </Text>
    </group>
  );
};

const ConnectionLine: React.FC<{ start: [number, number, number]; end: [number, number, number] }> = ({ start, end }) => {
  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ], [start, end]);

  return (
    <Line
      points={points}
      color="#4A90E2"
      lineWidth={2}
      transparent
      opacity={0.6}
    />
  );
};

export const Repository3DTree: React.FC<{
  repositoryData?: any;
  className?: string;
}> = ({ repositoryData, className = '' }) => {
  const [selectedNode, setSelectedNode] = React.useState<TreeNode | null>(null);
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set());

  const mockTreeData: TreeNode = useMemo(() => ({
    id: 'root',
    name: 'Repository',
    type: 'directory',
    position: [0, 0, 0],
    color: '#8B5CF6',
    children: [
      {
        id: 'src',
        name: 'src',
        type: 'directory',
        position: [-2, -2, 0],
        color: '#3B82F6',
        children: [
          { id: 'app.tsx', name: 'App.tsx', type: 'file', position: [-3, -4, 0], color: '#10B981' },
          { id: 'main.tsx', name: 'main.tsx', type: 'file', position: [-1, -4, 0], color: '#10B981' }
        ]
      },
      {
        id: 'components',
        name: 'components',
        type: 'directory',
        position: [2, -2, 0],
        color: '#3B82F6',
        children: [
          { id: 'header.tsx', name: 'Header.tsx', type: 'file', position: [1, -4, 0], color: '#F59E0B' },
          { id: 'button.tsx', name: 'Button.tsx', type: 'file', position: [3, -4, 0], color: '#F59E0B' }
        ]
      },
      { id: 'readme.md', name: 'README.md', type: 'file', position: [0, -2, 0], color: '#EF4444' }
    ]
  }), []);

  const handleNodeClick = (node: TreeNode) => {
    setSelectedNode(node);
    if (node.type === 'directory') {
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        if (newSet.has(node.id)) {
          newSet.delete(node.id);
        } else {
          newSet.add(node.id);
        }
        return newSet;
      });
    }
  };

  const renderNode = (node: TreeNode): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id);
    
    return (
      <React.Fragment key={node.id}>
        <TreeNodeComponent
          node={node}
          onNodeClick={handleNodeClick}
          isExpanded={isExpanded}
        />
        
        {node.children && isExpanded && node.children.map(child => (
          <React.Fragment key={child.id}>
            <ConnectionLine start={node.position} end={child.position} />
            {renderNode(child)}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4A90E2" />
        
        {renderNode(mockTreeData)}
      </Canvas>
      
      {selectedNode && (
        <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 text-white">
          <h3 className="font-semibold">{selectedNode.name}</h3>
          <p className="text-sm text-slate-300">Type: {selectedNode.type}</p>
        </div>
      )}
    </div>
  );
};
