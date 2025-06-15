
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Code2,
  ArrowRight,
  Github,
  Star
} from 'lucide-react';

export const ProfessionalHero = () => {
  return (
    <div className="relative py-24 md:py-32">
      {/* Subtle geometric background */}
      <div className="absolute inset-0 geometric-bg pointer-events-none" />
      
      <div className="container mx-auto px-6 text-center relative">
        {/* Professional Badge */}
        <div className="mb-8">
          <Badge 
            variant="secondary" 
            className="bg-secondary text-secondary-foreground border-border px-4 py-2 text-sm font-medium"
          >
            <Star className="w-4 h-4 mr-2" />
            AI-Powered Repository Analysis
          </Badge>
        </div>

        {/* Clean Title */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-foreground">
            Visualize Your
            <br />
            <span className="text-primary">Code Architecture</span>
          </h1>
          
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-secondary rounded-2xl border border-border">
              <Code2 className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Clean Subtitle */}
        <div className="mb-12">
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your repositories into interactive visualizations with AI-driven insights, 
            comprehensive analysis, and intuitive exploration tools.
          </p>
        </div>

        {/* Clean CTA Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              className="professional-button px-8 py-4 rounded-lg font-semibold text-lg"
            >
              <Github className="w-5 h-5 mr-2" />
              Analyze Repository
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="outline-button px-8 py-4 rounded-lg font-medium text-lg"
            >
              View Demo
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6 max-w-md mx-auto">
            Free to use • No registration required • Works with public repositories
          </p>
        </div>
      </div>
    </div>
  );
};
