import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getDocsApiEntry } from '@/docs/api'
import {
  DocsArticle,
  DocsLayout,
  FallbackContent,
  PendingExample,
  createFallbackMeta,
} from '@/docs/components'
import { getDocsContent } from '@/docs/content'
import { docsComponentSlugs, docsLocales, isDocsLocale, isDocsSlug } from '@/docs/manifest'
import { DocsPlayground } from '@/docs/playground'

type DocsDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return docsLocales.flatMap((locale) => docsComponentSlugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: DocsDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isDocsLocale(locale) || !isDocsSlug(slug)) return {}

  const content = getDocsContent(locale, slug)
  const meta = content?.metadata ?? createFallbackMeta(slug, locale)

  return {
    title: meta.title,
    description: meta.description,
  }
}

export default async function DocsDetailPage({ params }: DocsDetailPageProps) {
  const { locale, slug } = await params

  if (!isDocsLocale(locale) || !isDocsSlug(slug)) {
    notFound()
  }

  const content = getDocsContent(locale, slug)
  const meta = content?.metadata ?? createFallbackMeta(slug, locale)
  const Content = content?.default
  const apiEntry = getDocsApiEntry(slug)
  const example = meta.example ? (
    <DocsPlayground apiEntry={apiEntry} exampleId={meta.example} />
  ) : (
    <PendingExample locale={locale} />
  )

  return (
    <DocsLayout locale={locale} slug={slug}>
      <DocsArticle apiEntry={apiEntry} example={example} locale={locale} meta={meta} slug={slug}>
        {Content ? <Content /> : <FallbackContent meta={meta} />}
      </DocsArticle>
    </DocsLayout>
  )
}
