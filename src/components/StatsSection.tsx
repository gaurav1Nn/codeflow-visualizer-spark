
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  GitBranch,
  FileCode,
  TrendingUp,
  Star,
  Zap
} from 'lucide-react';

export const StatsSection = () => {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate stats cards
          gsap.fromTo(".stats-card", {
            y: 40,
            opacity: 0,
            scale: 0.9
          }, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)"
          });

          // Animate numbers
          gsap.fromTo(".stat-number", {
            textContent: 0
          }, {
            textContent: (i, target) => target.getAttribute('data-count'),
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            stagger: 0.2
          });
        }
      });
    }, { threshold: 0.3 });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: Users,
      number: "50K+",
      label: "Developers",
      description: "Trust our platform",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-500/10 to-blue-600/20"
    },
    {
      icon: GitBranch,
      number: "2M+",
      label: "Repositories",
      description: "Analyzed to date",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-500/10 to-green-600/20"
    },
    {
      icon: FileCode,
      number: "100M+",
      label: "Lines of Code",
      description: "Visualized daily",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-500/10 to-purple-600/20"
    },
    {
      icon: TrendingUp,
      number: "99.9%",
      label: "Uptime",
      description: "Reliable service",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-500/10 to-orange-600/20"
    }
  ];

  return (
    <div ref={statsRef} className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-purple-400/30 text-purple-300 mb-6"
          >
            <Star className="w-4 h-4 mr-2" />
            Trusted by Developers Worldwide
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Platform Statistics
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Join thousands of developers who trust our platform for their repository analysis needs
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              className={`stats-card relative overflow-hidden bg-gradient-to-br ${stat.bgColor} backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 group hover:scale-105`}
            >
              {/* Animated Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <Zap className="w-5 h-5 text-slate-400 group-hover:text-yellow-400 transition-colors duration-300" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <span 
                      className={`stat-number text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                      data-count={stat.number}
                    >
                      0
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-white font-medium text-lg">{stat.label}</p>
                    <p className="text-slate-400 text-sm">{stat.description}</p>
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
