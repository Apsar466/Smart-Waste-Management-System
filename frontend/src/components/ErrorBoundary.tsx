import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 font-sans">
          <div className="w-full max-w-lg p-8 backdrop-blur-md bg-slate-900/60 border border-red-500/20 rounded-3xl shadow-glow-sm text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5 text-red-500 border border-red-500/20">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-white mb-2">System Interruption</h1>
            <p className="text-sm text-gray-400 mb-6">
              A runtime component exception has occurred. The error details have been logged.
            </p>
            <div className="text-left font-mono text-[11px] bg-black/60 p-4 rounded-2xl max-h-56 overflow-y-auto mb-6 border border-gray-800 text-red-400 leading-relaxed">
              <p className="font-bold mb-2 text-red-500">{this.state.error?.toString()}</p>
              <pre className="whitespace-pre-wrap text-gray-500">{this.state.errorInfo?.componentStack}</pre>
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                window.location.reload();
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-semibold transition-all duration-300 shadow-glow-sm"
            >
              Reinitialize Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
