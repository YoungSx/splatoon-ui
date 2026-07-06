'use client'

import generatedExampleSources from '@/docs/generated/example-source.json'
import type {
  DocsExampleDefinitionInput,
  DocsPlayableExample,
  DocsExampleProps,
} from '@/docs/types'

import { alertExample } from './alert'
import { badgeExample } from './badge'
import { buttonExample } from './button'
import { buttonGroupExample } from './button-group'
import { iconButtonExample } from './icon-button'
import { waveButtonExample } from './wave-button'
import { cardExample } from './card'
import { stapleCardExample } from './staple-card'
import { tornCardExample } from './torn-card'
import { ruggedCardExample } from './rugged-card'
import { carouselExample } from './carousel'
import { checkboxExample } from './checkbox'
import { dialogExample } from './dialog'
import { inputExample } from './input'
import { labelExample } from './label'
import { loaderExample } from './loader'
import { radioGroupExample } from './radio-group'
import { progressExample } from './progress'
import { selectExample } from './select'
import { segmentedControlExample } from './segmented-control'
import { popoverExample } from './popover'
import { sheetExample } from './sheet'
import { switchExample } from './switch'
import { tabsExample } from './tabs'
import { listExample } from './list'
import { sectionExample } from './section'
import { bannerDividerExample } from './banner-divider'
import { dottedDividerExample } from './dotted-divider'
import { splatoonTitleExample } from './splatoon-title'
import { headingTapeExample } from './heading-tape'
import { tapeTitleExample } from './tape-title'
import { tapeExample } from './tape'
import { waveCanvasExample } from './wave-canvas'

const exampleSources = generatedExampleSources as Record<string, string>

function withGeneratedSource<TProps extends DocsExampleProps>(
  example: DocsExampleDefinitionInput<TProps>
): DocsPlayableExample {
  const source = exampleSources[example.id]
  if (!source) {
    throw new Error(`Missing generated docs example source for ${example.id}`)
  }

  const { Component, ...definition } = example

  return {
    ...definition,
    source,
    render: (props) => <Component {...(props as TProps)} />,
  }
}

export const docsExamples = {
  alert: withGeneratedSource(alertExample),
  badge: withGeneratedSource(badgeExample),
  button: withGeneratedSource(buttonExample),
  'button-group': withGeneratedSource(buttonGroupExample),
  'icon-button': withGeneratedSource(iconButtonExample),
  'wave-button': withGeneratedSource(waveButtonExample),
  card: withGeneratedSource(cardExample),
  'staple-card': withGeneratedSource(stapleCardExample),
  'torn-card': withGeneratedSource(tornCardExample),
  'rugged-card': withGeneratedSource(ruggedCardExample),
  carousel: withGeneratedSource(carouselExample),
  checkbox: withGeneratedSource(checkboxExample),
  dialog: withGeneratedSource(dialogExample),
  input: withGeneratedSource(inputExample),
  label: withGeneratedSource(labelExample),
  loader: withGeneratedSource(loaderExample),
  'radio-group': withGeneratedSource(radioGroupExample),
  progress: withGeneratedSource(progressExample),
  select: withGeneratedSource(selectExample),
  'segmented-control': withGeneratedSource(segmentedControlExample),
  popover: withGeneratedSource(popoverExample),
  sheet: withGeneratedSource(sheetExample),
  switch: withGeneratedSource(switchExample),
  tabs: withGeneratedSource(tabsExample),
  list: withGeneratedSource(listExample),
  section: withGeneratedSource(sectionExample),
  'banner-divider': withGeneratedSource(bannerDividerExample),
  'dotted-divider': withGeneratedSource(dottedDividerExample),
  'splatoon-title': withGeneratedSource(splatoonTitleExample),
  'heading-tape': withGeneratedSource(headingTapeExample),
  'tape-title': withGeneratedSource(tapeTitleExample),
  tape: withGeneratedSource(tapeExample),
  'wave-canvas': withGeneratedSource(waveCanvasExample),
}

export type DocsExampleId = keyof typeof docsExamples

export function getDocsExample(exampleId: string | undefined) {
  if (!exampleId) return null
  return docsExamples[exampleId as DocsExampleId] ?? null
}
