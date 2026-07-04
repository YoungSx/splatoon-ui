import type { ComponentType, ReactNode } from 'react'

export type DocsLocale = 'en' | 'zh' | 'ja'

export type DocsCategoryId =
  | 'actions'
  | 'assets'
  | 'data-display'
  | 'feedback'
  | 'forms'
  | 'layout'
  | 'media'
  | 'motion'
  | 'navigation'
  | 'typography'

export type LocalizedText = Record<DocsLocale, string>

export type DocsMdxMeta = {
  title: string
  description: string
  category: DocsCategoryId
  example?: string
}

export type DocsMdxModule = {
  default: ComponentType
  metadata: DocsMdxMeta
}

export type DocsApiExport = {
  name: string
  kind: 'function' | 'const' | 'class' | 'interface' | 'type' | 'enum' | 're-export'
  type: string
  description: string
  props: DocsApiProp[]
}

export type DocsApiProp = {
  name: string
  optional: boolean
  type: string
  defaultValue: string
  description: string
}

export type DocsApiEntry = {
  slug: string
  importPath: string
  primaryExport: string
  sourcePath: string
  boundary: 'client' | 'server'
  exports: DocsApiExport[]
}

export type DocsExampleControlValue = string | number | boolean
export type DocsExampleProps = Partial<Record<string, DocsExampleControlValue>>

export type DocsExampleControl =
  | {
      type: 'select'
      prop: string
      label: string
      options: string[]
      defaultValue: string
    }
  | {
      type: 'boolean'
      prop: string
      label: string
      defaultValue: boolean
    }
  | {
      type: 'text'
      prop: string
      label: string
      defaultValue: string
    }
  | {
      type: 'number'
      prop: string
      label: string
      defaultValue: number
      min?: number
      max?: number
      step?: number
    }

export type DocsExampleDefinition<TProps extends DocsExampleProps = DocsExampleProps> = {
  id: string
  title: string
  description: string
  source: string
  controls: DocsExampleControl[]
  initialProps: TProps
  Component: ComponentType<TProps>
}

export type DocsExampleDefinitionInput<TProps extends DocsExampleProps = DocsExampleProps> = Omit<
  DocsExampleDefinition<TProps>,
  'source'
>

export type DocsPlayableExample = Omit<DocsExampleDefinition<DocsExampleProps>, 'Component'> & {
  render: (props: DocsExampleProps) => ReactNode
}
