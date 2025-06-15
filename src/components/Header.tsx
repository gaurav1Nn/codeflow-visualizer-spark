
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Code2, 
  Share, 
  Download, 
  Bell,
  User,
  Menu
} from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Clean Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg">
              <Code2 className="w-6 h-6 text-primary-foreground" />
            </div>
            
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                CodeViz AI
              </h1>
              <p className="text-xs text-muted-foreground">Repository Analyzer</p>
            </div>
          </div>

          {/* Clean Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { label: "Features", href: "#features" },
              { label: "Analytics", href: "#analytics" },
              { label: "Documentation", href: "#docs" },
              { label: "Pricing", href: "#pricing" }
            ].map((item, index) => (
              <a 
                key={index}
                href={item.href}
                className="text-muted-foreground hover:text-foreground font-medium transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Status Badge */}
            <Badge 
              variant="secondary" 
              className="hidden sm:flex bg-secondary text-secondary-foreground border-border"
            >
              <div className="w-2 h-2 bg-primary rounded-full mr-2" />
              Online
            </Badge>

            {/* Action Buttons */}
            <div className="hidden sm:flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {/* User Profile */}
            <Button 
              variant="outline" 
              size="sm"
              className="border-border text-foreground hover:bg-muted"
            >
              <User className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Account</span>
            </Button>

            {/* Mobile Menu */}
            <Button 
              variant="ghost" 
              size="sm"
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
