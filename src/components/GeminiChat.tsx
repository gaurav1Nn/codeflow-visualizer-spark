
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Bot, User, Send, Sparkles, Code, FileText, Lightbulb, Bug, Settings } from 'lucide-react';
import { gsap } from 'gsap';
import { ErrorBoundary } from './ErrorBoundary';
import { DiagnosticPanel } from './DiagnosticPanel';
import { ChatDebugInfo } from './ChatDebugInfo';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface GeminiChatProps {
  repositoryData?: {
    repository: any;
    commits: any[];
    contributors: any[];
    branches: any[];
  };
}

export const GeminiChat: React.FC<GeminiChatProps> = ({ repositoryData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Enhanced logging function
  const logMessage = (level: 'info' | 'warn' | 'error', message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [GeminiChat] [${level.toUpperCase()}] ${message}`;
    
    console.log(logEntry, data || '');
    
    // You could also send logs to an external service here
    // logToExternalService(level, message, data);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isExpanded && chatRef.current) {
      gsap.fromTo(chatRef.current, 
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [isExpanded]);

  useEffect(() => {
    logMessage('info', 'Repository data updated', {
      hasRepository: !!repositoryData?.repository,
      repositoryName: repositoryData?.repository?.name,
      commitsCount: repositoryData?.commits?.length,
      contributorsCount: repositoryData?.contributors?.length
    });
  }, [repositoryData]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) {
      logMessage('warn', 'Message send blocked', { 
        inputEmpty: !input.trim(), 
        isLoading 
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    logMessage('info', 'Sending message to Gemini', {
      messageLength: userMessage.content.length,
      hasRepositoryData: !!repositoryData,
      chatHistoryLength: messages.length
    });

    try {
      const requestPayload = {
        message: userMessage.content,
        repositoryData,
        chatHistory: messages.slice(-10) // Keep last 10 messages for context
      };

      logMessage('info', 'Calling Supabase function', { 
        payloadSize: JSON.stringify(requestPayload).length 
      });

      const { data, error: functionError } = await supabase.functions.invoke('gemini-code-assistant', {
        body: requestPayload
      });

      if (functionError) {
        logMessage('error', 'Supabase function error', functionError);
        throw new Error(functionError.message);
      }

      if (data?.error) {
        logMessage('error', 'Gemini API error from function', data);
        throw new Error(data.error);
      }

      if (!data?.response) {
        logMessage('error', 'Invalid response from function', data);
        throw new Error('Invalid response from Gemini API');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      logMessage('info', 'Message processed successfully', {
        responseLength: data.response.length,
        usage: data.usage
      });

      // Animate new message
      setTimeout(() => {
        const messageElements = document.querySelectorAll('.message-item:last-child');
        if (messageElements.length > 0) {
          gsap.fromTo(messageElements[messageElements.length - 1],
            { x: 20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
        }
      }, 100);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logMessage('error', 'Chat error', error);
      
      setError(errorMessage);
      
      const errorResponseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again or check the diagnostics panel.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponseMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestionPrompts = [
    "Analyze the overall architecture of this repository",
    "What are the main code patterns used here?",
    "Suggest improvements for code quality",
    "Explain the project structure and organization",
    "What technologies and frameworks are being used?",
    "Review recent commits for potential issues"
  ];

  const renderMessage = (message: ChatMessage) => (
    <div key={message.id} className={`message-item flex gap-3 mb-6 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.role === 'assistant' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-icon-pulse">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
        <div className={`glass-card p-4 rounded-2xl ${
          message.role === 'user' 
            ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-400/30' 
            : 'hover-glow'
        }`}>
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
              {message.content}
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-500 mt-2 px-2">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>

      {message.role === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className="btn-magic w-14 h-14 rounded-full shadow-2xl animate-pulse-glow"
        >
          <Sparkles className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="fixed inset-4 z-50 flex items-center justify-center">
        <div 
          ref={chatRef}
          className="w-full max-w-6xl h-full max-h-[80vh] glass-card-intense rounded-3xl overflow-hidden shadow-2xl flex"
        >
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            <CardHeader className="border-b border-white/10 bg-gradient-to-r from-purple-600/10 to-blue-600/10">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3 text-white">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-gradient-glow">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="gradient-text font-bold">AI Code Assistant</div>
                    <div className="text-sm text-slate-400 font-normal">
                      Powered by Gemini • Ask me about your repository
                    </div>
                  </div>
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  {repositoryData && (
                    <Badge variant="outline" className="border-green-400/50 text-green-300">
                      <Code className="w-3 h-3 mr-1" />
                      {repositoryData.repository.name}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDebug(!showDebug)}
                    className="text-slate-400 hover:text-white"
                    title="Toggle Debug Info"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDiagnostics(true)}
                    className="text-slate-400 hover:text-white"
                    title="Run Diagnostics"
                  >
                    <Bug className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 h-full flex flex-col">
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center max-w-2xl">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 mx-auto mb-6 flex items-center justify-center animate-pulse-glow">
                      <Bot className="w-10 h-10 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Welcome to AI Code Assistant
                    </h3>
                    <p className="text-slate-300 mb-8 leading-relaxed">
                      I can help you understand your repository, analyze code patterns, suggest improvements, 
                      and answer questions about your codebase. What would you like to explore?
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {suggestionPrompts.slice(0, 4).map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => setInput(prompt)}
                          className="feature-card text-left p-4 hover-lift text-sm"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                              {index === 0 && <FileText className="w-4 h-4 text-purple-400" />}
                              {index === 1 && <Code className="w-4 h-4 text-blue-400" />}
                              {index === 2 && <Lightbulb className="w-4 h-4 text-yellow-400" />}
                              {index === 3 && <Bot className="w-4 h-4 text-green-400" />}
                            </div>
                            <span className="text-slate-300">{prompt}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {messages.map(renderMessage)}
                    {isLoading && (
                      <div className="flex gap-3 mb-6">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-icon-pulse">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="glass-card p-4 rounded-2xl">
                          <div className="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              )}

              <div className="border-t border-white/10 p-6 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your repository..."
                      className="min-h-12 max-h-32 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 resize-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className="btn-magic px-6 self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>

          {/* Debug Panel */}
          {showDebug && (
            <div className="w-80 border-l border-white/10 bg-slate-900/50">
              <ChatDebugInfo
                repositoryData={repositoryData}
                messages={messages}
                isLoading={isLoading}
                error={error}
              />
            </div>
          )}
        </div>

        {/* Diagnostic Panel */}
        <DiagnosticPanel
          repositoryData={repositoryData}
          isVisible={showDiagnostics}
          onClose={() => setShowDiagnostics(false)}
        />
      </div>
    </ErrorBoundary>
  );
};
