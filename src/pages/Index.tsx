
import React, { useRef } from 'react';
import { Header } from '@/components/Header';
import { GitHubIntegration } from '@/components/GitHubIntegration';
import { ProfessionalHero } from '@/components/ProfessionalHero';
import { StatsSection } from '@/components/StatsSection';
import { FeaturesGrid } from '@/components/FeaturesGrid';
import { StarryBackground } from '@/components/StarryBackground';

const Index = () => {
  const githubIntegrationRef = useRef<{ analyzeRepository: (url: string) => void }>(null);

  const handleAnalyzeRepo = (repoUrl: string) => {
    if (githubIntegrationRef.current) {
      githubIntegrationRef.current.analyzeRepository(repoUrl);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Site-wide starry bubble background */}
      <StarryBackground density="medium" includeBubbles={true} />

      {/* Professional Header */}
      <Header />

      {/* Clean Hero Section */}
      <ProfessionalHero onAnalyzeRepo={handleAnalyzeRepo} />

      {/* Main Content - Repository Visualization - Now at Top */}
      <div id="github-analysis" className="relative px-6 py-20 z-10">
        <div className="container mx-auto max-w-7xl">
          <GitHubIntegration ref={githubIntegrationRef} />
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10">
        <StatsSection />
      </div>

      {/* Features Grid - Now at Bottom */}
      <div className="relative z-10">
        <FeaturesGrid />
      </div>
    </div>
  );
};

export default Index;
