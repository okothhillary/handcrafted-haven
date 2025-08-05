import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // External packages for server components
  serverExternalPackages: ['@prisma/client'],

  // Turbopack configuration (stable in Next.js 15+)
  turbopack: {
    rules: {
      // Handle SVG files
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components', '@/utils'],
  },

  eslint: {
    // Only ignore during builds for now - should be fixed for production
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Only ignore during builds for now - should be fixed for production  
    ignoreBuildErrors: true,
  },

  // Webpack configuration to optimize bundle size
  webpack: (config, { isServer }) => {
    // Optimize SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Optimize large icon font files like Remixicon
    config.module.rules.push({
      test: /remixicon\.svg$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 8192, // Convert small files to base64
          fallback: 'file-loader',
          publicPath: '/_next/static/icons/',
          outputPath: 'static/icons/',
        },
      },
    });

    // Reduce bundle size for large icon fonts
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
      
      // Optimize bundle splitting for icons
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            icons: {
              test: /[\\/]node_modules[\\/](remixicon)[\\/]/,
              name: 'icons',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
