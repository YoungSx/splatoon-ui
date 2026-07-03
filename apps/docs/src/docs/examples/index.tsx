'use client'

import generatedExampleSources from '@/docs/generated/example-source.json'
import type { DocsExampleDefinition, DocsExampleDefinitionInput } from '@/docs/types'

import { alertExample } from './alert'
import { badgeExample } from './badge'
import { buttonExample } from './button'
import { cardExample } from './card'
import { checkboxExample } from './checkbox'
import { dialogExample } from './dialog'
import { inputExample } from './input'
import { progressExample } from './progress'
import { switchExample } from './switch'
import { tabsExample } from './tabs'

const exampleSources = generatedExampleSources as Record<string, string>

function withGeneratedSource<TProps extends Record<string, unknown>>(
  example: DocsExampleDefinitionInput<TProps>
): DocsExampleDefinition<TProps> {
  const source = exampleSources[example.id]
  if (!source) {
    throw new Error(`Missing generated docs example source for ${example.id}`)
  }

  return { ...example, source }
}

export const docsExamples = {
  alert: withGeneratedSource(alertExample),
  badge: withGeneratedSource(badgeExample),
  button: withGeneratedSource(buttonExample),
  card: withGeneratedSource(cardExample),
  checkbox: withGeneratedSource(checkboxExample),
  dialog: withGeneratedSource(dialogExample),
  input: withGeneratedSource(inputExample),
  progress: withGeneratedSource(progressExample),
  switch: withGeneratedSource(switchExample),
  tabs: withGeneratedSource(tabsExample),
}

export type DocsExampleId = keyof typeof docsExamples

export function getDocsExample(exampleId: string | undefined) {
  if (!exampleId) return null
  return docsExamples[exampleId as DocsExampleId] ?? null
}
