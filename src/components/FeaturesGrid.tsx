
import React from 'react';
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
  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into commit patterns, code complexity, and development trends with interactive visualizations.",
      badge: "Core"
    },
    {
      icon: GitBranch,
      title: "Branch Visualization",
      description: "Clear visual representations of your repository's branch structure and merge patterns.",
      badge: "Popular"
    },
    {
      icon: Users,
      title: "Team Analytics",
      description: "Comprehensive analysis of team contributions, activity patterns, and collaboration insights.",
      badge: "Team"
    },
    {
      icon: FileText,
      title: "Code Intelligence",
      description: "AI-powered code analysis with quality metrics, complexity assessment, and improvement suggestions.",
      badge: "AI"
    },
    {
      icon: Shield,
      title: "Security Insights",
      description: "Automated security vulnerability detection and compliance checking for enterprise safety.",
      badge: "Security"
    },
    {
      icon: Brain,
      title: "Smart Recommendations",
      description: "Machine learning-powered suggestions for code improvements and best practices.",
      badge: "Smart"
    },
    {
      icon: Globe,
      title: "Platform Support",
      description: "Seamless integration with GitHub, GitLab, Bitbucket, and other version control platforms.",
      badge: "Universal"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Live tracking of repository changes with automated analysis and instant notifications.",
      badge: "Live"
    }
  ];

  return (
    <div className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge 
            variant="secondary" 
            className="bg-secondary text-secondary-foreground border-border mb-6"
          >
            <Zap className="w-4 h-4 mr-2" />
            Platform Features
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Everything You Need for
            <br />
            <span className="text-primary">Repository Excellence</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive tools designed to help you understand and optimize your codebase
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-8xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="glass-card hover:bg-card transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary text-xs px-2 py-1 border border-primary/20"
                  >
                    {feature.badge}
                  </Badge>
                </div>
                
                <CardTitle className="text-foreground text-lg font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>
                
                <div className="flex items-center text-sm font-medium text-primary group-hover:text-primary/80 transition-colors duration-300">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
