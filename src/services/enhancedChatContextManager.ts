import { EnhancedRepositoryStructure, EnhancedFileNode, RepositoryInsight } from './enhancedRepositoryAnalyzer';

export interface EnhancedRepositoryContext {
  structure: EnhancedRepositoryStructure;
  repository: any;
  commits: any[];
  contributors: any[];
  branches: any[];
  
  // Enhanced context data
  codeMap: Map<string, EnhancedFileNode>;
  dependencyGraph: Map<string, string[]>;
  architectureOverview: string;
  keyInsights: RepositoryInsight[];
  codeFlowPaths: CodeFlowPath[];
  hotspots: CodeHotspot[];
}

export interface CodeFlowPath {
  id: string;
  name: string;
  description: string;
  files: string[];
  complexity: 'low' | 'medium' | 'high';
  type: 'user-journey' | 'data-flow' | 'component-hierarchy';
}

export interface CodeHotspot {
  file: string;
  type: 'complexity' | 'activity' | 'bug-prone' | 'performance';
  score: number;
  description: string;
  recommendation: string;
}

export class EnhancedChatContextManager {
  private static instance: EnhancedChatContextManager;
  private context: EnhancedRepositoryContext | null = null;
  private listeners: ((context: EnhancedRepositoryContext | null) => void)[] = [];

  static getInstance(): EnhancedChatContextManager {
    if (!EnhancedChatContextManager.instance) {
      EnhancedChatContextManager.instance = new EnhancedChatContextManager();
    }
    return EnhancedChatContextManager.instance;
  }

  setContext(repositoryData: any, structure: EnhancedRepositoryStructure): void {
    console.log('[EnhancedChatContextManager] Setting enhanced context:', {
      hasRepository: !!repositoryData?.repository,
      repositoryName: repositoryData?.repository?.name,
      totalFiles: structure.nodes.length,
      totalConnections: structure.connections.length,
      insightsCount: structure.insights.length
    });

    // Build enhanced context data structures
    const codeMap = new Map<string, EnhancedFileNode>();
    const dependencyGraph = new Map<string, string[]>();
    
    structure.nodes.forEach(node => {
      codeMap.set(node.path, node);
      dependencyGraph.set(node.path, node.dependencies);
    });

    // Generate code flow paths
    const codeFlowPaths = this.generateCodeFlowPaths(structure);
    
    // Identify hotspots
    const hotspots = this.identifyHotspots(structure);
    
    // Create architecture overview
    const architectureOverview = this.generateArchitectureOverview(structure);

    this.context = {
      structure,
      repository: repositoryData?.repository,
      commits: repositoryData?.commits || [],
      contributors: repositoryData?.contributors || [],
      branches: repositoryData?.branches || [],
      codeMap,
      dependencyGraph,
      architectureOverview,
      keyInsights: structure.insights.slice(0, 10), // Top 10 insights
      codeFlowPaths,
      hotspots
    };

    this.notifyListeners();
  }

  getContext(): EnhancedRepositoryContext | null {
    return this.context;
  }

