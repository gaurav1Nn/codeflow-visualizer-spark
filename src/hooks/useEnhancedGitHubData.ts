
import { useState, useCallback } from 'react';
import { githubApi, GitHubRepository, GitHubCommit, GitHubBranch, GitHubContributor } from '@/services/githubApi';
import { enhancedRepositoryAnalyzer, EnhancedRepositoryStructure } from '@/services/enhancedRepositoryAnalyzer';
import { enhancedChatContextManager } from '@/services/enhancedChatContextManager';

interface EnhancedGitHubData {
  repository: GitHubRepository | null;
  commits: GitHubCommit[];
  branches: GitHubBranch[];
  contributors: GitHubContributor[];
  structure: EnhancedRepositoryStructure | null;
  stats: {
    totalCommits: number;
    totalContributors: number;
    totalBranches: number;
    linesChanged: number;
    maintainabilityScore: number;
    complexityScore: number;
  };
}

interface UseEnhancedGitHubDataReturn {
  data: EnhancedGitHubData;
  isLoading: boolean;
  error: string | null;
  analyzeRepository: (url: string) => Promise<void>;
  progress: number;
  currentStep: string;
}

export const useEnhancedGitHubData = (): UseEnhancedGitHubDataReturn => {
  const [data, setData] = useState<EnhancedGitHubData>({
    repository: null,
    commits: [],
    branches: [],
    contributors: [],
    structure: null,
    stats: {
      totalCommits: 0,
      totalContributors: 0,
      totalBranches: 0,
      linesChanged: 0,
      maintainabilityScore: 0,
      complexityScore: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const analyzeRepository = useCallback(async (url: string) => {
    if (!url.trim()) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    const parsed = githubApi.parseRepositoryUrl(url);
    if (!parsed) {
      setError('Invalid GitHub URL format. Please use: https://github.com/owner/repo');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      const { owner, repo } = parsed;

      // Step 1: Get basic repository info
      setCurrentStep('Fetching repository information...');
      setProgress(10);
      const repository = await githubApi.getRepository(owner, repo);

      // Step 2: Get commits
      setCurrentStep('Analyzing commit history...');
      setProgress(20);
      const commits = await githubApi.getCommits(owner, repo, 50);

      // Step 3: Get branches
      setCurrentStep('Examining branches...');
      setProgress(30);
      const branches = await githubApi.getBranches(owner, repo);

      // Step 4: Get contributors
      setCurrentStep('Identifying contributors...');
      setProgress(40);
      const contributors = await githubApi.getContributors(owner, repo);

      // Step 5: Enhanced repository structure analysis
      setCurrentStep('Performing deep code analysis...');
      setProgress(50);
      const structure = await enhancedRepositoryAnalyzer.analyzeRepository(owner, repo);

      // Step 6: Calculate enhanced statistics
      setCurrentStep('Computing advanced metrics...');
      setProgress(80);
      
      const linesChanged = commits.reduce((total, commit) => {
        return total + (commit.stats?.additions || 0) + (commit.stats?.deletions || 0);
      }, 0);

      const maintainabilityScore = structure.metrics.maintainability;
      const complexityScore = structure.metrics.complexity.average;

      setProgress(90);

      // Step 7: Update context manager
      setCurrentStep('Updating AI context...');
      enhancedChatContextManager.setContext({
        repository,
        commits,
        contributors,
        branches
      }, structure);

      setProgress(100);
      setCurrentStep('Analysis complete!');

      setData({
        repository,
        commits,
        branches,
        contributors,
        structure,
        stats: {
          totalCommits: commits.length,
          totalContributors: contributors.length,
          totalBranches: branches.length,
          linesChanged,
          maintainabilityScore,
          complexityScore,
        },
      });

      console.log('✅ Enhanced repository analysis completed:', {
        repository: repository.name,
        files: structure.nodes.length,
        connections: structure.connections.length,
        insights: structure.insights.length,
        maintainability: maintainabilityScore,
        complexity: complexityScore
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze repository';
      setError(errorMessage);
      console.error('❌ Enhanced GitHub analysis error:', err);
    } finally {
      setIsLoading(false);
      setProgress(0);
      setCurrentStep('');
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    analyzeRepository,
    progress,
    currentStep,
  };
};
