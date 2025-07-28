'use client';

import React from 'react';
import Button from './Button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback 
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
  title?: string;
  message?: string;
}

export function ErrorFallback({ 
  error, 
  onRetry, 
  title = 'Something went wrong',
  message = 'We apologize for the inconvenience. Please try again.'
}: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="mb-6">
          <i className="ri-error-warning-line text-6xl text-red-500"></i>
        </div>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {title}
        </h2>

        {/* Error Message */}
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {/* Development Error Details */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-x-auto text-red-600">
              {error.stack || error.message}
            </pre>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          {onRetry && (
            <Button onClick={onRetry} variant="primary">
              <i className="ri-refresh-line mr-2"></i>
              Try Again
            </Button>
          )}
          <Button 
            onClick={() => window.location.href = '/'}
            variant="secondary"
          >
            <i className="ri-home-line mr-2"></i>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

interface NotFoundProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}

export function NotFound({ 
  title = 'Page Not Found',
  message = 'The page you are looking for does not exist.',
  showHomeButton = true
}: NotFoundProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* 404 Icon */}
        <div className="mb-6">
          <i className="ri-file-unknow-line text-6xl text-gray-400"></i>
        </div>

        {/* 404 Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>

        {/* 404 Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Action Button */}
        {showHomeButton && (
          <Button 
            onClick={() => window.location.href = '/'}
            variant="primary"
          >
            <i className="ri-home-line mr-2"></i>
            Back to Home
          </Button>
        )}
      </div>
    </div>
  );
}
