import { defineConfig } from 'tsup'
import { existsSync } from 'node:fs'
import { publicUiEntries } from './scripts/public-ui-entries.mjs'

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

function resolveUiEntry(name: string) {
  const directTsx = `src/components/ui/${name}.tsx`
  if (existsSync(directTsx)) return directTsx

  const directTs = `src/components/ui/${name}.ts`
  if (existsSync(directTs)) return directTs

  const indexTsx = `src/components/ui/${name}/index.tsx`
  if (existsSync(indexTsx)) return indexTsx

  const indexTs = `src/components/ui/${name}/index.ts`
  if (existsSync(indexTs)) return indexTs

  throw new Error(`Missing public UI entry: ${name}`)
}

const componentEntries = Object.fromEntries(
  publicUiEntries.map((name) => [name, resolveUiEntry(name)])
)

export default defineConfig({
  entry: {
    server: 'src/components/ui/server.ts',
    ...componentEntries,
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
