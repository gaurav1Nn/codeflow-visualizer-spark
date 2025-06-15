
import { githubApi, GitHubFileContent, GitHubRepository, GitHubCommit, GitHubFileContentWithContent } from './githubApi';

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

      // Ensure rootContents is an array for directory processing
      if (Array.isArray(rootContents)) {
        await this.processDirectory(owner, repo, '', rootContents, nodes, connections, stats, 0);
      }
      
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
      
      // Type guard to check if fileContents has content property
      if (this.hasContentProperty(fileContents)) {
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

  private hasContentProperty(obj: any): obj is GitHubFileContentWithContent {
    return obj && typeof obj === 'object' && 'content' in obj && typeof obj.content === 'string';
  }

  private extractImports(content: string): string[] {
    const imports: string[] = [];
    
    // Enhanced regex patterns for different import types
    const importPatterns = [
      // ES6 imports: import ... from '...'
      /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
      // Dynamic imports: import('...')
      /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      // Require statements: require('...')
      /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    ];
    
    importPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const importPath = match[1];
        // Filter out external packages (those not starting with . or /)
        if (importPath.startsWith('.') || importPath.startsWith('/')) {
          imports.push(importPath);
        }
      }
    });
    
    return [...new Set(imports)]; // Remove duplicates
  }

  private extractExports(content: string): string[] {
    const exports: string[] = [];
    const exportPatterns = [
      // Named exports: export const/let/var/function/class
      /export\s+(?:const|let|var|function|class)\s+(\w+)/g,
      // Default exports: export default
      /export\s+default\s+(?:class|function)?\s*(\w+)?/g,
      // Export declarations: export { ... }
      /export\s*\{\s*([^}]+)\s*\}/g,
    ];
    
    exportPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1]) {
          // Handle export { a, b, c } syntax
          if (pattern.source.includes('{')) {
            const namedExports = match[1].split(',').map(exp => exp.trim().split(' as ')[0].trim());
            exports.push(...namedExports);
          } else {
            exports.push(match[1]);
          }
        }
      }
    });
    
    return [...new Set(exports.filter(exp => exp && exp !== 'default'))]; // Remove duplicates and empty values
  }

  private resolveImportPath(currentFile: string, importPath: string): string | null {
    if (importPath.startsWith('.')) {
      const currentDir = currentFile.split('/').slice(0, -1).join('/');
      let resolvedPath = this.resolvePath(currentDir, importPath);
      
      // Add common file extensions if not present
      if (!resolvedPath.includes('.')) {
        const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
        for (const ext of extensions) {
          // Try the exact path with extension first
          if (this.pathExists(resolvedPath + ext)) {
            return resolvedPath + ext;
          }
          // Try index file in directory
          if (this.pathExists(resolvedPath + '/index' + ext)) {
            return resolvedPath + '/index' + ext;
          }
        }
      }
      
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

  private pathExists(path: string): boolean {
    // This is a simplified check - in a real implementation,
    // you might want to maintain a cache of all file paths
    return true; // Assume path exists for now
  }

  private getFileExtension(filename: string): string | null {
    const lastDot = filename.lastIndexOf('.');
    return lastDot > 0 ? filename.substring(lastDot) : null;
  }

  private isCodeFile(filename: string): boolean {
    const ext = this.getFileExtension(filename);
    return ext ? ['.ts', '.tsx', '.js', '.jsx', '.py', '.java'].includes(ext) : false;
  }

  private estimateComplexity(filename: string, size: number): 'low' | 'medium' | 'high' {
    if (size > 5000) return 'high';
    if (size > 1000) return 'medium';
    return 'low';
  }
}

export const repositoryAnalyzer = new RepositoryAnalyzer();
