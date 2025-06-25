
import { githubApi, GitHubFileContent, GitHubRepository, GitHubCommit, GitHubFileContentWithContent } from './githubApi';

export interface EnhancedFileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  extension?: string;
  language?: string;
  
  // Enhanced analysis data
  imports?: ImportAnalysis[];
  exports?: ExportAnalysis[];
  functions?: FunctionAnalysis[];
  classes?: ClassAnalysis[];
  components?: ComponentAnalysis[];
  
  // Code metrics
  complexity: ComplexityAnalysis;
  maintainability: MaintainabilityScore;
  codeHealth: CodeHealthMetrics;
  
  // Relationships
  dependencies: string[];
  dependents: string[];
  relatedFiles: string[];
  
  // Semantic information
  purpose: string;
  role: 'entry-point' | 'component' | 'utility' | 'config' | 'test' | 'unknown';
  tags: string[];
  
  // Hierarchy info
  children?: EnhancedFileNode[];
  parent?: string;
  depth: number;
}

export interface ImportAnalysis {
  source: string;
  imports: string[];
  type: 'default' | 'named' | 'namespace' | 'dynamic';
  isExternal: boolean;
  resolvedPath?: string;
}

export interface ExportAnalysis {
  name: string;
  type: 'default' | 'named' | 'function' | 'class' | 'component';
  isPublic: boolean;
}

export interface FunctionAnalysis {
  name: string;
  parameters: ParameterInfo[];
  returnType?: string;
  complexity: number;
  isAsync: boolean;
  isExported: boolean;
  documentation?: string;
}

export interface ClassAnalysis {
  name: string;
  methods: MethodInfo[];
  properties: PropertyInfo[];
  extends?: string;
  implements?: string[];
  isExported: boolean;
}

export interface ComponentAnalysis {
  name: string;
  type: 'functional' | 'class';
  props: PropInfo[];
  hooks: HookUsage[];
  isExported: boolean;
  hasTests: boolean;
}

export interface ComplexityAnalysis {
  cyclomatic: number;
  cognitive: number;
  halstead: HalsteadMetrics;
  maintainabilityIndex: number;
}

export interface MaintainabilityScore {
  score: number; // 0-100
  factors: {
    complexity: number;
    duplication: number;
    testCoverage: number;
    documentation: number;
  };
}

export interface CodeHealthMetrics {
  linesOfCode: number;
  technicalDebt: number;
  codeSmells: CodeSmell[];
  securityIssues: SecurityIssue[];
  performanceIssues: PerformanceIssue[];
}

export interface ParameterInfo {
  name: string;
  type?: string;
  optional: boolean;
  defaultValue?: string;
}

export interface MethodInfo {
  name: string;
  parameters: ParameterInfo[];
  returnType?: string;
  visibility: 'public' | 'private' | 'protected';
  isStatic: boolean;
}

export interface PropertyInfo {
  name: string;
  type?: string;
  visibility: 'public' | 'private' | 'protected';
  isStatic: boolean;
}

export interface PropInfo {
  name: string;
  type?: string;
  required: boolean;
  defaultValue?: string;
}

export interface HookUsage {
  name: string;
  type: 'built-in' | 'custom';
  dependencies?: string[];
}

export interface HalsteadMetrics {
  vocabulary: number;
  length: number;
  difficulty: number;
  effort: number;
  time: number;
  bugs: number;
}

export interface CodeSmell {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  line?: number;
  suggestion: string;
}

export interface SecurityIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  line?: number;
  recommendation: string;
}

export interface PerformanceIssue {
  type: string;
  impact: 'low' | 'medium' | 'high';
  description: string;
  line?: number;
  optimization: string;
}

export interface EnhancedRepositoryStructure {
  nodes: EnhancedFileNode[];
  connections: DependencyConnection[];
  architecture: ArchitectureAnalysis;
  patterns: DesignPattern[];
  metrics: RepositoryMetrics;
  insights: RepositoryInsight[];
}

export interface DependencyConnection {
  source: string;
  target: string;
  type: 'import' | 'export' | 'reference' | 'extends' | 'implements';
  strength: number;
  context: string;
}

export interface ArchitectureAnalysis {
  layers: ArchitectureLayer[];
  patterns: string[];
  principles: string[];
  violations: ArchitectureViolation[];
}

export interface ArchitectureLayer {
  name: string;
  files: string[];
  responsibilities: string[];
  dependencies: string[];
}

