
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="bg-red-900/20 border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span>Something went wrong</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              An error occurred in the Gemini Chat component. Please try refreshing or check the diagnostics.
            </p>
            
            {this.state.error && (
              <div className="bg-slate-800 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-red-400 mb-2">Error Details:</h4>
                <pre className="text-xs text-slate-300 overflow-x-auto">
                  {this.state.error.message}
                </pre>
              </div>
            )}

            {this.state.errorInfo && (
              <div className="bg-slate-800 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-red-400 mb-2">Stack Trace:</h4>
                <pre className="text-xs text-slate-300 overflow-x-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            <Button onClick={this.handleRetry} className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
