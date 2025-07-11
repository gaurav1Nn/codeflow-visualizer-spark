
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  Network, 
  Zap, 
  Brain, 
  Orbit,
  Play,
  Pause,
  RotateCcw,
  GitBranch
} from 'lucide-react';
import { CodeFlowParticles } from './CodeFlowParticles';
import { Repository3DTree } from './Repository3DTree';
import { NeuralNetworkViz } from './NeuralNetworkViz';
import { DataVortex3D } from './DataVortex3D';
import { RepositoryArchitectureVisualization } from './RepositoryArchitectureVisualization';

export const Enhanced3DVisualization: React.FC<{
  repositoryData?: any;
  repository?: any;
  commits?: any[];
  contributors?: any[];
  branches?: any[];
}> = ({ repositoryData, repository, commits = [], contributors = [], branches = [] }) => {
  const [activeTab, setActiveTab] = useState('architecture');
  const [isPlaying, setIsPlaying] = useState(true);
  const [intensity, setIntensity] = useState(1);

  const visualizations = [
    {
      id: 'architecture',
      name: 'Architecture',
      icon: GitBranch,
      description: 'Interactive repository architecture with file connections'
    },
    {
      id: 'particles',
      name: 'Code Flow',
      icon: Zap,
      description: 'Particle trails showing code execution flow'
    },
    {
      id: 'tree',
      name: '3D Repository',
      icon: Network,
      description: 'Interactive 3D repository structure'
    },
    {
      id: 'neural',
      name: 'Neural Network',
      icon: Brain,
      description: 'AI processing visualization'
    },
    {
      id: 'vortex',
      name: 'Data Vortex',
      icon: Orbit,
      description: 'Data flow spiral visualization'
    }
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const renderVisualization = () => {
    try {
      switch (activeTab) {
        case 'architecture':
          return (
            <RepositoryArchitectureVisualization
              repository={repository}
              commits={commits}
              contributors={contributors}
              branches={branches}
            />
          );
        case 'particles':
          return <CodeFlowParticles isActive={isPlaying} className="h-[500px]" />;
        case 'tree':
          return <Repository3DTree repositoryData={repositoryData} className="h-[500px]" />;
        case 'neural':
          return <NeuralNetworkViz isProcessing={isPlaying} className="h-[500px]" />;
        case 'vortex':
          return <DataVortex3D isActive={isPlaying} intensity={intensity} className="h-[500px]" />;
        default:
          return (
            <div className="h-[500px] flex items-center justify-center">
              <p className="text-slate-400">Select a visualization</p>
            </div>
          );
      }
    } catch (error) {
      console.error('Visualization error:', error);
      return (
        <div className="h-[500px] flex items-center justify-center">
          <p className="text-red-400">Error loading visualization</p>
        </div>
      );
    }
  };

  // If architecture tab is selected, render the full component without wrapper
  if (activeTab === 'architecture') {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3 text-white">
                <Cpu className="w-6 h-6 text-blue-400" />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  3D Code Visualization
                </span>
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 w-full bg-slate-700/50">
                {visualizations.map((viz) => (
                  <TabsTrigger
                    key={viz.id}
                    value={viz.id}
                    className="flex items-center space-x-2 text-xs"
                  >
                    <viz.icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{viz.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
        
        {renderVisualization()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3 text-white">
              <Cpu className="w-6 h-6 text-blue-400" />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                3D Code Visualization
              </span>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayPause}
                className="text-slate-300 hover:text-white"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-slate-300 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-4">
            <Badge variant="outline" className="text-xs">
              {isPlaying ? "Active" : "Paused"}
            </Badge>
            {activeTab === 'vortex' && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Intensity:</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={intensity}
                  onChange={(e) => setIntensity(parseFloat(e.target.value))}
                  className="w-20"
                />
                <span className="text-xs text-slate-300">{intensity.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full bg-slate-700/50">
              {visualizations.map((viz) => (
                <TabsTrigger
                  key={viz.id}
                  value={viz.id}
                  className="flex items-center space-x-2 text-xs"
                >
                  <viz.icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{viz.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {visualizations.map((viz) => (
              <TabsContent key={viz.id} value={viz.id} className="mt-6">
                <div className="mb-4">
                  <h3 className="text-white font-medium">{viz.name}</h3>
                  <p className="text-slate-400 text-sm">{viz.description}</p>
                </div>
                
                <div className="bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700/50">
                  {renderVisualization()}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