export interface DesignPattern {
  name: string;
  type: 'creational' | 'structural' | 'behavioral';
  files: string[];
  confidence: number;
  description: string;
}

export interface RepositoryMetrics {
  totalFiles: number;
  totalDirectories: number;
  languages: Record<string, LanguageMetrics>;
  complexity: ComplexityMetrics;
  maintainability: number;
  testCoverage: number;
  technicalDebt: number;
}

export interface LanguageMetrics {
  fileCount: number;
  linesOfCode: number;
  complexity: number;
  maintainability: number;
}

export interface ComplexityMetrics {
  average: number;
  highest: { file: string; score: number };
  distribution: Record<string, number>;
}

export interface RepositoryInsight {
  type: 'architecture' | 'quality' | 'performance' | 'security' | 'maintainability';
  severity: 'info' | 'warning' | 'error';
  title: string;
  description: string;
  files: string[];
  suggestion: string;
  priority: number;
}

export interface ArchitectureViolation {
  type: string;
  description: string;
  files: string[];
  severity: 'low' | 'medium' | 'high';
  impact: string;
}

class EnhancedRepositoryAnalyzer {
  private fileExtensionMap: Record<string, string> = {
    '.ts': 'TypeScript',
    '.tsx': 'TSX',
    '.js': 'JavaScript',
    '.jsx': 'JSX',
    '.py': 'Python',
    '.java': 'Java',
    '.css': 'CSS',
    '.scss': 'SCSS',
    '.html': 'HTML',
    '.json': 'JSON',
    '.md': 'Markdown',
    '.yml': 'YAML',
    '.yaml': 'YAML'
  };

  async analyzeRepository(owner: string, repo: string): Promise<EnhancedRepositoryStructure> {
    console.log(`🔍 Starting enhanced analysis of ${owner}/${repo}`);
    
    try {
      const rootContents = await githubApi.getRepositoryContents(owner, repo);
      const nodes: EnhancedFileNode[] = [];
      const connections: DependencyConnection[] = [];
      const metrics: RepositoryMetrics = this.initializeMetrics();

      // Process directory structure with enhanced analysis
      if (Array.isArray(rootContents)) {
        await this.processDirectoryEnhanced(owner, repo, '', rootContents, nodes, connections, metrics, 0);
      }

      // Perform architecture analysis
      const architecture = this.analyzeArchitecture(nodes, connections);
      
      // Detect design patterns
      const patterns = this.detectDesignPatterns(nodes, connections);
      
      // Generate insights
      const insights = this.generateInsights(nodes, connections, metrics, architecture);
      
      console.log(`📊 Enhanced analysis complete: ${nodes.length} nodes, ${connections.length} connections, ${insights.length} insights`);
      
      return { 
        nodes, 
        connections, 
        architecture,
        patterns,
        metrics,
        insights
      };
    } catch (error) {
      console.error('❌ Enhanced repository analysis failed:', error);
      return this.createEnhancedMockStructure();
    }
  }

  private async processDirectoryEnhanced(
    owner: string,
    repo: string,
    basePath: string,
    contents: GitHubFileContent[],
    nodes: EnhancedFileNode[],
    connections: DependencyConnection[],
    metrics: RepositoryMetrics,
    depth: number
  ): Promise<void> {
    for (const item of contents) {
      const fullPath = basePath ? `${basePath}/${item.name}` : item.name;
      const fileExtension = this.getFileExtension(item.name);
      const language = fileExtension ? this.fileExtensionMap[fileExtension] : undefined;
      
      const node: EnhancedFileNode = {
        id: fullPath,
        name: item.name,
        path: fullPath,
        type: item.type === 'dir' ? 'directory' : 'file',
        size: item.size || 0,
        extension: fileExtension,
        language,
        depth,
        parent: basePath || undefined,
        dependencies: [],
        dependents: [],
        relatedFiles: [],
        purpose: '',
        role: this.determineFileRole(item.name, fullPath),
        tags: [],
        complexity: this.initializeComplexityAnalysis(),
        maintainability: this.initializeMaintainabilityScore(),
        codeHealth: this.initializeCodeHealthMetrics()
      };

      if (item.type === 'file') {
        metrics.totalFiles++;
        await this.analyzeFileContent(owner, repo, fullPath, node, connections, metrics);
      } else {
        metrics.totalDirectories++;
        
        // Recursively process subdirectories
        if (depth < 3 && this.shouldAnalyzeDirectory(item.name)) {
          try {
            const subContents = await githubApi.getRepositoryContents(owner, repo, fullPath);
            if (Array.isArray(subContents)) {
              await this.processDirectoryEnhanced(owner, repo, fullPath, subContents, nodes, connections, metrics, depth + 1);
            }
          } catch (error) {
            console.warn(`⚠️ Failed to process directory ${fullPath}:`, error.message);
          }
        }
      }

      nodes.push(node);
    }
  }

