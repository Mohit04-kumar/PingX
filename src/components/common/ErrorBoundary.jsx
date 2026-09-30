import React from 'react';
import { AlertTriangle, RotateCcw, Home, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[PingX ErrorBoundary caught fatal error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleClearCacheAndRecover = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        // Clear all cached items that could cause state crashes
        window.localStorage.removeItem('pingx_active_user');
        window.localStorage.removeItem('pingx_token');
        window.localStorage.removeItem('pingx_registered_accounts');
        window.localStorage.removeItem('pingx_chats');
        window.localStorage.removeItem('pingx_user_posts');
        window.localStorage.removeItem('pingx_user_stories');
        window.localStorage.removeItem('pingx_user_cart');
        window.localStorage.removeItem('pingx_watchlist');
      }
    } catch (e) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-[#f8f7ff] to-violet-50 font-sans text-slate-900">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xl space-y-6 text-center animate-fadeIn">
            
            {/* Error Icon */}
            <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            {/* Error Title */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                Something went wrong
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                PingX encountered an unexpected issue while rendering this page. You can reload the page or recover your session below.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#7256c3] hover:bg-[#6348b6] text-white text-xs font-bold transition-all shadow-md shadow-[#7256c3]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="py-3 px-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
            </div>

            {/* Cache Recovery Button */}
            <button
              type="button"
              onClick={this.handleClearCacheAndRecover}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              title="Clears corrupted local cache and restarts safely"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cache & Safe Restart</span>
            </button>

            {/* Technical details toggle */}
            <div className="pt-2 text-left">
              <button
                type="button"
                onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 mx-auto cursor-pointer"
              >
                <span>{this.state.showDetails ? 'Hide' : 'Show'} Technical Details</span>
                {this.state.showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {this.state.showDetails && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-900 text-slate-200 text-[10px] font-mono overflow-x-auto max-h-40 scrollbar-thin">
                  <p className="font-bold text-rose-400">{String(this.state.error?.toString())}</p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="mt-1 text-slate-400 whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
