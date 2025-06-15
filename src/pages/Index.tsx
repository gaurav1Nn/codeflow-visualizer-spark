
import React from 'react';
import { Header } from '@/components/Header';
import { GitHubIntegration } from '@/components/GitHubIntegration';
import { ProfessionalHero } from '@/components/ProfessionalHero';
import { StatsSection } from '@/components/StatsSection';
import { FeaturesGrid } from '@/components/FeaturesGrid';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Professional Header */}
      <Header />

      {/* Clean Hero Section */}
      <ProfessionalHero />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Main Content - Repository Visualization */}
      <div className="relative px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <GitHubIntegration />
        </div>
      </div>
    </div>
  );
};

export default Index;
