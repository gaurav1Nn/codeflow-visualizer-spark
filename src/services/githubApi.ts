
import { supabase } from '@/integrations/supabase/client';

export interface GitHubRepository {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  default_branch: string;
  private: boolean;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
}

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
  };
}

export interface GitHubContributor {
  login: string;
  contributions: number;
  avatar_url: string;
}

export interface GitHubFileContent {
  name: string;
  path: string;
  size: number;
  type: 'file' | 'dir';
  download_url?: string;
}

export interface GitHubRateLimit {
  remaining: number | null;
  reset: number | null;
}

class GitHubApiService {
  private rateLimit: GitHubRateLimit = {
    remaining: null,
    reset: null,
  };

  private async callGitHubApi(endpoint: string, owner?: string, repo?: string, params?: Record<string, any>) {
    try {
      const { data, error } = await supabase.functions.invoke('github-api', {
        body: { endpoint, owner, repo, params }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`API call failed: ${error.message}`);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Update rate limit info
      if (data.rateLimit) {
        this.rateLimit = data.rateLimit;
      }

      return data.data;
    } catch (error) {
      console.error('GitHub API service error:', error);
      throw error;
    }
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.callGitHubApi('/repos/{owner}/{repo}', owner, repo);
  }

  async getCommits(owner: string, repo: string, limit = 30): Promise<GitHubCommit[]> {
    return this.callGitHubApi('/repos/{owner}/{repo}/commits', owner, repo, { per_page: limit });
  }

  async getBranches(owner: string, repo: string): Promise<GitHubBranch[]> {
    return this.callGitHubApi('/repos/{owner}/{repo}/branches', owner, repo);
  }

  async getContributors(owner: string, repo: string): Promise<GitHubContributor[]> {
    return this.callGitHubApi('/repos/{owner}/{repo}/contributors', owner, repo);
  }

  async getRepositoryContents(owner: string, repo: string, path = ''): Promise<GitHubFileContent[]> {
    return this.callGitHubApi(`/repos/{owner}/{repo}/contents/${path}`, owner, repo);
  }

  async getUserRepositories(username: string, type = 'all'): Promise<GitHubRepository[]> {
    return this.callGitHubApi('/user/repos', undefined, undefined, { 
      visibility: 'all', 
      affiliation: 'owner,collaborator',
      sort: 'updated',
      per_page: 100
    });
  }

  async searchRepositories(query: string, sort = 'updated'): Promise<{ items: GitHubRepository[] }> {
    return this.callGitHubApi('/search/repositories', undefined, undefined, { 
      q: query, 
      sort, 
      per_page: 30 
    });
  }

  parseRepositoryUrl(url: string): { owner: string; repo: string } | null {
    // Support various GitHub URL formats
    const patterns = [
      /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+?)(\.git)?$/,
      /^github\.com\/([^\/]+)\/([^\/]+?)(\.git)?$/,
      /^([^\/]+)\/([^\/]+)$/
    ];

    for (const pattern of patterns) {
      const match = url.trim().match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2]
        };
      }
    }

    return null;
  }

  getRateLimit(): GitHubRateLimit {
    return this.rateLimit;
  }

  isTokenConfigured(): boolean {
    // We can't directly check the token from frontend, but we can make a test call
    return true; // The edge function will handle token validation
  }
}

export const githubApi = new GitHubApiService();
