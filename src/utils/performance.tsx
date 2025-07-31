'use client';

import { Suspense, useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/Loading';

// Performance monitoring utilities
export const PerformanceMonitor = {
  // Measure Core Web Vitals
  measureCLS: () => {
    return new Promise<number>((resolve) => {
      if (typeof window === 'undefined') {
        resolve(0);
        return;
      }
      
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const lastEntry = entries[entries.length - 1] as any;
            resolve(lastEntry.value || 0);
          } else {
            resolve(0);
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch {
        resolve(0);
      }
    });
  },

  measureLCP: () => {
    return new Promise<number>((resolve) => {
      if (typeof window === 'undefined') {
        resolve(0);
        return;
      }
      
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime || 0);
          } else {
            resolve(0);
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      } catch {
        resolve(0);
      }
    });
  },

  measureFID: () => {
    return new Promise<number>((resolve) => {
      if (typeof window === 'undefined') {
        resolve(0);
        return;
      }
      
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.processingStart && entry.startTime) {
              resolve(entry.processingStart - entry.startTime);
            } else {
              resolve(0);
            }
          });
        }).observe({ type: 'first-input', buffered: true });
      } catch {
        resolve(0);
      }
    });
  },

  // Bundle size analyzer
  analyzeBundleSize: () => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
      };
    }
    return null;
  },

  // Report performance metrics
  reportMetrics: async () => {
    try {
      const [cls, lcp, bundleInfo] = await Promise.all([
        PerformanceMonitor.measureCLS(),
        PerformanceMonitor.measureLCP(),
        PerformanceMonitor.analyzeBundleSize()
      ]);

      console.log('📊 Performance Metrics:', {
        CLS: cls,
        LCP: lcp,
        bundleInfo
      });

      return { cls, lcp, bundleInfo };
    } catch (error) {
      console.error('Performance monitoring error:', error);
      return null;
    }
  }
};

// Lazy loading wrapper for components
export function LazyWrapper({ 
  children, 
  fallback = <LoadingSpinner /> 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// Image optimization component
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  ...props
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  [key: string]: any;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...props}
      style={{
        ...props.style,
        aspectRatio: width && height ? `${width}/${height}` : undefined
      }}
    />
  );
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window !== 'undefined') {
    // Preload critical CSS
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'preload';
    criticalCSS.as = 'style';
    criticalCSS.href = '/styles/critical.css';
    document.head.appendChild(criticalCSS);

    // Preload important images
    const heroImage = new Image();
    heroImage.src = '/images/hero-background.jpg';
    
    // Preload key fonts
    const font = document.createElement('link');
    font.rel = 'preload';
    font.as = 'font';
    font.type = 'font/woff2';
    font.href = '/fonts/main-font.woff2';
    font.crossOrigin = 'anonymous';
    document.head.appendChild(font);
  }
}

// Performance optimization hook
export function usePerformanceOptimization() {
  const [metrics, setMetrics] = useState<any>(null);
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    // Preload critical resources
    preloadCriticalResources();

    // Measure performance after component mount
    const timer = setTimeout(async () => {
      const performanceMetrics = await PerformanceMonitor.reportMetrics();
      setMetrics(performanceMetrics);
      setIsOptimized(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return { metrics, isOptimized };
}
