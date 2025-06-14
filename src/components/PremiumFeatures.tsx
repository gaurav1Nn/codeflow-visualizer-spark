
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Moon, 
  Sun, 
  Zap, 
  Download, 
  Share2, 
  Settings, 
  Keyboard,
  Sparkles,
  Crown,
  Star
} from 'lucide-react';

interface ExportOption {
  id: string;
  name: string;
  format: string;
  icon: React.ReactNode;
  premium: boolean;
}

export const PremiumFeatures = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState([1]);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const confettiRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const exportOptions: ExportOption[] = [
    { id: 'png', name: 'High-res PNG', format: 'PNG', icon: <Download className="w-4 h-4" />, premium: false },
    { id: 'svg', name: 'Vector SVG', format: 'SVG', icon: <Download className="w-4 h-4" />, premium: false },
    { id: 'pdf', name: 'Professional PDF', format: 'PDF', icon: <Download className="w-4 h-4" />, premium: true },
    { id: 'interactive', name: 'Interactive HTML', format: 'HTML', icon: <Zap className="w-4 h-4" />, premium: true },
    { id: 'presentation', name: 'Presentation Mode', format: 'PPTX', icon: <Star className="w-4 h-4" />, premium: true }
  ];

  const keyboardShortcuts = [
    { key: 'Ctrl + K', action: 'Quick search' },
    { key: 'Ctrl + E', action: 'Export diagram' },
    { key: 'Ctrl + S', action: 'Save current view' },
    { key: 'Space', action: 'Toggle layout mode' },
    { key: 'F', action: 'Focus on selected node' },
    { key: 'R', action: 'Reset view' },
    { key: 'T', action: 'Toggle theme' },
    { key: 'H', action: 'Show/hide help' }
  ];

  useEffect(() => {
    // Theme transition animation
    gsap.to('body', {
      duration: 0.5,
      ease: 'power2.inOut'
    });
  }, [darkMode]);

  const triggerConfetti = () => {
    // Create confetti particles
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
    
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'fixed w-2 h-2 pointer-events-none z-50';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = '50%';
      particle.style.top = '50%';
      document.body.appendChild(particle);
      
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 600,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: 2,
        ease: 'power2.out',
        onComplete: () => {
          document.body.removeChild(particle);
        }
      });
    }
  };

  const handleExport = async (option: ExportOption) => {
    setIsExporting(true);
    
    // Export animation
    gsap.to('.export-button', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      triggerConfetti();
      
      // Success notification could go here
    }, 2000);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    
    // Theme toggle animation
    gsap.to('.theme-toggle', {
      rotation: 360,
      duration: 0.6,
      ease: 'back.out(1.7)'
    });
  };

  const renderThemeControls = () => (
    <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Settings className="w-5 h-5 text-blue-400" />
          <span>Appearance & Performance</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="theme-toggle">
              {darkMode ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </div>
            <div>
              <p className="text-white font-medium">Dark Mode</p>
              <p className="text-slate-400 text-sm">Toggle between light and dark themes</p>
            </div>
          </div>
          <Switch checked={darkMode} onCheckedChange={toggleTheme} />
        </div>

        {/* Animation Speed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Animation Speed</p>
              <p className="text-slate-400 text-sm">Adjust animation performance</p>
            </div>
            <Badge variant="outline" className="border-blue-400/50 text-blue-300">
              {animationSpeed[0]}x
            </Badge>
          </div>
          <Slider
            value={animationSpeed}
            onValueChange={setAnimationSpeed}
            max={3}
            min={0.5}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Keyboard Shortcuts */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Keyboard className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-white font-medium">Keyboard Shortcuts</p>
              <p className="text-slate-400 text-sm">Power user features</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
            className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
          >
            {showKeyboardShortcuts ? 'Hide' : 'Show'}
          </Button>
        </div>

        {showKeyboardShortcuts && (
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {keyboardShortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">{shortcut.action}</span>
                  <Badge variant="outline" className="border-slate-500/50 text-slate-400 text-xs">
                    {shortcut.key}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderExportOptions = () => (
    <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Download className="w-5 h-5 text-green-400" />
          <span>Export & Sharing</span>
          <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/50">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportOptions.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              className={`export-button h-auto p-4 justify-start space-x-3 transition-all duration-300 ${
                option.premium
                  ? 'border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20'
                  : 'border-slate-600/50 hover:bg-slate-700/50'
              }`}
              onClick={() => handleExport(option)}
              disabled={isExporting}
            >
              <div className="flex items-center space-x-3">
                {option.icon}
                <div className="text-left">
                  <p className={`font-medium ${option.premium ? 'text-yellow-300' : 'text-white'}`}>
                    {option.name}
                  </p>
                  <p className="text-slate-400 text-sm">{option.format} format</p>
                </div>
              </div>
              {option.premium && (
                <Crown className="w-4 h-4 text-yellow-400 ml-auto" />
              )}
            </Button>
          ))}
        </div>

        {/* Share Options */}
        <div className="pt-4 border-t border-slate-600/50">
          <h4 className="text-white font-medium mb-3">Share Your Visualization</h4>
          <div className="grid grid-cols-2 gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Share2 className="w-4 h-4 mr-2" />
              Generate Link
            </Button>
            <Button variant="outline" className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50">
              <Sparkles className="w-4 h-4 mr-2" />
              Embed Code
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPremiumBadge = () => (
    <Card className="bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 border-yellow-500/30">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white text-lg font-bold">Premium Experience Active</h3>
            <p className="text-slate-300">Enjoy unlimited exports, advanced features, and priority support</p>
          </div>
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            <Star className="w-3 h-3 mr-1" />
            PRO
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div ref={settingsRef} className="space-y-6">
      {renderPremiumBadge()}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderThemeControls()}
        {renderExportOptions()}
      </div>

      {/* Success Confetti Container */}
      <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-40" />
      
      {/* Loading Overlay */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-slate-800/90 border-slate-700/50">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">Generating Export...</h3>
              <p className="text-slate-300">Creating your premium visualization export</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
