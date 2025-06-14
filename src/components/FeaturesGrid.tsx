
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  GitBranch,
  Users,
  FileText,
  Shield,
  Zap,
  Brain,
  Globe,
  Clock,
  ArrowRight
} from 'lucide-react';

export const FeaturesGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.fromTo(".feature-card", {
            y: 60,
            opacity: 0,
            rotationY: 15
          }, {
            y: 0,
            opacity: 1,
            rotationY: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out"
          });
        }
      });
    }, { threshold: 0.2 });

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into commit patterns, code complexity, and development trends with interactive charts and graphs.",
      badge: "Pro",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-500/10 to-blue-600/20"
    },
    {
      icon: GitBranch,
      title: "Branch Visualization",
      description: "Stunning visual representations of your repository's branch structure and merge patterns.",
      badge: "Popular",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-500/10 to-green-600/20"
    },
    {
      icon: Users,
      title: "Contributor Analytics",
      description: "Comprehensive analysis of team contributions, activity patterns, and collaboration insights.",
      badge: "Team",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-500/10 to-purple-600/20"
    },
    {
      icon: FileText,
      title: "Code Intelligence",
      description: "AI-powered code analysis with quality metrics, complexity assessment, and improvement suggestions.",
      badge: "AI",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-500/10 to-orange-600/20"
    },
    {
      icon: Shield,
      title: "Security Scanning",
      description: "Automated security vulnerability detection and compliance checking for enterprise-grade safety.",
      badge: "Security",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-500/10 to-red-600/20"
    },
    {
      icon: Brain,
      title: "Smart Recommendations",
      description: "Machine learning-powered suggestions for code improvements, refactoring opportunities, and best practices.",
      badge: "Smart",
      color: "from-pink-500 to-pink-600",
      bgColor: "from-pink-500/10 to-pink-600/20"
    },
    {
      icon: Globe,
      title: "Multi-Platform Support",
      description: "Seamless integration with GitHub, GitLab, Bitbucket, and other popular version control platforms.",
      badge: "Universal",
      color: "from-teal-500 to-teal-600",
      bgColor: "from-teal-500/10 to-teal-600/20"
    },
    {
      icon: Clock,
      title: "Real-time Monitoring",
      description: "Live tracking of repository changes, automated analysis updates, and instant notification system.",
      badge: "Live",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-500/10 to-indigo-600/20"
    }
  ];

  return (
    <div ref={gridRef} className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-xl border-green-400/30 text-green-300 mb-6"
          >
            <Zap className="w-4 h-4 mr-2" />
            Powerful Features
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Everything You Need for
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Repository Excellence
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Discover the comprehensive suite of tools designed to transform how you understand and optimize your codebase
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-8xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={`feature-card group relative overflow-hidden bg-gradient-to-br ${feature.bgColor} backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 hover:scale-105 cursor-pointer`}
            >
              {/* Animated Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`bg-gradient-to-r ${feature.color} text-white text-xs px-2 py-1`}
                  >
                    {feature.badge}
                  </Badge>
                </div>
                
                <CardTitle className="text-white text-lg font-semibold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-200 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0">
                <p className="text-slate-300 text-sm leading-relaxed mb-4 group-hover:text-slate-200 transition-colors duration-300">
                  {feature.description}
                </p>
                
                <div className="flex items-center text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </CardContent>
              
              {/* Hover Effect Border */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
