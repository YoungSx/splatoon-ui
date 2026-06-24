import type { NextConfig } from 'next'

const isStaticExport = process.env.NEXT_OUTPUT_MODE === 'export'

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: 'export' } : {}),
  ...(!isStaticExport
    ? {
        async headers() {
          return [
            {
              source: '/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
                },
                { key: 'Pragma', value: 'no-cache' },
                { key: 'Expires', value: '0' },
                { key: 'Surrogate-Control', value: 'no-store' },
              ],
            },
          ]
        },
      }
    : {}),
  turbopack: {
    root: process.cwd(),
  },
  allowedDevOrigins: ['100.*.*.*', 's8p.io', '*.s8p.io'],
}

export default nextConfig
