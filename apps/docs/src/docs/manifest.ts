import type { DocsCategoryId, DocsLocale, LocalizedText } from './types'

export const docsLocales = ['en', 'zh', 'ja'] as const satisfies readonly DocsLocale[]
export const defaultDocsLocale = 'en' satisfies DocsLocale

export const docsComponentSlugs = [
  'alert',
  'asset-image',
  'badge',
  'banner-divider',
  'black-tape-container',
  'blob-play-button',
  'button',
  'button-arrow',
  'button-drip',
  'button-group',
  'card',
  'card-image',
  'card-stack-carousel',
  'carousel',
  'character-assets',
  'checkbox',
  'dialog',
  'dotted-divider',
  'event-assets',
  'event-callout',
  'feed-carousel',
  'footer',
  'gallery-controls',
  'heading-tape',
  'icon-button',
  'icon-paginated-carousel',
  'icons',
  'in-view',
  'ink-splash-canvas',
  'ink-trail',
  'input',
  'label',
  'list',
  'loader',
  'marquee',
  'marquee-carousel',
  'media-decoration',
  'nav-chevron',
  'nav-menu-button',
  'navigation',
  'navigation-dialog',
  'navigation-types',
  'news-assets',
  'page-transition',
  'paper-surface',
  'paper-tear-edge',
  'photo-frame',
  'popover',
  'progress',
  'radio-group',
  'rugged-card',
  'section',
  'section-background',
  'section-side-nav',
  'segmented-control',
  'select',
  'sheet',
  'splatoon-title',
  'splats',
  'squid-assets',
  'squid-mask-transition',
  'staple-card',
  'stickers',
  'switch',
  'tabs',
  'tag-hanger',
  'tape',
  'tape-assets',
  'tape-divider',
  'tape-picture',
  'tape-title',
  'torn-card',
  'video-dialog',
  'wave-button',
  'wave-canvas',
  'weapons-assets',
  'weapons-gallery-carousel',
  'wide-torn-paper',
] as const

export type DocsComponentSlug = (typeof docsComponentSlugs)[number]

export type DocsCategory = {
  id: DocsCategoryId
  label: LocalizedText
  description: LocalizedText
}

export const docsCategories: DocsCategory[] = [
  {
    id: 'actions',
    label: { en: 'Actions', zh: '操作组件', ja: 'アクション' },
    description: {
      en: 'Buttons, triggers, and command surfaces.',
      zh: '按钮、触发器和命令入口。',
      ja: 'ボタン、トリガー、コマンド面です。',
    },
  },
  {
    id: 'forms',
    label: { en: 'Forms', zh: '表单控件', ja: 'フォーム' },
    description: {
      en: 'Inputs, switches, selectors, and validation primitives.',
      zh: '输入、开关、选择和校验控件。',
      ja: '入力、スイッチ、選択、検証プリミティブです。',
    },
  },
  {
    id: 'navigation',
    label: { en: 'Navigation', zh: '导航', ja: 'ナビゲーション' },
    description: {
      en: 'Menus, tabs, pagination, and wayfinding.',
      zh: '菜单、标签页、分页和导航定位。',
      ja: 'メニュー、タブ、ページ送り、誘導表示です。',
    },
  },
  {
    id: 'feedback',
    label: { en: 'Feedback', zh: '反馈与弹层', ja: 'フィードバック' },
    description: {
      en: 'Alerts, dialogs, progress, and overlays.',
      zh: '提示、对话框、进度和弹层。',
      ja: 'アラート、ダイアログ、進捗、オーバーレイです。',
    },
  },
  {
    id: 'data-display',
    label: { en: 'Data Display', zh: '内容展示', ja: '表示' },
    description: {
      en: 'Cards, badges, lists, and content blocks.',
      zh: '卡片、徽章、列表和内容块。',
      ja: 'カード、バッジ、リスト、コンテンツブロックです。',
    },
  },
  {
    id: 'layout',
    label: { en: 'Layout', zh: '布局与装饰', ja: 'レイアウト' },
    description: {
      en: 'Sections, paper surfaces, tape, and dividers.',
      zh: '区块、纸张表面、胶带和分割线。',
      ja: 'セクション、紙面、テープ、区切りです。',
    },
  },
  {
    id: 'typography',
    label: { en: 'Typography', zh: '标题与文字', ja: 'タイポグラフィ' },
    description: {
      en: 'Headings, title treatments, and text primitives.',
      zh: '标题、标题装饰和文字基础件。',
      ja: '見出し、タイトル処理、テキスト部品です。',
    },
  },
  {
    id: 'motion',
    label: { en: 'Motion', zh: '动效', ja: 'モーション' },
    description: {
      en: 'Canvas, WebGL, loaders, and transitions.',
      zh: 'Canvas、WebGL、加载器和过渡。',
      ja: 'Canvas、WebGL、ローダー、遷移です。',
    },
  },
  {
    id: 'media',
    label: { en: 'Media', zh: '媒体与轮播', ja: 'メディア' },
    description: {
      en: 'Images, video, galleries, and carousel systems.',
      zh: '图片、视频、画廊和轮播系统。',
      ja: '画像、動画、ギャラリー、カルーセルです。',
    },
  },
  {
    id: 'assets',
    label: { en: 'Assets', zh: '资源入口', ja: 'アセット' },
    description: {
      en: 'Published image manifests, icons, and type entrypoints.',
      zh: '已发布的图片清单、图标和类型入口。',
      ja: '公開画像 manifest、アイコン、型入口です。',
    },
  },
]

