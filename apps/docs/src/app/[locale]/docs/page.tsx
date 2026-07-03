import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { DocsIndex, DocsLayout } from '@/docs/components'
import { getDocsDescriptions } from '@/docs/content'
import { docsLocales, isDocsLocale } from '@/docs/manifest'

type DocsIndexPageProps = {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return docsLocales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: DocsIndexPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isDocsLocale(locale)) return {}

  return {
    title: locale === 'en' ? 'Docs' : locale === 'zh' ? '文档' : 'ドキュメント',
    description: 'Splatoon UI component documentation.',
  }
}

export default async function DocsIndexPage({ params }: DocsIndexPageProps) {
  const { locale } = await params
  if (!isDocsLocale(locale)) notFound()

  return (
    <DocsLayout locale={locale}>
      <DocsIndex descriptions={getDocsDescriptions(locale)} locale={locale} />
    </DocsLayout>
  )
}
