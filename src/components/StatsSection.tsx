
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  GitBranch,
  FileCode,
  TrendingUp,
  Star
} from 'lucide-react';

export const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: "50K+",
      label: "Developers",
      description: "Trust our platform"
    },
    {
      icon: GitBranch,
      number: "2M+",
      label: "Repositories",
      description: "Analyzed to date"
    },
    {
      icon: FileCode,
      number: "100M+",
      label: "Lines of Code",
      description: "Visualized daily"
    },
    {
      icon: TrendingUp,
      number: "99.9%",
      label: "Uptime",
      description: "Reliable service"
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
            <Star className="w-4 h-4 mr-2" />
            Trusted Worldwide
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Platform Statistics
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers who trust our platform for repository analysis
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              className="glass-card hover:bg-card transition-colors duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">
                    {stat.number}
                  </div>
                  
                  <div>
                    <p className="text-foreground font-medium text-lg">{stat.label}</p>
                    <p className="text-muted-foreground text-sm">{stat.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
