import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import path from 'node:path'

const isStaticExport = process.env.NEXT_OUTPUT_MODE === 'export'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  ...(isStaticExport ? { output: 'export' } : {}),
  transpilePackages: ['splatoon-ui'],
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
    root: path.resolve(process.cwd(), '../..'),
  },
  allowedDevOrigins: ['100.*.*.*', 's8p.io', '*.s8p.io'],
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
})

export default withMDX(nextConfig)
