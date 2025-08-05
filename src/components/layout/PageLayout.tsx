import { ErrorBoundary } from '../ui/ErrorBoundary';
import Breadcrumb, { BreadcrumbItem, generateBreadcrumbs } from '../ui/Breadcrumb';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  showBreadcrumbs?: boolean;
}

export default function PageLayout({ 
  children, 
  title,
  breadcrumbs = [],
  className = '',
  showBreadcrumbs = true
}: PageLayoutProps) {
  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        {/* Breadcrumb Navigation */}
        {showBreadcrumbs && breadcrumbs.length > 0 && (
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <Breadcrumb items={breadcrumbs} />
            </div>
          </div>
        )}

        {/* Page Title */}
        {title && (
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  );
}

// Hook for generating breadcrumbs from current path
import { usePathname } from 'next/navigation';

export function useGeneratedBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();
  return generateBreadcrumbs(pathname || '/');
}
