
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Code2, 
  Share, 
  Download, 
  Settings, 
  Sparkles, 
  GitBranch,
  Menu,
  Bell,
  User
} from 'lucide-react';

export const Header = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Enhanced logo glow animation
    gsap.to(logoRef.current, {
      boxShadow: "0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(59, 130, 246, 0.3)",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Enhanced sparkle rotation with scale
    gsap.to(sparkleRef.current, {
      rotation: 360,
      scale: 1.2,
      duration: 6,
      repeat: -1,
      ease: "none"
    });

    // Navigation items subtle hover preparation
    gsap.set(".nav-item", {
      scale: 1,
      y: 0
    });

  }, []);

  return (
    <header className="bg-slate-900/60 backdrop-blur-2xl border-b border-slate-700/30 sticky top-0 z-50 shadow-2xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo Section */}
          <div className="flex items-center space-x-4">
            <div 
              ref={logoRef}
              className="relative p-3 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-xl shadow-2xl"
            >
              <GitBranch className="w-7 h-7 text-white" />
              <div 
                ref={sparkleRef}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                GitHub Visualizer
              </h1>
              <p className="text-xs text-slate-400 font-medium">Professional Repository Analysis</p>
            </div>
          </div>

          {/* Navigation Menu - Hidden on mobile */}
          <nav ref={navRef} className="hidden lg:flex items-center space-x-8">
            {[
              { label: "Features", href: "#features" },
              { label: "Analytics", href: "#analytics" },
              { label: "Documentation", href: "#docs" },
              { label: "Pricing", href: "#pricing" }
            ].map((item, index) => (
              <a 
                key={index}
                href={item.href}
                className="nav-item text-slate-300 hover:text-white font-medium transition-all duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Status Badge */}
            <Badge 
              variant="secondary" 
              className="hidden sm:flex bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30 backdrop-blur-xl"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              All Systems Operational
            </Badge>

            {/* Notification Bell */}
            <Button 
              variant="ghost" 
              size="sm"
              className="nav-item text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-xl relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </Button>

            {/* Action Buttons */}
            <div className="hidden sm:flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="nav-item text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-xl"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="nav-item text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-xl"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {/* User Profile */}
            <Button 
              variant="outline" 
              size="sm"
              className="nav-item border-slate-600/50 text-slate-200 hover:bg-slate-700/50 backdrop-blur-xl transition-all duration-300 rounded-xl"
            >
              <User className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Account</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm"
              className="lg:hidden text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