  subscribe(listener: (context: EnhancedRepositoryContext | null) => void): () => void {
    this.listeners.push(listener);
    
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
        console.error('[EnhancedChatContextManager] Error in listener:', error);
      }
    });
  }

  // Enhanced analysis methods
  analyzeCodeFlow(startFile: string, endFile?: string): CodeFlowAnalysis {
    if (!this.context) {
      return { path: [], complexity: 0, description: 'No context available' };
    }

    const path = this.findCodePath(startFile, endFile);
    const complexity = this.calculatePathComplexity(path);
    const description = this.generateFlowDescription(path);

    return { path, complexity, description };
  }

  explainFileRelationships(filePath: string): FileRelationshipExplanation {
    if (!this.context) {
      return { 
        file: filePath, 
        purpose: 'Unknown', 
        dependencies: [], 
        dependents: [], 
        role: 'Unknown',
        suggestions: [] 
      };
    }

    const file = this.context.codeMap.get(filePath);
    if (!file) {
      return { 
        file: filePath, 
        purpose: 'File not found', 
        dependencies: [], 
        dependents: [], 
        role: 'Unknown',
        suggestions: ['Verify file path'] 
      };
    }

    const dependencies = this.getFileDependencies(filePath);
    const dependents = this.getFileDependents(filePath);
    const suggestions = this.generateFileSuggestions(file);

    return {
      file: filePath,
      purpose: file.purpose,
      dependencies,
      dependents,
      role: file.role,
      suggestions
    };
  }

  generateRepositorySummary(): RepositorySummary {
    if (!this.context) {
      return {
        overview: 'No repository data available',
        architecture: 'Unknown',
        keyFiles: [],
        metrics: {
          totalFiles: 0,
          maintainability: 0,
          complexity: 0,
          languages: []
        },
        insights: [],
        recommendations: []
      };
    }

    const { structure, repository } = this.context;
    
    return {
      overview: `${repository.name} is a ${repository.language} repository with ${structure.nodes.length} files organized in ${structure.architecture.layers.length} layers.`,
      architecture: this.context.architectureOverview,
      keyFiles: this.identifyKeyFiles(),
      metrics: {
        totalFiles: structure.metrics?.totalFiles || structure.nodes.length,
        maintainability: structure.metrics?.maintainability || 0,
        complexity: structure.metrics?.complexity?.average || 0,
        languages: structure.metrics?.languages ? Object.keys(structure.metrics.languages) : []
      },
      insights: structure.insights.slice(0, 5),
      recommendations: this.generateRecommendations()
    };
  }

  formatForGemini(): string {
    if (!this.context) return 'No repository context available';

    const summary = this.generateRepositorySummary();
    
    return `
ENHANCED REPOSITORY ANALYSIS CONTEXT:

Repository: ${this.context.repository.name}
${summary.overview}

ARCHITECTURE OVERVIEW:
${summary.architecture}

KEY FILES AND THEIR ROLES:
${summary.keyFiles.map(file => `- ${file.path}: ${file.purpose} (${file.role})`).join('\n')}

CODE FLOW PATTERNS:
${this.context.codeFlowPaths.map(flow => `- ${flow.name}: ${flow.description} (${flow.complexity} complexity)`).join('\n')}

FILE DEPENDENCIES AND RELATIONSHIPS:
${Array.from(this.context.dependencyGraph.entries()).slice(0, 10).map(([file, deps]) => 
  `- ${file} depends on: ${deps.join(', ')}`
).join('\n')}

QUALITY INSIGHTS:
${this.context.keyInsights.map(insight => 
  `- [${insight.severity.toUpperCase()}] ${insight.title}: ${insight.description}`
).join('\n')}

CODE HOTSPOTS (Areas needing attention):
${this.context.hotspots.map(hotspot => 
  `- ${hotspot.file}: ${hotspot.description} (${hotspot.type}, score: ${hotspot.score})`
).join('\n')}

TECHNICAL METRICS:
- Files: ${summary.metrics.totalFiles}
- Maintainability Score: ${summary.metrics.maintainability}/100
- Average Complexity: ${summary.metrics.complexity}
- Languages: ${summary.metrics.languages.join(', ')}

RECOMMENDATIONS:
${summary.recommendations.map(rec => `- ${rec}`).join('\n')}

Instructions for AI Assistant:
- Use this comprehensive context to provide detailed, accurate responses about the codebase
- Reference specific files, relationships, and patterns when explaining concepts
- Suggest improvements based on the identified insights and hotspots
- Help users understand the code flow and architecture
- Provide actionable recommendations based on the analysis
`;
  }

  // Private helper methods
  private generateCodeFlowPaths(structure: EnhancedRepositoryStructure): CodeFlowPath[] {
    const paths: CodeFlowPath[] = [];
    
    // Find entry points and trace common flows
    const entryPoints = structure.nodes.filter(n => n.role === 'entry-point');
    const components = structure.nodes.filter(n => n.role === 'component');
    
    if (entryPoints.length > 0 && components.length > 0) {
      paths.push({
        id: 'main-component-flow',
        name: 'Main Component Hierarchy',
        description: 'Flow from application entry point through main components',
        files: [
          ...entryPoints.map(e => e.path),
          ...components.slice(0, 5).map(c => c.path)
        ],
        complexity: components.length > 10 ? 'high' : components.length > 5 ? 'medium' : 'low',
        type: 'component-hierarchy'
      });
    }

    return paths;
  }

  private identifyHotspots(structure: EnhancedRepositoryStructure): CodeHotspot[] {
    const hotspots: CodeHotspot[] = [];
    
    structure.nodes.forEach(node => {
      if (node.complexity.cyclomatic > 8) {
        hotspots.push({
          file: node.path,
          type: 'complexity',
          score: node.complexity.cyclomatic,
          description: `High cyclomatic complexity (${node.complexity.cyclomatic})`,
          recommendation: 'Consider breaking down into smaller functions'
        });
      }
      
      if (node.maintainability.score < 60) {
        hotspots.push({
          file: node.path,
          type: 'bug-prone',
          score: 100 - node.maintainability.score,
          description: `Low maintainability score (${node.maintainability.score}/100)`,
          recommendation: 'Refactor to improve code quality and maintainability'
        });
      }
    });

    return hotspots.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  private generateArchitectureOverview(structure: EnhancedRepositoryStructure): string {
    const { layers, patterns } = structure.architecture;
    
    return `
The repository follows a ${patterns.join(', ')} architecture with ${layers.length} main layers:
${layers.map(layer => 
  `- ${layer.name}: ${layer.responsibilities.join(', ')} (${layer.files.length} files)`
).join('\n')}

This architecture promotes ${structure.architecture.principles.join(', ')}.
`;
  }

  private findCodePath(startFile: string, endFile?: string): string[] {
    // Simplified path finding - would use graph algorithms in real implementation
    if (!this.context) return [];
    
    const visited = new Set<string>();
    const path: string[] = [startFile];
    
    // Simple DFS to find connection
    const dfs = (current: string, target?: string): boolean => {
      if (target && current === target) return true;
      if (visited.has(current)) return false;
      
      visited.add(current);
      const dependencies = this.context!.dependencyGraph.get(current) || [];
      
      for (const dep of dependencies) {
        path.push(dep);
        if (dfs(dep, target)) return true;
        path.pop();
      }
      
      return false;
    };
    
    if (endFile) {
      dfs(startFile, endFile);
    } else {
      // Find any interesting path
      dfs(startFile);
    }
    
    return path;
  }

  private calculatePathComplexity(path: string[]): number {
    if (!this.context) return 0;
    
    return path.reduce((total, filePath) => {
      const file = this.context!.codeMap.get(filePath);
      return total + (file?.complexity.cyclomatic || 1);
    }, 0);
  }

  private generateFlowDescription(path: string[]): string {
    if (path.length === 0) return 'No flow path found';
    if (path.length === 1) return `Single file: ${path[0]}`;
    
    return `Flow from ${path[0]} through ${path.length - 2} intermediate files to ${path[path.length - 1]}`;
  }

  private getFileDependencies(filePath: string): FileRelationship[] {
    if (!this.context) return [];
    
    const file = this.context.codeMap.get(filePath);
    if (!file) return [];
    
    return file.dependencies.map(dep => ({
      file: dep,
      type: 'dependency',
      description: `${file.name} imports from ${dep.split('/').pop()}`
    }));
  }

  private getFileDependents(filePath: string): FileRelationship[] {
    if (!this.context) return [];
    
    const dependents: FileRelationship[] = [];
    
    this.context.codeMap.forEach((file, path) => {
      if (file.dependencies.includes(filePath)) {
        dependents.push({
          file: path,
          type: 'dependent',
          description: `${file.name} depends on ${filePath.split('/').pop()}`
        });
      }
    });
    
    return dependents;
  }

  private generateFileSuggestions(file: EnhancedFileNode): string[] {
    const suggestions: string[] = [];
    
    if (file.complexity.cyclomatic > 10) {
      suggestions.push('Consider refactoring to reduce complexity');
    }
    
    if (file.maintainability.score < 70) {
      suggestions.push('Improve code maintainability by adding documentation and reducing complexity');
    }
    
    if (file.dependencies.length > 10) {
      suggestions.push('High number of dependencies - consider dependency injection or modularization');
    }
    
    if (file.codeHealth.codeSmells.length > 0) {
      suggestions.push(`Address ${file.codeHealth.codeSmells.length} code smells`);
    }
    
    return suggestions;
  }

  private identifyKeyFiles(): Array<{path: string, purpose: string, role: string}> {
    if (!this.context) return [];
    
    const keyFiles = Array.from(this.context.codeMap.values())
      .filter(file => 
        file.role === 'entry-point' || 
        file.complexity.cyclomatic > 5 ||
        file.dependencies.length > 5 ||
        file.dependents.length > 5
      )
      .sort((a, b) => b.complexity.cyclomatic - a.complexity.cyclomatic)
      .slice(0, 10);
    
    return keyFiles.map(file => ({
      path: file.path,
      purpose: file.purpose,
      role: file.role
    }));
  }

  private generateRecommendations(): string[] {
    if (!this.context) return [];
    
    const recommendations: string[] = [];
    
    // Based on insights
    this.context.keyInsights.forEach(insight => {
      if (insight.severity === 'error') {
        recommendations.push(insight.suggestion);
      }
    });
    
    // Based on metrics
    if (this.context.structure.metrics.maintainability < 70) {
      recommendations.push('Improve overall code maintainability by addressing complexity and documentation');
    }
    
    // Based on hotspots
    if (this.context.hotspots.length > 5) {
      recommendations.push('Focus on the identified code hotspots to improve code quality');
    }
    
    return recommendations.slice(0, 5);
  }
}

// Supporting interfaces
export interface CodeFlowAnalysis {
  path: string[];
  complexity: number;
  description: string;
}

export interface FileRelationshipExplanation {
  file: string;
  purpose: string;
  dependencies: FileRelationship[];
  dependents: FileRelationship[];
  role: string;
  suggestions: string[];
}

export interface FileRelationship {
  file: string;
  type: 'dependency' | 'dependent';
  description: string;
}

export interface RepositorySummary {
  overview: string;
  architecture: string;
  keyFiles: Array<{path: string, purpose: string, role: string}>;
  metrics: {
    totalFiles: number;
    maintainability: number;
    complexity: number;
    languages: string[];
  };
  insights: RepositoryInsight[];
  recommendations: string[];
}

export const enhancedChatContextManager = EnhancedChatContextManager.getInstance();
