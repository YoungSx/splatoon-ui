import AlertEn, { metadata as alertEnMeta } from '../../content/docs/en/alert.mdx'
import BadgeEn, { metadata as badgeEnMeta } from '../../content/docs/en/badge.mdx'
import ButtonEn, { metadata as buttonEnMeta } from '../../content/docs/en/button.mdx'
import CardEn, { metadata as cardEnMeta } from '../../content/docs/en/card.mdx'
import StapleCardEn, { metadata as stapleCardEnMeta } from '../../content/docs/en/staple-card.mdx'
import TornCardEn, { metadata as tornCardEnMeta } from '../../content/docs/en/torn-card.mdx'
import CarouselEn, { metadata as carouselEnMeta } from '../../content/docs/en/carousel.mdx'
import CheckboxEn, { metadata as checkboxEnMeta } from '../../content/docs/en/checkbox.mdx'
import DialogEn, { metadata as dialogEnMeta } from '../../content/docs/en/dialog.mdx'
import InputEn, { metadata as inputEnMeta } from '../../content/docs/en/input.mdx'
import ProgressEn, { metadata as progressEnMeta } from '../../content/docs/en/progress.mdx'
import SwitchEn, { metadata as switchEnMeta } from '../../content/docs/en/switch.mdx'
import TabsEn, { metadata as tabsEnMeta } from '../../content/docs/en/tabs.mdx'
import AlertJa, { metadata as alertJaMeta } from '../../content/docs/ja/alert.mdx'
import BadgeJa, { metadata as badgeJaMeta } from '../../content/docs/ja/badge.mdx'
import ButtonJa, { metadata as buttonJaMeta } from '../../content/docs/ja/button.mdx'
import CardJa, { metadata as cardJaMeta } from '../../content/docs/ja/card.mdx'
import StapleCardJa, { metadata as stapleCardJaMeta } from '../../content/docs/ja/staple-card.mdx'
import TornCardJa, { metadata as tornCardJaMeta } from '../../content/docs/ja/torn-card.mdx'
import CarouselJa, { metadata as carouselJaMeta } from '../../content/docs/ja/carousel.mdx'
import CheckboxJa, { metadata as checkboxJaMeta } from '../../content/docs/ja/checkbox.mdx'
import DialogJa, { metadata as dialogJaMeta } from '../../content/docs/ja/dialog.mdx'
import InputJa, { metadata as inputJaMeta } from '../../content/docs/ja/input.mdx'
import ProgressJa, { metadata as progressJaMeta } from '../../content/docs/ja/progress.mdx'
import SwitchJa, { metadata as switchJaMeta } from '../../content/docs/ja/switch.mdx'
import TabsJa, { metadata as tabsJaMeta } from '../../content/docs/ja/tabs.mdx'
import AlertZh, { metadata as alertZhMeta } from '../../content/docs/zh/alert.mdx'
import BadgeZh, { metadata as badgeZhMeta } from '../../content/docs/zh/badge.mdx'
import ButtonZh, { metadata as buttonZhMeta } from '../../content/docs/zh/button.mdx'
import CardZh, { metadata as cardZhMeta } from '../../content/docs/zh/card.mdx'
import StapleCardZh, { metadata as stapleCardZhMeta } from '../../content/docs/zh/staple-card.mdx'
import TornCardZh, { metadata as tornCardZhMeta } from '../../content/docs/zh/torn-card.mdx'
import CarouselZh, { metadata as carouselZhMeta } from '../../content/docs/zh/carousel.mdx'
import CheckboxZh, { metadata as checkboxZhMeta } from '../../content/docs/zh/checkbox.mdx'
import DialogZh, { metadata as dialogZhMeta } from '../../content/docs/zh/dialog.mdx'
import InputZh, { metadata as inputZhMeta } from '../../content/docs/zh/input.mdx'
import ProgressZh, { metadata as progressZhMeta } from '../../content/docs/zh/progress.mdx'
import SwitchZh, { metadata as switchZhMeta } from '../../content/docs/zh/switch.mdx'
import TabsZh, { metadata as tabsZhMeta } from '../../content/docs/zh/tabs.mdx'

import type { DocsComponentSlug } from './manifest'
import type { DocsLocale, DocsMdxModule } from './types'

const docsContent: Record<DocsLocale, Partial<Record<DocsComponentSlug, DocsMdxModule>>> = {
  en: {
    alert: { default: AlertEn, metadata: alertEnMeta },
    badge: { default: BadgeEn, metadata: badgeEnMeta },
    button: { default: ButtonEn, metadata: buttonEnMeta },
    card: { default: CardEn, metadata: cardEnMeta },
    'staple-card': { default: StapleCardEn, metadata: stapleCardEnMeta },
    'torn-card': { default: TornCardEn, metadata: tornCardEnMeta },
    carousel: { default: CarouselEn, metadata: carouselEnMeta },
    checkbox: { default: CheckboxEn, metadata: checkboxEnMeta },
    dialog: { default: DialogEn, metadata: dialogEnMeta },
    input: { default: InputEn, metadata: inputEnMeta },
    progress: { default: ProgressEn, metadata: progressEnMeta },
    switch: { default: SwitchEn, metadata: switchEnMeta },
    tabs: { default: TabsEn, metadata: tabsEnMeta },
  },
  zh: {
    alert: { default: AlertZh, metadata: alertZhMeta },
    badge: { default: BadgeZh, metadata: badgeZhMeta },
    button: { default: ButtonZh, metadata: buttonZhMeta },
    card: { default: CardZh, metadata: cardZhMeta },
    'staple-card': { default: StapleCardZh, metadata: stapleCardZhMeta },
    'torn-card': { default: TornCardZh, metadata: tornCardZhMeta },
    carousel: { default: CarouselZh, metadata: carouselZhMeta },
    checkbox: { default: CheckboxZh, metadata: checkboxZhMeta },
    dialog: { default: DialogZh, metadata: dialogZhMeta },
    input: { default: InputZh, metadata: inputZhMeta },
    progress: { default: ProgressZh, metadata: progressZhMeta },
    switch: { default: SwitchZh, metadata: switchZhMeta },
    tabs: { default: TabsZh, metadata: tabsZhMeta },
  },
  ja: {
    alert: { default: AlertJa, metadata: alertJaMeta },
    badge: { default: BadgeJa, metadata: badgeJaMeta },
    button: { default: ButtonJa, metadata: buttonJaMeta },
    card: { default: CardJa, metadata: cardJaMeta },
    'staple-card': { default: StapleCardJa, metadata: stapleCardJaMeta },
    'torn-card': { default: TornCardJa, metadata: tornCardJaMeta },
    carousel: { default: CarouselJa, metadata: carouselJaMeta },
    checkbox: { default: CheckboxJa, metadata: checkboxJaMeta },
    dialog: { default: DialogJa, metadata: dialogJaMeta },
    input: { default: InputJa, metadata: inputJaMeta },
    progress: { default: ProgressJa, metadata: progressJaMeta },
    switch: { default: SwitchJa, metadata: switchJaMeta },
    tabs: { default: TabsJa, metadata: tabsJaMeta },
  },
}

export function getDocsContent(locale: DocsLocale, slug: DocsComponentSlug) {
  return docsContent[locale][slug] ?? null
}

export function getDocsDescriptions(locale: DocsLocale) {
  return Object.fromEntries(
    Object.entries(docsContent[locale]).map(([slug, content]) => [
      slug,
      content?.metadata.description ?? '',
    ])
  )
}

export function getDocumentedSlugs(locale: DocsLocale) {
  return Object.keys(docsContent[locale]) as DocsComponentSlug[]
}
