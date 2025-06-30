
import React, { useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { GitHubIntegration } from '@/components/GitHubIntegration';
import { ProfessionalHero } from '@/components/ProfessionalHero';
import { StatsSection } from '@/components/StatsSection';
import { FeaturesGrid } from '@/components/FeaturesGrid';
import { EnhancedStarryBackground } from '@/components/EnhancedStarryBackground';
import { GeminiChat } from '@/components/GeminiChat';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const Index = () => {
  const githubIntegrationRef = useRef<{ analyzeRepository: (url: string) => void }>(null);
  const [repositoryData, setRepositoryData] = useState<any>(null);
  
  const heroRef = useScrollReveal({ direction: 'up', delay: 0.2 });
  const statsRef = useScrollReveal({ direction: 'left', delay: 0.4 });
  const featuresRef = useScrollReveal({ direction: 'right', delay: 0.6 });

  const handleAnalyzeRepo = (repoUrl: string) => {
    if (githubIntegrationRef.current) {
      githubIntegrationRef.current.analyzeRepository(repoUrl);
    }
  };

  const handleRepositoryDataChange = (data: any) => {
    setRepositoryData(data);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Enhanced site-wide starry background */}
      <EnhancedStarryBackground 
        density="medium" 
        includeBubbles={true} 
        includeStars={true} 
        includeParticles={true}
        interactive={true}
      />

      {/* Professional Header */}
      <Header />

      {/* Enhanced Hero Section */}
      <div ref={heroRef}>
        <ProfessionalHero onAnalyzeRepo={handleAnalyzeRepo} />
      </div>

      {/* Main Content - Repository Visualization */}
      <div id="github-analysis" className="relative px-6 py-20 z-10">
        <div className="container mx-auto max-w-7xl">
          <GitHubIntegration 
            ref={githubIntegrationRef} 
            onDataChange={handleRepositoryDataChange}
          />
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div ref={statsRef} className="relative z-10">
        <StatsSection />
      </div>

      {/* Enhanced Features Grid */}
      <div ref={featuresRef} className="relative z-10">
        <FeaturesGrid />
      </div>

      {/* AI Chat Assistant */}
      <GeminiChat repositoryData={repositoryData} />
    </div>
  );
};

export default Index;
