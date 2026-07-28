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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', padding: '24px', fontFamily: 'sans-serif' }}>
          <div style={{ width: '100%', maxWidth: '560px', background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '24px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
            <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>Application Error</h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
              Something went wrong loading the application. Check the error details below.
            </p>
            <div style={{ background: '#000', borderRadius: '12px', padding: '16px', marginBottom: '20px', textAlign: 'left', maxHeight: '200px', overflowY: 'auto', border: '1px solid #1e293b' }}>
              <p style={{ color: '#f87171', fontSize: '12px', fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: '8px' }}>{this.state.error?.toString()}</p>
              <pre style={{ color: '#64748b', fontSize: '11px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{this.state.errorInfo?.componentStack}</pre>
            </div>
            <button
              onClick={() => { window.location.reload(); }}
              style={{ width: '100%', padding: '12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '999px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
