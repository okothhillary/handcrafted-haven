/**
 * MODERN TEMPLATING SYSTEM FOR HANDCRAFTED HAVEN
 * 
 * This module provides modern JavaScript templating utilities inspired by EJS
 * but adapted for React/Next.js architecture.
 * 
 * Created: July 27, 2025
 * Architecture: Next.js 15.4.1 + React 19 + TypeScript
 */

import React from 'react';

// ===== TEMPLATE DATA INTERFACES =====

export interface TemplateContext {
  [key: string]: any;
}

export interface PageTemplateData {
  title: string;
  description?: string;
  keywords?: string[];
  author?: string;
  canonicalUrl?: string;
  ogImage?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
    isCurrentPage?: boolean;
  }>;
  metadata?: Record<string, any>;
}

export interface ProductTemplateData {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  variants?: Array<{
    id: string;
    name: string;
    value: string;
    available: boolean;
  }>;
}

// ===== TEMPLATE UTILITIES =====

/**
 * Modern template string processor with conditional rendering
 * Similar to EJS but for JavaScript template processing
 */
export class TemplateProcessor {
  private context: TemplateContext;

  constructor(context: TemplateContext = {}) {
    this.context = context;
  }

  /**
   * Process template string with context data using handlebars-like syntax
   * Usage: processTemplate('Hello {{name}}, you have {{count}} items', { name: 'John', count: 5 })
   */
  processTemplate(template: string, additionalContext?: TemplateContext): string {
    const fullContext = { ...this.context, ...additionalContext };
    
    return template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
      return this.getValue(expression.trim(), fullContext);
    });
  }

  /**
   * Conditional rendering helper
   */
  if(condition: any, trueContent: string, falseContent: string = ''): string {
    return condition ? trueContent : falseContent;
  }

  /**
   * Loop rendering helper for arrays
   */
  each<T>(array: T[], callback: (item: T, index: number) => string): string {
    if (!Array.isArray(array)) return '';
    return array.map((item, index) => callback(item, index)).join('');
  }

  /**
   * Safe property access with default values
   */
  getValue(path: string, context: TemplateContext = this.context, defaultValue: any = ''): string {
    const value = this.getNestedProperty(context, path);
    
    // Handle special formatting functions
    if (path.includes('|')) {
      const [propertyPath, ...filters] = path.split('|').map(s => s.trim());
      let result = this.getNestedProperty(context, propertyPath) ?? defaultValue;
      
      for (const filter of filters) {
        result = this.applyFilter(result, filter);
      }
      
      return String(result);
    }
    
    return String(value ?? defaultValue);
  }

  /**
   * Format currency values
   */
  currency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Format dates
   */
  formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    switch (format) {
      case 'long':
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'relative':
        return this.getRelativeTime(dateObj);
      default:
        return dateObj.toLocaleDateString();
    }
  }

  private applyFilter(value: any, filter: string): any {
    switch (filter) {
      case 'currency':
        return this.currency(Number(value));
      case 'date':
        return this.formatDate(value);
      case 'uppercase':
        return String(value).toUpperCase();
      case 'lowercase':
        return String(value).toLowerCase();
      case 'capitalize':
        return String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase();
      default:
        return value;
    }
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  }
}

// ===== REACT TEMPLATE COMPONENTS =====

/**
 * Higher-order component for template-driven pages
 * Provides consistent page structure and metadata handling
 */
export function withTemplate<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  templateData: PageTemplateData
) {
  return function TemplatedComponent(props: P) {
    // Set page metadata
    React.useEffect(() => {
      document.title = templateData.title;
      
      // Update meta tags
      const metaTags = [
        { name: 'description', content: templateData.description },
        { name: 'keywords', content: templateData.keywords?.join(', ') },
        { name: 'author', content: templateData.author },
        { property: 'og:title', content: templateData.title },
        { property: 'og:description', content: templateData.description },
        { property: 'og:image', content: templateData.ogImage },
      ];

      metaTags.forEach(tag => {
        if (!tag.content) return;
        
        const selector = tag.name 
          ? `meta[name="${tag.name}"]` 
          : `meta[property="${tag.property}"]`;
        
        let element = document.querySelector(selector) as HTMLMetaElement;
        
        if (!element) {
          element = document.createElement('meta');
          if (tag.name) element.name = tag.name;
          if (tag.property) element.setAttribute('property', tag.property);
          document.head.appendChild(element);
        }
        
        element.content = tag.content;
      });

      // Handle canonical URL
      if (templateData.canonicalUrl) {
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.rel = 'canonical';
          document.head.appendChild(canonical);
        }
        canonical.href = templateData.canonicalUrl;
      }
    }, []);

    return React.createElement(WrappedComponent, props);
  };
}

/**
 * Template-driven content renderer
 * Usage: <TemplateRenderer template="Hello {{name}}" context={{name: 'World'}} />
 */
interface TemplateRendererProps {
  template: string;
  context: TemplateContext;
  className?: string;
}

export function TemplateRenderer({ template, context, className }: TemplateRendererProps) {
  const processor = new TemplateProcessor(context);
  
  const processedContent = React.useMemo(() => {
    try {
      return processor.processTemplate(template);
    } catch (error) {
      console.error('Template processing error:', error);
      return template;
    }
  }, [template, context]);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}

// ===== TEMPLATE HELPERS FOR HANDCRAFTED HAVEN =====

/**
 * Product card template data generator following modern design patterns
 */
export function createProductCardData(product: ProductTemplateData) {
  const processor = new TemplateProcessor(product);
  
  return {
    imageUrl: product.images[0] || '/placeholder-product.jpg',
    name: product.name,
    description: product.description,
    price: processor.currency(product.price),
    originalPrice: product.originalPrice ? processor.currency(product.originalPrice) : null,
    hasDiscount: product.originalPrice && product.originalPrice > product.price,
    inStock: product.inStock,
    rating: product.rating,
    reviewCount: product.reviewCount,
    ratingStars: Array.from({ length: 5 }, (_, i) => ({
      filled: i < product.rating,
      icon: i < product.rating ? 'ri-star-fill' : 'ri-star-line'
    }))
  };
}

/**
 * Generate breadcrumb data following modern navigation patterns
 */
export function createBreadcrumbData(breadcrumbs: PageTemplateData['breadcrumbs'] = []) {
  return {
    items: breadcrumbs,
    hasItems: breadcrumbs && breadcrumbs.length > 0
  };
}

// ===== EXPORT DEFAULT INSTANCE =====

export const templateEngine = new TemplateProcessor();
