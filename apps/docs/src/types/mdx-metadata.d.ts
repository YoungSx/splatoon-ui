declare module '*.mdx' {
  import type { DocsMdxMeta } from '@/docs/types'

  export const metadata: DocsMdxMeta
}
