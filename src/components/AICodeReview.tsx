
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MonacoEditor } from './MonacoEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Info, Zap, Download, Sparkles } from 'lucide-react';

interface CodeIssue {
  id: string;
  line: number;
  column: number;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  suggestion: string;
  before: string;
  after: string;
}

interface CodeMetrics {
  complexity: number;
  maintainability: number;
  testCoverage: number;
  duplicatedLines: number;
  codeSmells: number;
}

export const AICodeReview = () => {
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [issues, setIssues] = useState<CodeIssue[]>([]);
  const [metrics, setMetrics] = useState<CodeMetrics | null>(null);
  const [activeIssue, setActiveIssue] = useState<CodeIssue | null>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const issuesRef = useRef<HTMLDivElement>(null);

  // Mock analysis data
  const mockIssues: CodeIssue[] = [
    {
      id: '1',
      line: 15,
      column: 8,
      severity: 'critical',
      message: 'Potential null pointer exception',
      suggestion: 'Add null check before accessing property',
      before: 'user.profile.name',
      after: 'user?.profile?.name'
    },
    {
      id: '2',
      line: 23,
      column: 12,
      severity: 'warning',
      message: 'Function complexity too high (8/5)',
      suggestion: 'Consider breaking this function into smaller functions',
      before: 'function complexFunction() { /* 50 lines */ }',
      after: 'function simpleFunction() { /* 10 lines */ }'
    },
    {
      id: '3',
      line: 45,
      column: 5,
      severity: 'info',
      message: 'Consider using const instead of let',
      suggestion: 'Use const for variables that are not reassigned',
      before: 'let API_URL = "https://api.example.com";',
      after: 'const API_URL = "https://api.example.com";'
    }
  ];

  const mockMetrics: CodeMetrics = {
    complexity: 7.2,
    maintainability: 8.5,
    testCoverage: 78,
    duplicatedLines: 12,
    codeSmells: 3
  };

  useEffect(() => {
    if (issues.length > 0) {
      gsap.from('.issue-item', {
        x: -50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }
  }, [issues]);

  const handleAnalyzeCode = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    
    // Analyzing animation
    gsap.to('.analyze-button', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    // Simulate AI analysis
    setTimeout(() => {
      setIssues(mockIssues);
      setMetrics(mockMetrics);
      setIsAnalyzing(false);
      
      // Success animation with sparkles
      gsap.from(analysisRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
      });

      // Animate metrics with counting effect
      gsap.to('.metric-value', {
        textContent: function(i, target) {
          return target.dataset.value;
        },
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: 0.1 }
      });
    }, 3000);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500/50 bg-red-500/10';
      case 'warning': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'info': return 'border-blue-500/50 bg-blue-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const renderMetrics = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {[
        { label: 'Complexity', value: metrics?.complexity, max: 10, color: 'text-red-400' },
        { label: 'Maintainability', value: metrics?.maintainability, max: 10, color: 'text-green-400' },
        { label: 'Test Coverage', value: metrics?.testCoverage, max: 100, color: 'text-blue-400', suffix: '%' },
        { label: 'Duplicated Lines', value: metrics?.duplicatedLines, max: 100, color: 'text-yellow-400' },
        { label: 'Code Smells', value: metrics?.codeSmells, max: 10, color: 'text-purple-400' }
      ].map((metric, index) => (
        <Card key={index} className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
          <CardContent className="p-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${metric.color} metric-value`} data-value={metric.value}>
                0{metric.suffix || ''}
              </div>
              <div className="text-slate-400 text-sm">{metric.label}</div>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${metric.color.replace('text-', 'bg-')}`}
                  style={{ width: `${((metric.value || 0) / metric.max) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderIssuesList = () => (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div
          key={issue.id}
          className={`issue-item p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${getSeverityColor(issue.severity)} ${
            activeIssue?.id === issue.id ? 'ring-2 ring-blue-400/50' : ''
          }`}
          onClick={() => setActiveIssue(issue)}
        >
          <div className="flex items-start space-x-3">
            {getSeverityIcon(issue.severity)}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className={`${issue.severity === 'critical' ? 'border-red-400/50 text-red-300' : 
                  issue.severity === 'warning' ? 'border-yellow-400/50 text-yellow-300' : 'border-blue-400/50 text-blue-300'}`}>
                  {issue.severity.toUpperCase()}
                </Badge>
                <span className="text-slate-400 text-sm">Line {issue.line}:{issue.column}</span>
              </div>
              <h4 className="text-white font-semibold mb-2">{issue.message}</h4>
              <p className="text-slate-300 text-sm">{issue.suggestion}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBeforeAfter = () => {
    if (!activeIssue) return null;

    return (
      <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>Suggested Fix</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-red-400 font-semibold mb-3">Before</h4>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600/50">
                <pre className="text-sm text-slate-300 overflow-x-auto">
                  <code>{activeIssue.before}</code>
                </pre>
              </div>
            </div>
            <div>
              <h4 className="text-green-400 font-semibold mb-3">After</h4>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600/50">
                <pre className="text-sm text-slate-300 overflow-x-auto">
                  <code>{activeIssue.after}</code>
                </pre>
              </div>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button className="bg-green-600 hover:bg-green-700">
              Apply Fix
            </Button>
            <Button variant="outline" className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50">
              Ignore Issue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Code Input */}
      <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>AI Code Review Engine</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                <TabsTrigger value="editor" className="data-[state=active]:bg-slate-600">Code Editor</TabsTrigger>
                <TabsTrigger value="paste" className="data-[state=active]:bg-slate-600">Paste Code</TabsTrigger>
              </TabsList>
              
              <TabsContent value="editor" className="space-y-4">
                <div className="h-64 rounded-lg overflow-hidden">
                  <MonacoEditor
                    value={code}
                    onChange={setCode}
                    language="javascript"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="paste" className="space-y-4">
                <Textarea
                  placeholder="Paste your code here for AI analysis..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-64 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              </TabsContent>
            </Tabs>
            
            <Button
              onClick={handleAnalyzeCode}
              disabled={isAnalyzing || !code.trim()}
              className="analyze-button w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AI is analyzing your code...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze with AI</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {metrics && (
        <div ref={analysisRef} className="space-y-6">
          {renderMetrics()}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issues List */}
            <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <span>Issues Found ({issues.length})</span>
                  <Button variant="outline" size="sm" className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent ref={issuesRef}>
                {renderIssuesList()}
              </CardContent>
            </Card>

            {/* Before/After Preview */}
            <div className="space-y-6">
              {renderBeforeAfter()}
              
              {/* Quick Actions */}
              <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Apply All Fixes
                    </Button>
                    <Button variant="outline" className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50">
                      <Download className="w-4 h-4 mr-2" />
                      Generate PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
