import apiData from './generated/api.json'
import type { DocsApiEntry } from './types'

type DocsApiData = {
  generatedAt: string
  entries: DocsApiEntry[]
}

const typedApiData = apiData as DocsApiData

export const docsApiEntries = typedApiData.entries

export function getDocsApiEntry(slug: string) {
  return docsApiEntries.find((entry) => entry.slug === slug) ?? null
}
