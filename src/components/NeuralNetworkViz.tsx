
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface NeuronProps {
  position: [number, number, number];
  isActive: boolean;
  size: number;
  color: string;
}

const Neuron: React.FC<NeuronProps> = ({ position, isActive, size, color }) => {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (sphereRef.current && isActive) {
      const material = sphereRef.current.material as THREE.MeshStandardMaterial;
      if (material && material.emissive) {
        material.emissive.setHex(0x0088ff);
      }
    }
  });

  return (
    <Sphere ref={sphereRef} position={position} args={[size]}>
      <meshStandardMaterial 
        color={color} 
        emissive={isActive ? "#004488" : "#000000"}
        transparent 
        opacity={0.8} 
      />
    </Sphere>
  );
};

const Synapse: React.FC<{ 
  start: [number, number, number]; 
  end: [number, number, number]; 
  isActive: boolean; 
}> = ({ start, end, isActive }) => {
  const points = React.useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ], [start, end]);

  return (
    <Line
      points={points}
      color={isActive ? "#00ff88" : "#444444"}
      lineWidth={isActive ? 3 : 1}
      transparent
      opacity={isActive ? 0.8 : 0.3}
    />
  );
};

export const NeuralNetworkViz: React.FC<{
  isProcessing: boolean;
  className?: string;
}> = ({ isProcessing, className = '' }) => {
  const [activeNeurons, setActiveNeurons] = React.useState<Set<number>>(new Set());
  const [activeSynapses, setActiveSynapses] = React.useState<Set<string>>(new Set());

  const neurons = React.useMemo(() => [
    // Input layer
    { position: [-4, 2, 0] as [number, number, number], layer: 0 },
    { position: [-4, 0, 0] as [number, number, number], layer: 0 },
    { position: [-4, -2, 0] as [number, number, number], layer: 0 },
    
    // Hidden layer 1
    { position: [-1, 3, 0] as [number, number, number], layer: 1 },
    { position: [-1, 1, 0] as [number, number, number], layer: 1 },
    { position: [-1, -1, 0] as [number, number, number], layer: 1 },
    { position: [-1, -3, 0] as [number, number, number], layer: 1 },
    
    // Hidden layer 2
    { position: [2, 2, 0] as [number, number, number], layer: 2 },
    { position: [2, 0, 0] as [number, number, number], layer: 2 },
    { position: [2, -2, 0] as [number, number, number], layer: 2 },
    
    // Output layer
    { position: [5, 1, 0] as [number, number, number], layer: 3 },
    { position: [5, -1, 0] as [number, number, number], layer: 3 }
  ], []);

  const synapses = React.useMemo(() => {
    const connections = [];
    for (let i = 0; i < neurons.length; i++) {
      for (let j = 0; j < neurons.length; j++) {
        if (neurons[j].layer === neurons[i].layer + 1) {
          connections.push({
            id: `${i}-${j}`,
            start: neurons[i].position,
            end: neurons[j].position
          });
        }
      }
    }
    return connections;
  }, [neurons]);

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      // Simulate neural network activation
      const newActiveNeurons = new Set<number>();
      const newActiveSynapses = new Set<string>();
      
      // Randomly activate neurons
      for (let i = 0; i < Math.random() * neurons.length * 0.5; i++) {
        newActiveNeurons.add(Math.floor(Math.random() * neurons.length));
      }
      
      // Activate synapses between active neurons
      synapses.forEach(synapse => {
        if (Math.random() > 0.7) {
          newActiveSynapses.add(synapse.id);
        }
      });
      
      setActiveNeurons(newActiveNeurons);
      setActiveSynapses(newActiveSynapses);
    }, 500);

    return () => clearInterval(interval);
  }, [isProcessing, neurons.length, synapses]);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 0, 5]} intensity={0.6} />
        
        {/* Render synapses first (behind neurons) */}
        {synapses.map(synapse => (
          <Synapse
            key={synapse.id}
            start={synapse.start}
            end={synapse.end}
            isActive={activeSynapses.has(synapse.id)}
          />
        ))}
        
        {/* Render neurons */}
        {neurons.map((neuron, index) => (
          <Neuron
            key={index}
            position={neuron.position}
            isActive={activeNeurons.has(index)}
            size={0.3}
            color={
              neuron.layer === 0 ? "#3B82F6" : // Input - blue
              neuron.layer === 3 ? "#EF4444" : // Output - red
              "#8B5CF6" // Hidden - purple
            }
          />
        ))}
      </Canvas>
    </div>
  );
};
