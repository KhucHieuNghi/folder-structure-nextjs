/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
    dirs: [ 'src' ], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
  reactRemoveProperties: true,
  experimental: {
    emotion: true 
  },
  sassOptions: {
    includePaths: [ path.join(__dirname, 'src/styles') ],
  },
  images: {
    formats: [ 'image/webp' ],
    minimumCacheTTL: 60*60*24*30,
  },

  async headers() {
    return [
      {
        // This works, and returns appropriate Response headers:
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=1296000, s-maxage=1296000, stale-while-revalidate=1800',
          },
        ],
      },
      {
        // This doesn't work for 'Cache-Control' key (works for others though):
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            // Instead of this value:
            value: 'public, max-age=1296000, s-maxage=1296000, stale-while-revalidate=1800',
            // Cache-Control response header is `public, max-age=60` in production
            // and `public, max-age=0, must-revalidate` in development
          },
        ],
      },
    ];
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        '@sentry': {
          test: /[\\/]node_modules[\\/](@sentry)[\\/]/,
          name: '@sentry',
          priority: 10,
          reuseExistingChunk: false,
        },
      };
    }
  
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
// module.exports = withBundleAnalyzer(withSentryConfig(nextConfig, {
//   authToken: process.env.NEXT_PUBLIC_SENTRY_TOKEN
// }));
