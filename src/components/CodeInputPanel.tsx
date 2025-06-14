
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileCode, Play, Loader2 } from 'lucide-react';
import { MonacoEditor } from '@/components/MonacoEditor';

const sampleCode = `// Sample JavaScript Code
class DataProcessor {
  constructor(data) {
    this.data = data;
    this.processed = false;
  }

  async processData() {
    if (this.processed) return this.data;
    
    try {
      const result = await this.transform();
      this.processed = true;
      return result;
    } catch (error) {
      console.error('Processing failed:', error);
      throw error;
    }
  }

  transform() {
    return this.data
      .filter(item => item.active)
      .map(item => ({
        ...item,
        processed: true,
        timestamp: Date.now()
      }));
  }
}

const processor = new DataProcessor([
  { id: 1, name: 'Item 1', active: true },
  { id: 2, name: 'Item 2', active: false },
  { id: 3, name: 'Item 3', active: true }
]);

processor.processData()
  .then(result => console.log(result))
  .catch(error => console.error(error));`;

export const CodeInputPanel = () => {
  const [code, setCode] = useState(sampleCode);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState({
    lines: 0,
    functions: 0,
    classes: 0
  });

  const uploadRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Calculate basic stats
    const lines = code.split('\n').length;
    const functions = (code.match(/function|=>/g) || []).length;
    const classes = (code.match(/class\s+\w+/g) || []).length;
    
    setStats({ lines, functions, classes });

    // Animate stats update
    gsap.from(statsRef.current?.children || [], {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: "back.out(1.7)"
    });
  }, [code]);

  const handleAnalyze = () => {
    setIsProcessing(true);
    
    // Animate analyze button
    gsap.to(".analyze-btn", {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Trigger diagram generation animation
      const event = new CustomEvent('analyzeCode', { detail: { code } });
      window.dispatchEvent(event);
    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    gsap.to(uploadRef.current, {
      scale: 1.05,
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      duration: 0.3
    });
  };

  const handleDragLeave = () => {
    gsap.to(uploadRef.current, {
      scale: 1,
      backgroundColor: "rgba(51, 65, 85, 0.5)",
      duration: 0.3
    });
  };

  return (
    <Card className="h-full bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center space-x-2">
          <FileCode className="w-5 h-5 text-blue-400" />
          <span>Code Input</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 h-[calc(100%-80px)] flex flex-col">
        {/* File Upload Area */}
        <div
          ref={uploadRef}
          className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center bg-slate-700/30 transition-all duration-300 hover:border-blue-400 cursor-pointer"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => {
            e.preventDefault();
            handleDragLeave();
            // Handle file drop
          }}
        >
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-400">
            Drop your code files here or{' '}
            <span className="text-blue-400 hover:text-blue-300">browse</span>
          </p>
        </div>

        {/* Code Editor */}
        <div className="flex-1 rounded-lg overflow-hidden">
          <MonacoEditor
            value={code}
            onChange={setCode}
            language="javascript"
          />
        </div>

        {/* Stats */}
        <div ref={statsRef} className="flex space-x-4">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            {stats.lines} lines
          </Badge>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
            {stats.functions} functions
          </Badge>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
            {stats.classes} classes
          </Badge>
        </div>

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={isProcessing}
          className="analyze-btn w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Analyze Code
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