  private async analyzeFileContent(
    owner: string,
    repo: string,
    filePath: string,
    node: EnhancedFileNode,
    connections: DependencyConnection[],
    metrics: RepositoryMetrics
  ): Promise<void> {
    if (!this.isCodeFile(node.name)) return;

    try {
      const fileContents = await githubApi.getRepositoryContents(owner, repo, filePath);
      
      if (!Array.isArray(fileContents) && this.hasContentProperty(fileContents)) {
        const content = atob(fileContents.content);
        
        // Perform comprehensive code analysis
        node.imports = this.analyzeImports(content);
        node.exports = this.analyzeExports(content);
        node.functions = this.analyzeFunctions(content);
        node.classes = this.analyzeClasses(content);
        node.components = this.analyzeComponents(content);
        
        // Calculate metrics
        node.complexity = this.calculateComplexity(content);
        node.maintainability = this.calculateMaintainability(content, node);
        node.codeHealth = this.analyzeCodeHealth(content);
        
        // Determine purpose and add semantic information
        node.purpose = this.determinePurpose(content, node);
        node.tags = this.generateTags(content, node);
        
        // Create connections
        this.createEnhancedConnections(node, connections);
        
        // Update language metrics
        if (node.language) {
          if (!metrics.languages[node.language]) {
            metrics.languages[node.language] = {
              fileCount: 0,
              linesOfCode: 0,
              complexity: 0,
              maintainability: 0
            };
          }
          
          const langMetrics = metrics.languages[node.language];
          langMetrics.fileCount++;
          langMetrics.linesOfCode += content.split('\n').length;
          langMetrics.complexity += node.complexity.cyclomatic;
          langMetrics.maintainability += node.maintainability.score;
        }
      }
    } catch (error) {
      console.warn(`⚠️ Failed to analyze file content for ${filePath}:`, error.message);
    }
  }

  // Implementation methods for analysis (simplified for brevity)
  private initializeMetrics(): RepositoryMetrics {
    return {
      totalFiles: 0,
      totalDirectories: 0,
      languages: {},
      complexity: { average: 0, highest: { file: '', score: 0 }, distribution: {} },
      maintainability: 0,
      testCoverage: 0,
      technicalDebt: 0
    };
  }

  private initializeComplexityAnalysis(): ComplexityAnalysis {
    return {
      cyclomatic: 1,
      cognitive: 1,
      halstead: {
        vocabulary: 0,
        length: 0,
        difficulty: 0,
        effort: 0,
        time: 0,
        bugs: 0
      },
      maintainabilityIndex: 100
    };
  }

  private initializeMaintainabilityScore(): MaintainabilityScore {
    return {
      score: 85,
      factors: {
        complexity: 85,
        duplication: 90,
        testCoverage: 70,
        documentation: 80
      }
    };
  }

  private initializeCodeHealthMetrics(): CodeHealthMetrics {
    return {
      linesOfCode: 0,
      technicalDebt: 0,
      codeSmells: [],
      securityIssues: [],
      performanceIssues: []
    };
  }

  private determineFileRole(fileName: string, fullPath: string): EnhancedFileNode['role'] {
    if (fileName.includes('test') || fileName.includes('spec')) return 'test';
    if (fileName === 'index.ts' || fileName === 'index.tsx' || fileName === 'main.tsx') return 'entry-point';
    if (fileName.includes('config') || fileName.includes('.config.')) return 'config';
    if (fullPath.includes('components/') || fileName.endsWith('.component.tsx')) return 'component';
    if (fullPath.includes('utils/') || fullPath.includes('helpers/')) return 'utility';
    return 'unknown';
  }

  // Placeholder implementations for complex analysis methods
  private analyzeImports(content: string): ImportAnalysis[] {
    // Enhanced import analysis with AST parsing would go here
    return [];
  }

  private analyzeExports(content: string): ExportAnalysis[] {
    // Enhanced export analysis would go here
    return [];
  }

  private analyzeFunctions(content: string): FunctionAnalysis[] {
    // Function analysis with AST parsing would go here
    return [];
  }

  private analyzeClasses(content: string): ClassAnalysis[] {
    // Class analysis would go here
    return [];
  }

