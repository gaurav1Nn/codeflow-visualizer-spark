
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Header } from '@/components/Header';
import { GitHubIntegration } from '@/components/GitHubIntegration';
import { AICodeReview } from '@/components/AICodeReview';
import { LearningMode } from '@/components/LearningMode';
import { PremiumFeatures } from '@/components/PremiumFeatures';
import { VisualizationCanvas } from '@/components/VisualizationCanvas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitBranch, 
  Brain, 
  BookOpen, 
  Settings, 
  TrendingUp,
  Code2,
  Sparkles
} from 'lucide-react';

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('github');

  useEffect(() => {
    // Page load animation sequence
    const tl = gsap.timeline();
    
    tl.from(".header", { 
      y: -100, 
      opacity: 0, 
      duration: 0.8, 
      ease: "back.out(1.7)" 
    })
    .from(".hero-section", { 
      scale: 0.9,
      opacity: 0, 
      duration: 0.8, 
      ease: "power2.out" 
    }, "-=0.4")
    .from(".nav-tabs", { 
      y: 50, 
      opacity: 0, 
      duration: 0.6, 
      ease: "power3.out" 
    }, "-=0.4")
    .from(".main-content", { 
      y: 30, 
      opacity: 0, 
      duration: 0.8, 
      ease: "power3.out" 
    }, "-=0.2");

    // Background particles animation
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      gsap.to(particle, {
        y: "random(-30, 30)",
        x: "random(-30, 30)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: index * 0.2
      });
    });

    // Floating elements animation
    gsap.to(".floating-element", {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      stagger: 0.5
    });

  }, []);

  // Tab change animation
  useEffect(() => {
    gsap.from(".tab-content", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power3.out"
    });
  }, [activeTab]);

  const renderHeroSection = () => (
    <div className="hero-section text-center py-12 relative">
      {/* Floating decorative elements */}
      <div className="floating-element absolute top-4 left-1/4 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
      <div className="floating-element absolute top-8 right-1/3 w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-lg" />
      <div className="floating-element absolute bottom-4 left-1/3 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            CodeFlow Visualizer
          </h1>
          <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
        </div>
        
        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
          Transform your code into beautiful, interactive visual diagrams with AI-powered insights. 
          The premium development tool that makes complex code simple to understand.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            "GitHub Integration",
            "AI Code Review", 
            "Interactive Learning",
            "Premium Export",
            "Real-time Collaboration"
          ].map((feature, index) => (
            <div 
              key={index}
              className="px-4 py-2 bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-full text-slate-300 hover:border-blue-500/50 transition-all duration-300"
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabConfig = [
    {
      id: 'github',
      label: 'GitHub Hub',
      icon: <GitBranch className="w-4 h-4" />,
      component: <GitHubIntegration />
    },
    {
      id: 'ai-review',
      label: 'AI Review',
      icon: <Brain className="w-4 h-4" />,
      component: <AICodeReview />
    },
    {
      id: 'learning',
      label: 'Learning Mode',
      icon: <BookOpen className="w-4 h-4" />,
      component: <LearningMode />
    },
    {
      id: 'visualization',
      label: 'Visualization',
      icon: <TrendingUp className="w-4 h-4" />,
      component: <VisualizationCanvas />
    },
    {
      id: 'premium',
      label: 'Premium',
      icon: <Settings className="w-4 h-4" />,
      component: <PremiumFeatures />
    }
  ];

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900 relative overflow-hidden"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-900/10 to-transparent backdrop-blur-[0.5px]" />

      {/* Header */}
      <div className="header relative z-20">
        <Header />
      </div>

      {/* Hero Section */}
      {renderHeroSection()}

      {/* Main Navigation Tabs */}
      <div className="nav-tabs relative z-10 px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 h-14">
            {tabConfig.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center space-x-2 text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/50 data-[state=active]:to-purple-600/50 data-[state=active]:text-white data-[state=active]:border-blue-500/50 transition-all duration-300"
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          <div className="main-content mt-8 pb-12">
            {tabConfig.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="tab-content">
                <div className="container mx-auto max-w-7xl">
                  {tab.component}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>

      {/* Premium floating badge */}
      <div className="fixed bottom-6 right-6 z-30">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-lg border border-yellow-400/30 hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Premium Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
