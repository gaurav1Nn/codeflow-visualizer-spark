
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Database, 
  MessageSquare, 
  Clock, 
  User,
  Bot,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatDebugInfoProps {
  repositoryData?: any;
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string | null;
}

export const ChatDebugInfo: React.FC<ChatDebugInfoProps> = ({
  repositoryData,
  messages,
  isLoading,
  error
}) => {
  const getRepositoryStatus = () => {
    if (!repositoryData) return { status: 'none', color: 'bg-gray-500' };
    if (!repositoryData.repository) return { status: 'loading', color: 'bg-yellow-500' };
    return { status: 'ready', color: 'bg-green-500' };
  };

  const repoStatus = getRepositoryStatus();

  return (
    <Card className="bg-slate-800/50 border-slate-600/50">
      <CardHeader>
        <CardTitle className="text-sm text-slate-300 flex items-center space-x-2">
          <Database className="w-4 h-4" />
          <span>Debug Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Repository Status */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Repository Status:</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${repoStatus.color}`} />
            <Badge variant="outline" className="text-xs">
              {repoStatus.status}
            </Badge>
          </div>
        </div>

        {/* Repository Details */}
        {repositoryData?.repository && (
          <div className="bg-slate-700/30 p-3 rounded-lg text-xs">
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div>Name: {repositoryData.repository.name}</div>
              <div>Language: {repositoryData.repository.language}</div>
              <div>Commits: {repositoryData.commits?.length || 0}</div>
              <div>Contributors: {repositoryData.contributors?.length || 0}</div>
            </div>
          </div>
        )}

        {/* Chat Status */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Chat Status:</span>
          <div className="flex items-center space-x-2">
            {isLoading && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
            {error && <AlertCircle className="w-4 h-4 text-red-400" />}
            <Badge variant="outline" className="text-xs">
              {isLoading ? 'processing' : error ? 'error' : 'ready'}
            </Badge>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 p-2 rounded text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Message Count */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Messages:</span>
          <Badge variant="outline" className="text-xs">
            {messages.length}
          </Badge>
        </div>

        {/* Recent Messages */}
        <div className="space-y-2">
          <span className="text-xs text-slate-400">Recent Messages:</span>
          <ScrollArea className="h-20">
            <div className="space-y-1">
              {messages.slice(-3).map((message) => (
                <div key={message.id} className="flex items-center space-x-2 text-xs">
                  {message.role === 'user' ? (
                    <User className="w-3 h-3 text-blue-400" />
                  ) : (
                    <Bot className="w-3 h-3 text-purple-400" />
                  )}
                  <span className="text-slate-300 truncate">
                    {message.content.substring(0, 30)}...
                  </span>
                  <Clock className="w-3 h-3 text-slate-500" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