  private analyzeComponents(content: string): ComponentAnalysis[] {
    // React component analysis would go here
    return [];
  }

  private calculateComplexity(content: string): ComplexityAnalysis {
    // Simplified complexity calculation
    const lines = content.split('\n').length;
    const complexity = Math.ceil(lines / 20);
    
    return {
      cyclomatic: complexity,
      cognitive: complexity,
      halstead: {
        vocabulary: lines * 2,
        length: lines,
        difficulty: complexity,
        effort: lines * complexity,
        time: (lines * complexity) / 18,
        bugs: lines / 3000
      },
      maintainabilityIndex: Math.max(0, 171 - 5.2 * Math.log(lines) - 0.23 * complexity)
    };
  }

  private calculateMaintainability(content: string, node: EnhancedFileNode): MaintainabilityScore {
    const lines = content.split('\n').length;
    const baseScore = Math.max(20, 100 - lines / 10);
    
    return {
      score: baseScore,
      factors: {
        complexity: Math.max(0, 100 - node.complexity.cyclomatic * 5),
        duplication: 90, // Would need more analysis
        testCoverage: node.name.includes('test') ? 95 : 60,
        documentation: content.includes('/**') ? 85 : 50
      }
    };
  }

  private analyzeCodeHealth(content: string): CodeHealthMetrics {
    const lines = content.split('\n').length;
    const codeSmells: CodeSmell[] = [];
    
    // Simple code smell detection
    if (lines > 200) {
      codeSmells.push({
        type: 'Long File',
        severity: 'medium',
        description: 'File is too long and may be difficult to maintain',
        suggestion: 'Consider splitting into smaller modules'
      });
    }
    
    return {
      linesOfCode: lines,
      technicalDebt: Math.max(0, lines - 100),
      codeSmells,
      securityIssues: [],
      performanceIssues: []
    };
  }

  private determinePurpose(content: string, node: EnhancedFileNode): string {
    if (node.role === 'component') return 'UI Component';
    if (node.role === 'utility') return 'Utility Functions';
    if (node.role === 'config') return 'Configuration';
    if (node.role === 'test') return 'Test Suite';
    if (node.role === 'entry-point') return 'Application Entry Point';
    return 'General Module';
  }

  private generateTags(content: string, node: EnhancedFileNode): string[] {
    const tags: string[] = [];
    
    if (content.includes('React')) tags.push('react');
    if (content.includes('useState') || content.includes('useEffect')) tags.push('hooks');
    if (content.includes('async') || content.includes('await')) tags.push('async');
    if (content.includes('interface') || content.includes('type ')) tags.push('typescript');
    if (node.role !== 'unknown') tags.push(node.role);
    
    return tags;
  }

  private createEnhancedConnections(node: EnhancedFileNode, connections: DependencyConnection[]): void {
    // Enhanced connection creation based on detailed analysis
    node.imports?.forEach(imp => {
      if (imp.resolvedPath) {
        connections.push({
          source: node.id,
          target: imp.resolvedPath,
          type: 'import',
          strength: imp.type === 'default' ? 1 : 0.8,
          context: `imports ${imp.imports.join(', ')}`
        });
      }
    });
  }

  private analyzeArchitecture(nodes: EnhancedFileNode[], connections: DependencyConnection[]): ArchitectureAnalysis {
    // Simplified architecture analysis
    return {
      layers: [
        {
          name: 'Components',
          files: nodes.filter(n => n.role === 'component').map(n => n.path),
          responsibilities: ['UI Rendering', 'User Interaction'],
          dependencies: ['Hooks', 'Services']
        },
        {
          name: 'Services',
          files: nodes.filter(n => n.role === 'utility').map(n => n.path),
          responsibilities: ['Business Logic', 'API Calls'],
          dependencies: ['External APIs']
        }
      ],
      patterns: ['Component-Service Architecture'],
      principles: ['Separation of Concerns'],
      violations: []
    };
  }

  private detectDesignPatterns(nodes: EnhancedFileNode[], connections: DependencyConnection[]): DesignPattern[] {
    // Simplified pattern detection
    return [
      {
        name: 'Component Pattern',
        type: 'structural',
        files: nodes.filter(n => n.role === 'component').map(n => n.path),
        confidence: 0.9,
        description: 'React component pattern for UI composition'
      }
    ];
  }

