
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

class GitHubApiService {
  private baseUrl = 'https://api.github.com';
  private rateLimit = {
    remaining: 60,
    reset: Date.now(),
  };

  private async fetchWithRateLimit(url: string): Promise<Response> {
    const response = await fetch(url);
    
    // Update rate limit info
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    
    if (remaining) this.rateLimit.remaining = parseInt(remaining);
    if (reset) this.rateLimit.reset = parseInt(reset) * 1000;

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    const response = await this.fetchWithRateLimit(`${this.baseUrl}/repos/${owner}/${repo}`);
    return response.json();
  }

  async getCommits(owner: string, repo: string, limit = 30): Promise<GitHubCommit[]> {
    const response = await this.fetchWithRateLimit(
      `${this.baseUrl}/repos/${owner}/${repo}/commits?per_page=${limit}`
    );
    return response.json();
  }

  async getBranches(owner: string, repo: string): Promise<GitHubBranch[]> {
    const response = await this.fetchWithRateLimit(`${this.baseUrl}/repos/${owner}/${repo}/branches`);
    return response.json();
  }

  async getContributors(owner: string, repo: string): Promise<GitHubContributor[]> {
    const response = await this.fetchWithRateLimit(`${this.baseUrl}/repos/${owner}/${repo}/contributors`);
    return response.json();
  }

  async getRepositoryContents(owner: string, repo: string, path = ''): Promise<GitHubFileContent[]> {
    const response = await this.fetchWithRateLimit(
      `${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`
    );
    return response.json();
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

  getRateLimit() {
    return this.rateLimit;
  }
}

export const githubApi = new GitHubApiService();
