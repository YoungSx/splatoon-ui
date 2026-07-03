import Link from 'next/link'
import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import {
  docsCategories,
  docsComponentSlugs,
  getDocsCategoryForSlug,
  toComponentTitle,
} from './manifest'
import type { DocsApiEntry, DocsLocale, DocsMdxMeta } from './types'

const docsCopy = {
  en: {
    home: 'Docs',
    eyebrow: 'Component library',
    intro:
      'MDX guides, typed examples, live controls, and generated API reference for every public entrypoint.',
    components: 'Components',
    api: 'API Reference',
    imports: 'Imports',
    pending: 'Typed example pending',
    pendingBody:
      'This entrypoint has generated API coverage. A curated playground will be added later.',
    visualReady: 'Visual regression ready',
    tableExport: 'Export',
    tableKind: 'Kind',
    tableType: 'Type',
    tableProps: 'Props',
  },
  zh: {
    home: '文档',
    eyebrow: '组件库',
    intro: '每个公开入口都有 MDX 指南、类型化示例、实时控件和自动 API 参考。',
    components: '组件',
    api: 'API 参考',
    imports: '导入',
    pending: '类型化示例待补充',
    pendingBody: '这个入口已经有自动 API 覆盖；精选 playground 会后续补齐。',
    visualReady: '已纳入视觉回归',
    tableExport: '导出',
    tableKind: '类型',
    tableType: '签名',
    tableProps: 'Props',
  },
  ja: {
    home: 'ドキュメント',
    eyebrow: 'コンポーネントライブラリ',
    intro: '公開入口ごとに MDX ガイド、型付き例、ライブ操作、生成 API 参照を提供します。',
    components: 'コンポーネント',
    api: 'API リファレンス',
    imports: 'インポート',
    pending: '型付き例は準備中',
    pendingBody: 'この入口は生成 API の対象です。厳選 playground は後で追加します。',
    visualReady: 'ビジュアル回帰対象',
    tableExport: 'エクスポート',
    tableKind: '種別',
    tableType: '型',
    tableProps: 'Props',
  },
} satisfies Record<DocsLocale, Record<string, string>>

