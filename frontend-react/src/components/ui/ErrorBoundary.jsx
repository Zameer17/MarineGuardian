import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4 max-w-lg mx-auto my-12 text-slate-100 shadow-2xl">
          <div className="inline-flex p-3 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Component Load Warning</h2>
          <p className="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800 text-left overflow-auto max-h-32">
            {this.state.error?.toString()}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Reload System Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
