import { githubApi, GitHubFileContent, GitHubRepository, GitHubCommit } from './githubApi';

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  extension?: string;
  language?: string;
  imports?: string[];
  exports?: string[];
  complexity?: 'low' | 'medium' | 'high';
  lastModified?: string;
  children?: FileNode[];
  parent?: string;
  depth: number;
}

export interface DependencyConnection {
  source: string;
  target: string;
  type: 'import' | 'export' | 'reference';
  strength: number;
}

export interface RepositoryStructure {
  nodes: FileNode[];
  connections: DependencyConnection[];
  stats: {
    totalFiles: number;
    totalDirectories: number;
    languages: Record<string, number>;
    complexity: Record<string, number>;
  };
}

class RepositoryAnalyzer {
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

  async analyzeRepository(owner: string, repo: string): Promise<RepositoryStructure> {
    console.log(`Starting secure analysis of ${owner}/${repo}`);
    
    try {
      const rootContents = await githubApi.getRepositoryContents(owner, repo);
      const nodes: FileNode[] = [];
      const connections: DependencyConnection[] = [];
      const stats = {
        totalFiles: 0,
        totalDirectories: 0,
        languages: {} as Record<string, number>,
        complexity: { low: 0, medium: 0, high: 0 }
      };

      await this.processDirectory(owner, repo, '', rootContents, nodes, connections, stats, 0);
      
      console.log('Secure analysis complete:', { nodes: nodes.length, connections: connections.length });
      
      return { nodes, connections, stats };
    } catch (error) {
      console.error('Repository analysis failed:', error);
      throw new Error(`Failed to analyze repository: ${error.message}`);
    }
  }

  private async processDirectory(
    owner: string,
    repo: string,
    basePath: string,
    contents: GitHubFileContent[],
    nodes: FileNode[],
    connections: DependencyConnection[],
    stats: any,
    depth: number
  ): Promise<void> {
    for (const item of contents) {
      const fullPath = basePath ? `${basePath}/${item.name}` : item.name;
      const fileExtension = this.getFileExtension(item.name);
      const language = fileExtension ? this.fileExtensionMap[fileExtension] : undefined;
      
      const node: FileNode = {
        id: fullPath,
        name: item.name,
        path: fullPath,
        type: item.type === 'dir' ? 'directory' : 'file',
        size: item.size || 0,
        extension: fileExtension,
        language,
        depth,
        complexity: this.estimateComplexity(item.name, item.size || 0),
        parent: basePath || undefined
      };

      if (item.type === 'file') {
        stats.totalFiles++;
        if (language) {
          stats.languages[language] = (stats.languages[language] || 0) + 1;
        }
        stats.complexity[node.complexity!]++;
        
        // Analyze file for imports/exports if it's a code file
        if (this.isCodeFile(item.name)) {
          try {
            await this.analyzeFileImports(owner, repo, fullPath, node, connections);
          } catch (error) {
            console.warn(`Failed to analyze file ${fullPath}:`, error);
          }
        }
      } else {
        stats.totalDirectories++;
        
        // Recursively process subdirectories (limit depth to prevent infinite recursion)
        if (depth < 4) {
          try {
            const subContents = await githubApi.getRepositoryContents(owner, repo, fullPath);
            if (Array.isArray(subContents)) {
              await this.processDirectory(owner, repo, fullPath, subContents, nodes, connections, stats, depth + 1);
            }
          } catch (error) {
            console.warn(`Failed to process directory ${fullPath}:`, error);
          }
        }
      }

      nodes.push(node);
    }
  }

  private async analyzeFileImports(
    owner: string,
    repo: string,
    filePath: string,
    node: FileNode,
    connections: DependencyConnection[]
  ): Promise<void> {
    try {
      // Use the secure GitHub API to get file contents
      const fileContents = await githubApi.getRepositoryContents(owner, repo, filePath);
      
      if (Array.isArray(fileContents)) return; // Skip if it's a directory
      
      // For single file, we need to decode the content
      if ('content' in fileContents && fileContents.content) {
        const content = atob(fileContents.content);
        const imports = this.extractImports(content);
        const exports = this.extractExports(content);
        
        node.imports = imports;
        node.exports = exports;
        
        // Create connections based on imports
        imports.forEach(importPath => {
          const resolvedPath = this.resolveImportPath(filePath, importPath);
          if (resolvedPath) {
            connections.push({
              source: node.id,
              target: resolvedPath,
              type: 'import',
              strength: 1
            });
          }
        });
      }
    } catch (error) {
      console.warn(`Failed to analyze imports for ${filePath}:`, error);
    }
  }

  private extractImports(content: string): string[] {
    const imports: string[] = [];
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }

  private extractExports(content: string): string[] {
    const exports: string[] = [];
    const exportRegex = /export\s+(?:default\s+)?(?:class|function|const|let|var)\s+(\w+)/g;
    let match;
    
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }
    
    return exports;
  }

  private resolveImportPath(currentFile: string, importPath: string): string | null {
    if (importPath.startsWith('.')) {
      const currentDir = currentFile.split('/').slice(0, -1).join('/');
      const resolvedPath = this.resolvePath(currentDir, importPath);
      return resolvedPath;
    }
    return null; // External imports
  }

  private resolvePath(basePath: string, relativePath: string): string {
    const parts = basePath.split('/').filter(p => p);
    const relParts = relativePath.split('/').filter(p => p);
    
    relParts.forEach(part => {
      if (part === '..') {
        parts.pop();
      } else if (part !== '.') {
        parts.push(part);
      }
    });
    
    return parts.join('/');
  }

  private getFileExtension(filename: string): string | null {
    const lastDot = filename.lastIndexOf('.');
    return lastDot > 0 ? filename.substring(lastDot) : null;
  }

  private isCodeFile(filename: string): boolean {
    const ext = this.getFileExtension(filename);
    return ext ? ['.ts', '.tsx', '.js', '.jsx'].includes(ext) : false;
  }

  private estimateComplexity(filename: string, size: number): 'low' | 'medium' | 'high' {
    if (size > 5000) return 'high';
    if (size > 1000) return 'medium';
    return 'low';
  }
}

export const repositoryAnalyzer = new RepositoryAnalyzer();