export function DocsLayout({
  children,
  locale,
  slug,
}: {
  children: ReactNode
  locale: DocsLocale
  slug?: string
}) {
  const copy = docsCopy[locale]

  return (
    <div className="text-chaos-black min-h-screen bg-white">
      <header className="pattern-chip-white border-chaos-black border-b-4 px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge color="yellow">{copy.eyebrow}</Badge>
            <h1 className="font-heading mt-3 text-5xl font-black tracking-normal sm:text-6xl">
              Splatoon UI {copy.home}
            </h1>
            <p className="mt-3 max-w-3xl text-base font-medium text-black/70">{copy.intro}</p>
          </div>
          <nav aria-label="Locales" className="flex flex-wrap gap-2">
            {(['en', 'zh', 'ja'] as const).map((targetLocale) => (
              <Link
                key={targetLocale}
                href={slug ? `/${targetLocale}/docs/${slug}` : `/${targetLocale}/docs`}
                className={
                  targetLocale === locale
                    ? 'bg-chaos-black font-alt rounded px-3 py-2 text-lg font-black text-white'
                    : 'border-chaos-black font-alt rounded border-2 px-3 py-2 text-lg font-black'
                }
              >
                {targetLocale.toUpperCase()}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-12">
        <DocsSidebar locale={locale} activeSlug={slug} />
        <div className="min-w-0">{children}</div>
      </main>
    </div>
  )
}

function DocsSidebar({ locale, activeSlug }: { locale: DocsLocale; activeSlug?: string }) {
  const grouped = docsCategories
    .map((category) => ({
      category,
      slugs: docsComponentSlugs.filter((slug) => getDocsCategoryForSlug(slug) === category.id),
    }))
    .filter((group) => group.slugs.length > 0)

  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <nav
        aria-label="Component navigation"
        className="border-chaos-black bg-white p-4 shadow-[4px_4px_0_var(--color-green)]"
      >
        <Link href={`/${locale}/docs`} className="font-alt text-2xl font-black">
          {docsCopy[locale].components}
        </Link>
        <div className="mt-5 grid gap-4">
          {grouped.map((group) => (
            <div key={group.category.id}>
              <p className="font-alt text-sm font-black text-black/55">
                {group.category.label[locale]}
              </p>
              <div className="mt-2 grid gap-1">
                {group.slugs.map((slug) => (
                  <Link
                    key={slug}
                    href={`/${locale}/docs/${slug}`}
                    className={
                      activeSlug === slug
                        ? 'bg-yellow px-2 py-1 font-bold text-black'
                        : 'px-2 py-1 text-sm font-semibold text-black/70 hover:bg-black/5'
                    }
                  >
                    {toComponentTitle(slug)}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  )
}

export function DocsIndex({
  locale,
  descriptions,
}: {
  locale: DocsLocale
  descriptions: Partial<Record<string, string>>
}) {
  return (
    <div className="space-y-8">
      {docsCategories.map((category) => {
        const slugs = docsComponentSlugs.filter(
          (slug) => getDocsCategoryForSlug(slug) === category.id
        )
        if (slugs.length === 0) return null

        return (
          <section key={category.id} className="space-y-4">
            <div>
              <h2 className="font-alt text-3xl font-black">{category.label[locale]}</h2>
              <p className="mt-1 text-sm font-medium text-black/60">
                {category.description[locale]}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {slugs.map((slug) => (
                <Link
                  key={slug}
                  href={`/${locale}/docs/${slug}`}
                  className="border-chaos-black bg-white p-5 shadow-[4px_4px_0_var(--color-yellow)] transition-transform hover:-translate-y-1"
                >
                  <p className="font-alt text-2xl font-black">{toComponentTitle(slug)}</p>
                  <p className="mt-2 line-clamp-3 text-sm font-medium text-black/65">
                    {descriptions[slug] ?? `${toComponentTitle(slug)} API reference.`}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export function DocsArticle({
  apiEntry,
  children,
  example,
  locale,
  meta,
  slug,
}: {
  apiEntry: DocsApiEntry | null
  children: ReactNode
  example: ReactNode
  locale: DocsLocale
  meta: DocsMdxMeta
  slug: string
}) {
  const copy = docsCopy[locale]

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <Badge color="yellow">{copy.visualReady}</Badge>
        <h1 className="font-heading text-5xl font-black tracking-normal">{meta.title}</h1>
        <p className="max-w-3xl text-base font-medium text-black/70">{meta.description}</p>
      </header>

      <section className="prose-splatoon max-w-none">{children}</section>

      <section className="space-y-4">
        <h2 className="font-alt text-3xl font-black">Playground</h2>
        {example}
      </section>

      <section className="space-y-4">
        <h2 className="font-alt text-3xl font-black">{copy.imports}</h2>
        <pre className="border-chaos-black bg-chaos-black overflow-x-auto rounded-lg border-3 p-4 text-sm text-white shadow-[4px_4px_0_var(--color-yellow)]">
          <code>{`import { ${apiEntry?.primaryExport ?? toComponentTitle(slug)} } from 'splatoon-ui/${slug}'`}</code>
        </pre>
      </section>

      <ApiReference apiEntry={apiEntry} locale={locale} />
    </article>
  )
}

export function PendingExample({ locale }: { locale: DocsLocale }) {
  const copy = docsCopy[locale]

  return (
    <div className="pattern-chip-white border-chaos-black grid min-h-52 place-items-center bg-white p-6">
      <div className="max-w-md text-center">
        <p className="font-alt text-3xl font-black">{copy.pending}</p>
        <p className="mt-2 text-sm font-medium text-black/65">{copy.pendingBody}</p>
      </div>
    </div>
  )
}

export function ApiReference({
  apiEntry,
  locale,
}: {
  apiEntry: DocsApiEntry | null
  locale: DocsLocale
}) {
  const copy = docsCopy[locale]

  return (
    <section className="space-y-4">
      <h2 className="font-alt text-3xl font-black">{copy.api}</h2>
      <div className="overflow-x-auto">
        <table className="border-chaos-black w-full min-w-[48rem] border-3 text-left">
          <thead className="bg-chaos-black text-white">
            <tr>
              <th className="px-4 py-3">{copy.tableExport}</th>
              <th className="px-4 py-3">{copy.tableKind}</th>
              <th className="px-4 py-3">{copy.tableType}</th>
              <th className="px-4 py-3">{copy.tableProps}</th>
            </tr>
          </thead>
          <tbody>
            {(apiEntry?.exports ?? []).map((apiExport) => (
              <tr key={apiExport.name} className="border-chaos-black border-t-3 align-top">
                <td className="px-4 py-3 font-mono text-sm font-bold">{apiExport.name}</td>
                <td className="px-4 py-3 text-sm">{apiExport.kind}</td>
                <td className="px-4 py-3 font-mono text-xs">{apiExport.type}</td>
                <td className="px-4 py-3">
                  {apiExport.props.length > 0 ? (
                    <div className="grid gap-2">
                      {apiExport.props.map((prop) => (
                        <div key={prop.name} className="text-xs">
                          <code className="bg-chaos-black rounded px-1.5 py-0.5 text-white">
                            {prop.name}
                            {prop.optional ? '?' : ''}
                          </code>
                          <span className="ml-2 font-mono">{prop.type}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-black/45">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function createFallbackMeta(slug: string, locale: DocsLocale): DocsMdxMeta {
  const title = toComponentTitle(slug)
  const descriptions: Record<DocsLocale, string> = {
    en: `${title} generated API reference and package entrypoint.`,
    zh: `${title} 的自动 API 参考和包入口。`,
    ja: `${title} の生成 API 参照とパッケージ入口です。`,
  }

  return {
    title,
    description: descriptions[locale],
    category: getDocsCategoryForSlug(slug as (typeof docsComponentSlugs)[number]),
  }
}

export function FallbackContent({ meta }: { meta: DocsMdxMeta }) {
  return (
    <>
      <h2>Overview</h2>
      <p>{meta.description}</p>
    </>
  )
}
