
import React, { useRef } from 'react';
import { Header } from '@/components/Header';
import { GitHubIntegration } from '@/components/GitHubIntegration';
import { ProfessionalHero } from '@/components/ProfessionalHero';
import { StatsSection } from '@/components/StatsSection';
import { FeaturesGrid } from '@/components/FeaturesGrid';

const Index = () => {
  const githubIntegrationRef = useRef<{ analyzeRepository: (url: string) => void }>(null);

  const handleAnalyzeRepo = (repoUrl: string) => {
    if (githubIntegrationRef.current) {
      githubIntegrationRef.current.analyzeRepository(repoUrl);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Header */}
      <Header />

      {/* Clean Hero Section */}
      <ProfessionalHero onAnalyzeRepo={handleAnalyzeRepo} />

      {/* Main Content - Repository Visualization - Now at Top */}
      <div id="github-analysis" className="relative px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <GitHubIntegration ref={githubIntegrationRef} />
        </div>
      </div>

      {/* Stats Section */}
      <StatsSection />

      {/* Features Grid - Now at Bottom */}
      <FeaturesGrid />
    </div>
  );
};

export default Index;
