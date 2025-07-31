import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center space-x-1 text-sm text-gray-600 ${className}`}
    >
      {/* Home icon as first item */}
      <Link 
        href="/" 
        className="flex items-center hover:text-primary transition-colors duration-200"
        aria-label="Home"
      >
        <i className="ri-home-line text-base text-gray-500"></i>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          {/* Separator */}
          <i className="ri-arrow-right-s-line text-sm text-gray-400"></i>
          
          {/* Breadcrumb item */}
          {item.href && !item.isCurrentPage ? (
            <Link 
              href={item.href}
              className="hover:text-primary transition-colors duration-200 truncate max-w-[200px]"
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className={`truncate max-w-[200px] ${
                item.isCurrentPage 
                  ? 'text-primary font-medium' 
                  : 'text-gray-700'
              }`}
              aria-current={item.isCurrentPage ? 'page' : undefined}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Helper function to generate breadcrumb items from pathname
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  paths.forEach((path, index) => {
    const href = '/' + paths.slice(0, index + 1).join('/');
    const isCurrentPage = index === paths.length - 1;
    
    // Convert URL segments to readable labels
    const label = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      label,
      href: isCurrentPage ? undefined : href,
      isCurrentPage
    });
  });

  return breadcrumbs;
}
