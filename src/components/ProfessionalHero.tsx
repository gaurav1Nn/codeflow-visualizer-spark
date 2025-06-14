
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Code2,
  Sparkles,
  ArrowRight,
  Github,
  TrendingUp,
  Zap,
  Shield,
  Star
} from 'lucide-react';

export const ProfessionalHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Enhanced hero animations
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.from(".hero-badge", {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    })
    .from(".hero-title", {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    }, "-=0.4")
    .from(".hero-subtitle", {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.6")
    .from(".hero-features .feature-pill", {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.7)",
      stagger: 0.1
    }, "-=0.4")
    .from(".hero-cta", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.3");

    // Floating icon animation
    gsap.to(".floating-icon", {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      stagger: 0.2
    });

  }, []);

  return (
    <div ref={heroRef} className="relative py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        {/* Professional Badge */}
        <div className="hero-badge mb-8">
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border-blue-400/30 text-blue-300 px-6 py-2 text-sm font-medium hover:scale-105 transition-transform duration-300"
          >
            <Star className="w-4 h-4 mr-2" />
            ✨ Professional Repository Analysis Platform
          </Badge>
        </div>

        {/* Enhanced Title */}
        <div className="hero-title mb-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Transform Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              GitHub Repositories
            </span>
          </h1>
          
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="floating-icon">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl backdrop-blur-xl border border-blue-400/20">
                <Code2 className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="floating-icon">
              <div className="p-3 bg-gradient-to-br from-green-500/20 to-blue-600/20 rounded-2xl backdrop-blur-xl border border-green-400/20">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="floating-icon">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl backdrop-blur-xl border border-purple-400/20">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Subtitle */}
        <div className="hero-subtitle mb-12">
          <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed font-light">
            Unlock powerful insights with <span className="text-blue-300 font-medium">AI-driven analysis</span>, 
            beautiful <span className="text-purple-300 font-medium">interactive visualizations</span>, and 
            comprehensive <span className="text-green-300 font-medium">code intelligence</span>
          </p>
        </div>

        {/* Enhanced Feature Pills */}
        <div className="hero-features mb-12">
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {[
              { icon: Github, text: "Repository Deep Dive", color: "from-blue-500/20 to-blue-600/30 border-blue-400/30" },
              { icon: TrendingUp, text: "Commit Analytics", color: "from-green-500/20 to-green-600/30 border-green-400/30" },
              { icon: Code2, text: "Code Architecture", color: "from-purple-500/20 to-purple-600/30 border-purple-400/30" },
              { icon: Shield, text: "Security Insights", color: "from-orange-500/20 to-orange-600/30 border-orange-400/30" },
              { icon: Sparkles, text: "AI-Powered Analysis", color: "from-pink-500/20 to-pink-600/30 border-pink-400/30" }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`feature-pill px-6 py-3 bg-gradient-to-r ${feature.color} backdrop-blur-xl border rounded-full text-white font-medium hover:scale-105 transition-all duration-300 cursor-pointer group`}
              >
                <div className="flex items-center space-x-2">
                  <feature.icon className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-sm">{feature.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional CTA Section */}
        <div ref={ctaRef} className="hero-cta">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 group"
            >
              <Github className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Start Analyzing Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-slate-600/50 text-slate-200 hover:bg-slate-800/50 backdrop-blur-xl px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              View Demo
            </Button>
          </div>
          
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            No sign-up required • Free to use • Enterprise features available
          </p>
        </div>
      </div>
    </div>
  );
};
