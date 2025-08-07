/**
 * Font loading optimization utilities
 * Handles font loading failures and provides fallback strategies
 */

export const fontLoadingOptimization = {
  /**
   * Preload critical fonts with error handling
   */
  preloadFonts: () => {
    if (typeof window !== 'undefined') {
      // Check if fonts are already loaded
      if (document.fonts && 'load' in document.fonts) {
        // Preload critical fonts with timeout
        const fontPromises = [
          document.fonts.load('400 16px Geist').catch(() => null),
          document.fonts.load('400 16px Pacifico').catch(() => null),
        ];

        Promise.allSettled(fontPromises).then((results) => {
          const failedFonts = results.filter(result => result.status === 'rejected');
          if (failedFonts.length > 0) {
            console.warn('Some fonts failed to load, using fallbacks');
          }
        });
      }
    }
  },

  /**
   * Apply font loading CSS with fallbacks
   */
  applyFontFallbacks: () => {
    if (typeof window !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        /* Font loading fallbacks */
        .font-geist-fallback {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        
        .font-pacifico-fallback {
          font-family: cursive, fantasy !important;
        }
        
        /* Optimize font rendering during load */
        body {
          font-display: swap;
        }
      `;
      document.head.appendChild(style);
    }
  },

  /**
   * Monitor font loading and apply fallbacks if needed
   */
  monitorFontLoading: () => {
    if (typeof window !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        console.log('All fonts loaded successfully');
      }).catch((error) => {
        console.warn('Font loading failed, applying fallbacks:', error);
        // Apply fallback classes to body
        document.body.classList.add('font-loading-failed');
      });
    }
  },
};

/**
 * Initialize font optimization on page load
 */
export const initializeFontOptimization = () => {
  if (typeof window !== 'undefined') {
    // Run immediately
    fontLoadingOptimization.applyFontFallbacks();
    
    // Run after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        fontLoadingOptimization.preloadFonts();
        fontLoadingOptimization.monitorFontLoading();
      });
    } else {
      fontLoadingOptimization.preloadFonts();
      fontLoadingOptimization.monitorFontLoading();
    }
  }
};
