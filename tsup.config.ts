import { defineConfig } from 'tsup'

type PublicAssetResolver = {
  onResolve(
    options: { filter: RegExp },
    callback: (args: { path: string }) => { path: string; external: boolean }
  ): void
}

const preservePublicAssetUrls = {
  name: 'preserve-public-asset-urls',
  setup(build: PublicAssetResolver) {
    build.onResolve({ filter: /^\/(?:_images|fonts|svgs)\// }, (args) => ({
      path: args.path,
      external: true,
    }))
  },
}

export default defineConfig({
  entry: {
    server: 'src/components/ui/server.ts',
    client: 'src/components/ui/client.ts',
  },
  bundle: true,
  clean: true,
  dts: {
    compilerOptions: {
      composite: false,
      declaration: true,
      emitDeclarationOnly: true,
      incremental: false,
      noEmit: false,
    },
  },
  esbuildPlugins: [preservePublicAssetUrls],
  external: [
    '@base-ui/react',
    '@radix-ui/react-progress',
    'class-variance-authority',
    'clsx',
    'framer-motion',
    'lucide-react',
    'react',
    'react-dom',
    'react/jsx-runtime',
    'tailwind-merge',
  ],
  format: ['esm'],
  outDir: 'dist',
  platform: 'browser',
  sourcemap: true,
  splitting: true,
  target: 'es2017',
  tsconfig: 'tsconfig.package.json',
})
