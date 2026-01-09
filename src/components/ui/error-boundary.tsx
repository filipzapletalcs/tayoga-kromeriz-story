import React, { Component, ReactNode, lazy, Suspense } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// Lazy load the full-page error component to avoid circular dependencies
const ErrorPage = lazy(() => import('@/components/ErrorPage'));

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /**
   * When true, renders a full-page error with branding.
   * When false, renders an inline error alert.
   * Defaults to true for top-level usage.
   */
  fullPage?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component that catches JavaScript errors in child components.
 *
 * Usage:
 * - fullPage={true} (default): Shows branded full-page error - use at app level
 * - fullPage={false}: Shows inline alert - use for component-level errors
 * - fallback={<CustomComponent />}: Use completely custom error UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // TODO: Send to error reporting service (Sentry, etc.)
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback takes precedence
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Full-page error for top-level errors (default)
      if (this.props.fullPage !== false) {
        return (
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                  <div className="animate-pulse text-4xl mb-4">🧘</div>
                  <p className="text-muted-foreground">Načítání...</p>
                </div>
              </div>
            }
          >
            <ErrorPage
              error={this.state.error}
              resetError={this.resetError}
            />
          </Suspense>
        );
      }

      // Inline error for component-level errors
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <Alert className="max-w-md" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Něco se pokazilo</AlertTitle>
            <AlertDescription className="mt-2">
              Omlouváme se, došlo k neočekávané chybě. Zkuste prosím obnovit stránku.
            </AlertDescription>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                this.resetError();
                window.location.reload();
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Obnovit stránku
            </Button>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
