
import { useState, useCallback } from 'react';
import { githubApi, GitHubRepository, GitHubCommit, GitHubBranch, GitHubContributor } from '@/services/githubApi';

interface GitHubData {
  repository: GitHubRepository | null;
  commits: GitHubCommit[];
  branches: GitHubBranch[];
  contributors: GitHubContributor[];
  stats: {
    totalCommits: number;
    totalContributors: number;
    totalBranches: number;
    linesChanged: number;
  };
}

interface UseGitHubDataReturn {
  data: GitHubData;
  isLoading: boolean;
  error: string | null;
  analyzeRepository: (url: string) => Promise<void>;
  progress: number;
}

export const useGitHubData = (): UseGitHubDataReturn => {
  const [data, setData] = useState<GitHubData>({
    repository: null,
    commits: [],
    branches: [],
    contributors: [],
    stats: {
      totalCommits: 0,
      totalContributors: 0,
      totalBranches: 0,
      linesChanged: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

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

      // Step 1: Get repository info
      setProgress(20);
      const repository = await githubApi.getRepository(owner, repo);

      // Step 2: Get commits
      setProgress(40);
      const commits = await githubApi.getCommits(owner, repo, 50);

      // Step 3: Get branches
      setProgress(60);
      const branches = await githubApi.getBranches(owner, repo);

      // Step 4: Get contributors
      setProgress(80);
      const contributors = await githubApi.getContributors(owner, repo);

      // Calculate statistics
      const linesChanged = commits.reduce((total, commit) => {
        return total + (commit.stats?.additions || 0) + (commit.stats?.deletions || 0);
      }, 0);

      setProgress(100);

      setData({
        repository,
        commits,
        branches,
        contributors,
        stats: {
          totalCommits: commits.length,
          totalContributors: contributors.length,
          totalBranches: branches.length,
          linesChanged,
        },
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze repository');
      console.error('GitHub API error:', err);
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    analyzeRepository,
    progress,
  };
};
