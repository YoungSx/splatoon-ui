import type { DocsCategoryId, DocsLocale, LocalizedText } from './types'

export const docsLocales = ['en', 'zh', 'ja'] as const satisfies readonly DocsLocale[]
export const defaultDocsLocale = 'en' satisfies DocsLocale

export const docsComponentSlugs = [
  'alert',
  'badge',
  'button',
  'button-group',
  'icon-button',
  'card',
  'staple-card',
  'torn-card',
  'rugged-card',
  'carousel',
  'checkbox',
  'dialog',
  'input',
  'label',
  'loader',
  'radio-group',
  'progress',
  'select',
  'segmented-control',
  'popover',
  'sheet',
  'switch',
  'tabs',
  'list',
  'section',
  'banner-divider',
  'dotted-divider',
  'splatoon-title',
  'heading-tape',
  'tape-title',
  'tape',
  'wave-canvas',
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

const categoryBySlug = {
  alert: 'feedback',
  badge: 'data-display',
  button: 'actions',
  'button-group': 'actions',
  'icon-button': 'actions',
  card: 'data-display',
  'staple-card': 'data-display',
  'torn-card': 'data-display',
  'rugged-card': 'data-display',
  carousel: 'media',
  checkbox: 'forms',
  dialog: 'feedback',
  input: 'forms',
  label: 'forms',
  loader: 'motion',
  'radio-group': 'forms',
  progress: 'feedback',
  select: 'forms',
  'segmented-control': 'forms',
  popover: 'feedback',
  sheet: 'feedback',
  switch: 'forms',
  tabs: 'navigation',
  list: 'data-display',
  section: 'layout',
  'banner-divider': 'layout',
  'dotted-divider': 'layout',
  'splatoon-title': 'typography',
  'heading-tape': 'typography',
  'tape-title': 'typography',
  tape: 'layout',
  'wave-canvas': 'motion',
} satisfies Record<DocsComponentSlug, DocsCategoryId>

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