const categoryBySlug: Partial<Record<DocsComponentSlug, DocsCategoryId>> = {
  alert: 'feedback',
  badge: 'data-display',
  button: 'actions',
  'button-arrow': 'actions',
  'button-drip': 'actions',
  'button-group': 'actions',
  'icon-button': 'actions',
  checkbox: 'forms',
  dialog: 'feedback',
  input: 'forms',
  label: 'forms',
  popover: 'feedback',
  progress: 'feedback',
  'radio-group': 'forms',
  'segmented-control': 'forms',
  select: 'forms',
  sheet: 'feedback',
  switch: 'forms',
  tabs: 'navigation',
}

const categoryGroups: Array<[DocsCategoryId, DocsComponentSlug[]]> = [
  [
    'navigation',
    [
      'footer',
      'gallery-controls',
      'icon-paginated-carousel',
      'nav-chevron',
      'nav-menu-button',
      'navigation',
      'navigation-dialog',
      'navigation-types',
      'section-side-nav',
    ],
  ],
  [
    'media',
    [
      'asset-image',
      'card-image',
      'card-stack-carousel',
      'carousel',
      'feed-carousel',
      'marquee-carousel',
      'media-decoration',
      'photo-frame',
      'video-dialog',
      'weapons-gallery-carousel',
    ],
  ],
  [
    'motion',
    [
      'blob-play-button',
      'in-view',
      'ink-splash-canvas',
      'ink-trail',
      'loader',
      'page-transition',
      'squid-mask-transition',
      'wave-button',
      'wave-canvas',
    ],
  ],
  [
    'layout',
    [
      'banner-divider',
      'black-tape-container',
      'dotted-divider',
      'marquee',
      'paper-surface',
      'paper-tear-edge',
      'rugged-card',
      'section',
      'section-background',
      'staple-card',
      'tag-hanger',
      'tape',
      'tape-divider',
      'tape-picture',
      'torn-card',
      'wide-torn-paper',
    ],
  ],
  ['typography', ['heading-tape', 'list', 'splatoon-title', 'tape-title']],
  [
    'assets',
    [
      'character-assets',
      'event-assets',
      'icons',
      'news-assets',
      'splats',
      'squid-assets',
      'stickers',
      'tape-assets',
      'weapons-assets',
    ],
  ],
  ['data-display', ['card', 'event-callout']],
]

for (const [category, slugs] of categoryGroups) {
  for (const slug of slugs) {
    categoryBySlug[slug] = category
  }
}

export function isDocsLocale(value: string): value is DocsLocale {
  return docsLocales.includes(value as DocsLocale)
}

export function isDocsSlug(value: string): value is DocsComponentSlug {
  return docsComponentSlugs.includes(value as DocsComponentSlug)
}

export function getDocsCategoryForSlug(slug: DocsComponentSlug): DocsCategoryId {
  return categoryBySlug[slug] ?? 'data-display'
}

export function toComponentTitle(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}