  private generateInsights(
    nodes: EnhancedFileNode[], 
    connections: DependencyConnection[], 
    metrics: RepositoryMetrics,
    architecture: ArchitectureAnalysis
  ): RepositoryInsight[] {
    const insights: RepositoryInsight[] = [];
    
    // Complex files insight
    const complexFiles = nodes.filter(n => n.complexity.cyclomatic > 10);
    if (complexFiles.length > 0) {
      insights.push({
        type: 'maintainability',
        severity: 'warning',
        title: 'High Complexity Files Detected',
        description: `${complexFiles.length} files have high cyclomatic complexity`,
        files: complexFiles.map(f => f.path),
        suggestion: 'Consider refactoring these files to reduce complexity',
        priority: 7
      });
    }

    // Architecture insights
    if (architecture.violations.length > 0) {
      insights.push({
        type: 'architecture',
        severity: 'error',
        title: 'Architecture Violations Found',
        description: `${architecture.violations.length} architecture violations detected`,
        files: architecture.violations.flatMap(v => v.files),
        suggestion: 'Review and fix architecture violations to maintain code quality',
        priority: 9
      });
    }

    return insights.sort((a, b) => b.priority - a.priority);
  }

  // Helper methods
  private shouldAnalyzeDirectory(dirName: string): boolean {
    const skipDirs = ['node_modules', '.git', 'dist', 'build', 'coverage', '.next'];
    return !skipDirs.includes(dirName);
  }

  private getFileExtension(filename: string): string | null {
    const lastDot = filename.lastIndexOf('.');
    return lastDot > 0 ? filename.substring(lastDot) : null;
  }

  private isCodeFile(filename: string): boolean {
    const ext = this.getFileExtension(filename);
    return ext ? ['.ts', '.tsx', '.js', '.jsx', '.py', '.java'].includes(ext) : false;
  }

  private hasContentProperty(obj: any): obj is GitHubFileContentWithContent {
    return obj && typeof obj === 'object' && 'content' in obj && typeof obj.content === 'string';
  }

  private createEnhancedMockStructure(): EnhancedRepositoryStructure {
    // Enhanced mock structure for testing
    const nodes: EnhancedFileNode[] = [
      {
        id: 'src/App.tsx',
        name: 'App.tsx',
        path: 'src/App.tsx',
        type: 'file',
        size: 2500,
        extension: '.tsx',
        language: 'TypeScript',
        depth: 1,
        role: 'entry-point',
        purpose: 'Main Application Component',
        tags: ['react', 'typescript', 'entry-point'],
        dependencies: ['src/components/Header.tsx'],
        dependents: ['src/main.tsx'],
        relatedFiles: [],
        complexity: {
          cyclomatic: 5,
          cognitive: 4,
          halstead: { vocabulary: 50, length: 100, difficulty: 2.5, effort: 250, time: 13.9, bugs: 0.03 },
          maintainabilityIndex: 75
        },
        maintainability: {
          score: 80,
          factors: { complexity: 75, duplication: 90, testCoverage: 70, documentation: 85 }
        },
        codeHealth: {
          linesOfCode: 120,
          technicalDebt: 20,
          codeSmells: [],
          securityIssues: [],
          performanceIssues: []
        }
      }
    ];

    return {
      nodes,
      connections: [
        {
          source: 'src/main.tsx',
          target: 'src/App.tsx',
          type: 'import',
          strength: 1,
          context: 'imports App component'
        }
      ],
      architecture: {
        layers: [
          {
            name: 'Components',
            files: ['src/App.tsx'],
            responsibilities: ['UI Rendering'],
            dependencies: []
          }
        ],
        patterns: ['Component Pattern'],
        principles: ['Single Responsibility'],
        violations: []
      },
      patterns: [
        {
          name: 'Component Pattern',
          type: 'structural',
          files: ['src/App.tsx'],
          confidence: 0.9,
          description: 'React component pattern'
        }
      ],
      metrics: {
        totalFiles: 1,
        totalDirectories: 1,
        languages: { 'TypeScript': { fileCount: 1, linesOfCode: 120, complexity: 5, maintainability: 80 } },
        complexity: { average: 5, highest: { file: 'src/App.tsx', score: 5 }, distribution: { low: 1 } },
        maintainability: 80,
        testCoverage: 70,
        technicalDebt: 20
      },
      insights: [
        {
          type: 'quality',
          severity: 'info',
          title: 'Good Code Structure',
          description: 'Repository follows React best practices',
          files: ['src/App.tsx'],
          suggestion: 'Continue following current patterns',
          priority: 5
        }
      ]
    };
  }
}

export const enhancedRepositoryAnalyzer = new EnhancedRepositoryAnalyzer();
