
import { FileNode, DependencyConnection } from './repositoryAnalyzer';

export interface HierarchicalNode extends Omit<FileNode, 'children'> {
  children?: HierarchicalNode[];
  isExpanded?: boolean;
  level: number;
  parentId?: string;
}

export interface FilteredConnections {
  primary: DependencyConnection[];
  secondary: DependencyConnection[];
  total: number;
}

export class RepositoryHierarchyService {
  buildHierarchy(nodes: FileNode[]): HierarchicalNode[] {
    const nodeMap = new Map<string, HierarchicalNode>();
    const rootNodes: HierarchicalNode[] = [];

    // Convert nodes to hierarchical nodes
    nodes.forEach(node => {
      const hierarchicalNode: HierarchicalNode = {
        ...node,
        children: [],
        isExpanded: node.depth <= 1, // Auto-expand only root level
        level: node.depth,
        parentId: node.parent
      };
      nodeMap.set(node.id, hierarchicalNode);
    });

    // Build the tree structure
    nodeMap.forEach(node => {
      if (node.parentId && nodeMap.has(node.parentId)) {
        const parent = nodeMap.get(node.parentId)!;
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      } else {
        rootNodes.push(node);
      }
    });

    // Sort children within each directory
    const sortChildren = (nodes: HierarchicalNode[]) => {
      nodes.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1; // Directories first
        }
        return a.name.localeCompare(b.name);
      });
      
      nodes.forEach(node => {
        if (node.children) {
          sortChildren(node.children);
        }
      });
    };

    sortChildren(rootNodes);
    return rootNodes;
  }

  getVisibleNodes(hierarchy: HierarchicalNode[]): HierarchicalNode[] {
    const visible: HierarchicalNode[] = [];
    
    const traverse = (nodes: HierarchicalNode[]) => {
      nodes.forEach(node => {
        visible.push(node);
        if (node.isExpanded && node.children) {
          traverse(node.children);
        }
      });
    };

    traverse(hierarchy);
    return visible;
  }

  filterConnections(connections: DependencyConnection[], visibleNodes: HierarchicalNode[]): FilteredConnections {
    const visibleIds = new Set(visibleNodes.map(n => n.id));
    const relevantConnections = connections.filter(conn => 
      visibleIds.has(conn.source) && visibleIds.has(conn.target)
    );

    // Prioritize connections by importance
    const primaryConnections = relevantConnections.filter(conn => {
      // Show only direct parent-child imports and main app connections
      const isMainAppConnection = conn.source.includes('App.tsx') || conn.target.includes('App.tsx') ||
                                  conn.source.includes('main.tsx') || conn.target.includes('main.tsx');
      const isDirectImport = conn.strength >= 0.8;
      
      return isMainAppConnection || isDirectImport;
    }).slice(0, 5); // Limit to 5 most important

    const secondaryConnections = relevantConnections.filter(conn => 
      !primaryConnections.includes(conn)
    ).slice(0, 3); // Limit to 3 additional

    return {
      primary: primaryConnections,
      secondary: secondaryConnections,
      total: relevantConnections.length
    };
  }

  toggleNodeExpansion(hierarchy: HierarchicalNode[], nodeId: string): HierarchicalNode[] {
    const toggle = (nodes: HierarchicalNode[]): HierarchicalNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children) {
          return { ...node, children: toggle(node.children) };
        }
        return node;
      });
    };

    return toggle(hierarchy);
  }

  expandPath(hierarchy: HierarchicalNode[], targetPath: string): HierarchicalNode[] {
    const pathParts = targetPath.split('/');
    
    const expand = (nodes: HierarchicalNode[], currentPath: string[] = []): HierarchicalNode[] => {
      return nodes.map(node => {
        const nodePath = [...currentPath, node.name];
        const shouldExpand = pathParts.slice(0, nodePath.length).join('/') === nodePath.join('/');
        
        if (shouldExpand && node.children) {
          return {
            ...node,
            isExpanded: true,
            children: expand(node.children, nodePath)
          };
        }
        
        return node.children ? { ...node, children: expand(node.children, nodePath) } : node;
      });
    };

    return expand(hierarchy);
  }
}

export const repositoryHierarchy = new RepositoryHierarchyService();
