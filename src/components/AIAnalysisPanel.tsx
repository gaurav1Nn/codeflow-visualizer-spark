
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Lightbulb, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';

interface Analysis {
  complexity: number;
  patterns: string[];
  suggestions: string[];
  insights: string[];
}

export const AIAnalysisPanel = () => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentInsight, setCurrentInsight] = useState(0);
  
  const typewriterRef = useRef<HTMLParagraphElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for code analysis events
    const handleAnalyze = () => {
      setIsAnalyzing(true);
      
      // Simulate AI analysis
      setTimeout(() => {
        const mockAnalysis = {
          complexity: 6.2,
          patterns: ["Constructor Pattern", "Promise Chain", "Method Chaining"],
          suggestions: [
            "Consider adding error handling in the constructor",
            "The transform method could benefit from input validation",
            "Consider using async/await for better readability"
          ],
          insights: [
            "Your code follows good object-oriented principles with clear separation of concerns.",
            "The asynchronous processing pattern is well implemented with proper error handling.",
            "Consider extracting the filter and map operations into separate methods for better testability."
          ]
        };
        
        setAnalysis(mockAnalysis);
        setIsAnalyzing(false);
        animateInsights();
      }, 3000);
    };

    window.addEventListener('analyzeCode', handleAnalyze);
    return () => window.removeEventListener('analyzeCode', handleAnalyze);
  }, []);

  const animateInsights = () => {
    if (!analysis || !typewriterRef.current) return;

    const insights = analysis.insights;
    let currentIndex = 0;

    const typewriterAnimation = () => {
      if (currentIndex >= insights.length) {
        currentIndex = 0;
      }

      const text = insights[currentIndex];
      const element = typewriterRef.current;
      
      if (element) {
        element.textContent = '';
        
        gsap.to(element, {
          textContent: text,
          duration: text.length * 0.03,
          ease: "none",
          onUpdate: function() {
            const progress = this.progress();
            const currentText = text.slice(0, Math.floor(progress * text.length));
            element.textContent = currentText + (progress < 1 ? "|" : "");
          },
          onComplete: () => {
            setTimeout(() => {
              currentIndex++;
              typewriterAnimation();
            }, 3000);
          }
        });
      }
    };

    typewriterAnimation();
  };

  const animateSuggestions = () => {
    gsap.from(".suggestion-item", {
      x: -50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "power3.out"
    });
  };

  useEffect(() => {
    if (analysis) {
      animateSuggestions();
    }
  }, [analysis]);

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <span>AI Analysis</span>
          {isAnalyzing && (
            <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isAnalyzing ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-slate-300">Analyzing code structure...</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span className="text-slate-300">Detecting patterns...</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <span className="text-slate-300">Generating insights...</span>
            </div>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            {/* Complexity Score */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Complexity Score</span>
                <Badge 
                  variant="secondary" 
                  className={`${
                    analysis.complexity > 7 ? 'bg-red-500/20 text-red-400' :
                    analysis.complexity > 5 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}
                >
                  {analysis.complexity}/10
                </Badge>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(analysis.complexity / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Detected Patterns */}
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
                Detected Patterns
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.patterns.map((pattern, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="bg-blue-500/20 text-blue-400"
                  >
                    {pattern}
                  </Badge>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
                AI Insights
              </h4>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p 
                  ref={typewriterRef}
                  className="text-slate-300 leading-relaxed min-h-[60px]"
                />
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-orange-400" />
                Suggestions
              </h4>
              <div className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="suggestion-item bg-slate-700/30 rounded-lg p-3 border-l-4 border-orange-400"
                  >
                    <p className="text-slate-300 text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              AI analysis will appear here after code processing
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
