import { defineConfig } from 'tsup'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { publicUiEntries } from './scripts/public-ui-entries.mjs'
import { readCssModule } from './scripts/css-modules.mjs'

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

const cssModuleClassMaps = {
  name: 'css-module-class-maps',
  setup(build: PublicAssetResolver) {
    build.onResolve({ filter: /\.module\.css$/ }, (args) => ({
      path: `${path.resolve(args.resolveDir, args.path)}.js`,
      namespace: 'splatoon-ui-css-module',
      pluginData: { cssPath: path.resolve(args.resolveDir, args.path) },
    }))

    build.onLoad({ filter: /\.module\.css\.js$/, namespace: 'splatoon-ui-css-module' }, (args) => {
      const resolvedPath =
        typeof args.pluginData?.cssPath === 'string'
          ? args.pluginData.cssPath
          : args.path.replace(/\.js$/, '')
      const { classMap } = readCssModule(resolvedPath)

      return {
        contents: `const styles = ${JSON.stringify(classMap)};\nexport default styles;\n`,
        loader: 'js',
      }
    })
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

const supportEntries = {
  client: 'src/components/ui/client.ts',
  assets: 'src/components/ui/assets.ts',
  tokens: 'src/components/ui/tokens.ts',
  types: 'src/components/ui/types.ts',
}

export default defineConfig({
  entry: {
    server: 'src/components/ui/server.ts',
    ...supportEntries,
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
  esbuildPlugins: [preservePublicAssetUrls, cssModuleClassMaps],
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
  sourcemap: false,
  splitting: true,
  target: 'es2017',
  tsconfig: 'tsconfig.package.json',
})
