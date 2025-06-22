
export interface RepositoryContext {
  repository: any;
  commits: any[];
  contributors: any[];
  branches: any[];
  files?: any[];
  analysis?: {
    languages: Record<string, number>;
    complexity: Record<string, number>;
    patterns: string[];
  };
}

export class ChatContextManager {
  private static instance: ChatContextManager;
  private context: RepositoryContext | null = null;
  private listeners: ((context: RepositoryContext | null) => void)[] = [];

  static getInstance(): ChatContextManager {
    if (!ChatContextManager.instance) {
      ChatContextManager.instance = new ChatContextManager();
    }
    return ChatContextManager.instance;
  }

  setContext(context: RepositoryContext | null): void {
    console.log('[ChatContextManager] Setting context:', {
      hasRepository: !!context?.repository,
      repositoryName: context?.repository?.name,
      commitsCount: context?.commits?.length,
      contributorsCount: context?.contributors?.length
    });

    this.context = context;
    this.notifyListeners();
  }

  getContext(): RepositoryContext | null {
    return this.context;
  }

  subscribe(listener: (context: RepositoryContext | null) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.context);
      } catch (error) {
        console.error('[ChatContextManager] Error in listener:', error);
      }
    });
  }

  analyzeRepository(): {
    summary: string;
    insights: string[];
    suggestions: string[];
  } {
    if (!this.context?.repository) {
      return {
        summary: 'No repository data available',
        insights: [],
        suggestions: ['Please analyze a repository first']
      };
    }

    const { repository, commits, contributors } = this.context;
    
    const insights = [];
    const suggestions = [];

    // Basic analysis
    insights.push(`Repository "${repository.name}" written primarily in ${repository.language}`);
    insights.push(`${commits.length} recent commits analyzed`);
    insights.push(`${contributors.length} contributors found`);

    if (repository.stargazers_count > 100) {
      insights.push(`Popular repository with ${repository.stargazers_count} stars`);
    }

    // Commit analysis
    if (commits.length > 0) {
      const recentCommits = commits.slice(0, 5);
      const commitMessages = recentCommits.map(c => c.commit.message.toLowerCase());
      
      if (commitMessages.some(msg => msg.includes('fix') || msg.includes('bug'))) {
        insights.push('Recent bug fixes detected in commit history');
        suggestions.push('Consider implementing more comprehensive testing');
      }

      if (commitMessages.some(msg => msg.includes('refactor'))) {
        insights.push('Recent refactoring activity detected');
      }

      if (commitMessages.some(msg => msg.includes('feat') || msg.includes('add'))) {
        insights.push('Active feature development detected');
      }
    }

    // Contributor analysis
    if (contributors.length === 1) {
      suggestions.push('Consider adding more contributors for better code review');
    } else if (contributors.length > 10) {
      insights.push('Large team with diverse contributions');
      suggestions.push('Ensure consistent coding standards across contributors');
    }

    return {
      summary: `Repository "${repository.name}" analysis complete with ${insights.length} insights found`,
      insights,
      suggestions
    };
  }

  formatForGemini(): string {
    if (!this.context) return 'No repository context available';

    const analysis = this.analyzeRepository();
    
    return `
Repository Analysis Context:
${analysis.summary}

Key Insights:
${analysis.insights.map(insight => `- ${insight}`).join('\n')}

Suggestions:
${analysis.suggestions.map(suggestion => `- ${suggestion}`).join('\n')}

Raw Data Available:
- Repository: ${this.context.repository.name}
- Language: ${this.context.repository.language}
- Stars: ${this.context.repository.stargazers_count}
- Forks: ${this.context.repository.forks_count}
- Recent Commits: ${this.context.commits.length}
- Contributors: ${this.context.contributors.length}
`;
  }

  validateContext(): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!this.context) {
      issues.push('No repository context set');
      return { isValid: false, issues };
    }

    if (!this.context.repository) {
      issues.push('Repository data missing');
    }

    if (!this.context.commits || this.context.commits.length === 0) {
      issues.push('No commit data available');
    }

    if (!this.context.contributors || this.context.contributors.length === 0) {
      issues.push('No contributor data available');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

export const chatContextManager = ChatContextManager.getInstance();
