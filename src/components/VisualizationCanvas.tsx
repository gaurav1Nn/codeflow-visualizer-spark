
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';
import { DiagramRenderer } from '@/components/DiagramRenderer';

export const VisualizationCanvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [diagramData, setDiagramData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Listen for code analysis events
    const handleAnalyze = (event: any) => {
      setIsGenerating(true);
      
      // Simulate diagram generation
      setTimeout(() => {
        const mockDiagramData = generateMockDiagram(event.detail.code);
        setDiagramData(mockDiagramData);
        setIsGenerating(false);
      }, 1500);
    };

    window.addEventListener('analyzeCode', handleAnalyze);
    return () => window.removeEventListener('analyzeCode', handleAnalyze);
  }, []);

  const generateMockDiagram = (code: string) => {
    // Generate mock nodes and edges based on code
    const nodes = [
      { id: 'class-1', type: 'class', label: 'DataProcessor', x: 200, y: 100 },
      { id: 'method-1', type: 'method', label: 'processData()', x: 200, y: 200 },
      { id: 'method-2', type: 'method', label: 'transform()', x: 350, y: 250 },
      { id: 'var-1', type: 'variable', label: 'processor', x: 50, y: 350 },
      { id: 'call-1', type: 'call', label: 'processData().then()', x: 200, y: 400 }
    ];

    const edges = [
      { source: 'class-1', target: 'method-1', type: 'contains' },
      { source: 'class-1', target: 'method-2', type: 'contains' },
      { source: 'method-1', target: 'method-2', type: 'calls' },
      { source: 'var-1', target: 'call-1', type: 'uses' },
      { source: 'call-1', target: 'method-1', type: 'invokes' }
    ];

    return { nodes, edges };
  };

  const handleZoomIn = () => {
    gsap.to(".diagram-container", {
      scale: "+=0.2",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleZoomOut = () => {
    gsap.to(".diagram-container", {
      scale: "-=0.2",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleReset = () => {
    gsap.to(".diagram-container", {
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  return (
    <Card className="h-full bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
            <span>Code Visualization</span>
          </CardTitle>
          
          {/* Controls */}
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="h-[calc(100%-80px)] p-0 relative overflow-hidden">
        <div
          ref={canvasRef}
          className="w-full h-full bg-gradient-to-br from-slate-900/50 to-blue-900/20 relative"
        >
          {isGenerating ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-300">Generating visualization...</p>
              </div>
            </div>
          ) : diagramData ? (
            <DiagramRenderer data={diagramData} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full" />
                </div>
                <p className="text-slate-300 text-lg mb-2">Ready to Visualize</p>
                <p className="text-slate-500 text-sm">Analyze your code to see the magic happen</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
