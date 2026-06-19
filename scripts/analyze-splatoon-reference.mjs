import fs from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_REFERENCE_DIR = path.join('scratch', 'splatoon-reference')
const args = parseArgs(process.argv.slice(2))
const options = {
  referenceDir: args.referenceDir ?? DEFAULT_REFERENCE_DIR,
  publicDir: args.publicDir ?? 'public',
}

const manifestPath = path.join(options.referenceDir, 'manifest.json')
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
const localPublicAssets = await collectLocalPublicAssets(options.publicDir)
const componentGroups = buildComponentGroups(manifest.assets, localPublicAssets)
const summary = summarize(componentGroups, manifest)

const analysis = {
  generatedAt: new Date().toISOString(),
  sourceManifest: manifestPath,
  summary,
  componentGroups,
}

const jsonPath = path.join(options.referenceDir, 'component-asset-candidates.json')
const markdownPath = path.join(options.referenceDir, 'component-asset-candidates.md')

await fs.writeFile(jsonPath, `${JSON.stringify(analysis, null, 2)}\n`)
await fs.writeFile(markdownPath, renderMarkdown(analysis))

console.log(`Reference analysis complete: ${summary.componentGroups} component groups`)
console.log(`JSON written to ${jsonPath}`)
console.log(`Markdown written to ${markdownPath}`)

function parseArgs(argv) {
  const parsed = {}
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (!arg.startsWith('--')) continue
    const key = arg.slice(2)
    const next = argv[index + 1]
    if (!next || next.startsWith('--')) {
      parsed[key] = true
      continue
    }
    parsed[key] = next
    index += 1
  }
  return parsed
}

async function collectLocalPublicAssets(publicDir) {
  const assets = new Set()
  await walk(publicDir, async (filePath) => {
    const relativePath = path.relative(publicDir, filePath).split(path.sep).join('/')
    assets.add(`/${relativePath}`)
  })
  return assets
}

async function walk(dir, onFile) {
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await walk(entryPath, onFile)
      continue
    }
    if (entry.isFile()) {
      await onFile(entryPath)
    }
  }
}

function buildComponentGroups(assets, localPublicAssets) {
  const groups = new Map()

  for (const asset of assets) {
    const component = classifyAsset(asset)
    if (!component) continue

    if (!groups.has(component.id)) {
      groups.set(component.id, {
        id: component.id,
        title: component.title,
        reason: component.reason,
        assets: [],
        counts: {},
        localCoverage: {
          available: 0,
          missing: 0,
        },
      })
    }

    const group = groups.get(component.id)
    const localPath = matchingLocalPath(asset.pathname, localPublicAssets)
    const item = {
      url: asset.url,
      pathname: asset.pathname,
      type: asset.type,
      extension: asset.extension,
      localPath,
      isLocal: Boolean(localPath),
      discoveredFrom: asset.discoveredFrom,
    }

    group.assets.push(item)
    group.counts[item.type] = (group.counts[item.type] ?? 0) + 1
    if (item.isLocal) {
      group.localCoverage.available += 1
    } else {
      group.localCoverage.missing += 1
    }
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      assets: group.assets.sort(
        (a, b) => Number(a.isLocal) - Number(b.isLocal) || a.pathname.localeCompare(b.pathname)
      ),
      recommendedNextAssets: group.assets
        .filter((asset) => !asset.isLocal && asset.type === 'image')
        .slice(0, 12)
        .map((asset) => asset.pathname),
    }))
    .sort((a, b) => b.localCoverage.missing - a.localCoverage.missing)
}

function classifyAsset(asset) {
  const pathname = asset.pathname

  if (pathname.includes('/_images/backgrounds/')) {
    return {
      id: 'section-background',
      title: 'SectionBackground patterns',
      reason: 'Pattern and camouflage textures used by section surfaces.',
    }
  }

  if (pathname.includes('/_images/banners/')) {
    return {
      id: 'banner-divider',
      title: 'BannerDivider strips',
      reason: 'Responsive divider strips and color variants.',
    }
  }

  if (
    pathname.includes('/_images/characters/') ||
    /\/(?:ca|en|es|fr|pt)\/gameplay\/characters\//.test(pathname)
  ) {
    return {
      id: 'character-showcase',
      title: 'Character showcase media',
      reason: 'Character artwork used by transition previews and character-driven demos.',
    }
  }

  if (isShowcaseMediaPath(pathname)) {
    return {
      id: 'showcase-media',
      title: 'Demo showcase media',
      reason: 'Curated home and gameplay artwork used by media, dialog, and card demos.',
    }
  }

  if (
    pathname.includes('/_images/weapons/marquee/') ||
    /\/(?:ca|en|es|fr|pt)\/weapons\/weapons\/marquee\//.test(pathname)
  ) {
    return {
      id: 'weapons-gallery-carousel',
      title: 'WeaponsGallery carousel media',
      reason: 'Weapon reference artwork used by gallery and marquee carousel demos.',
    }
  }

  if (
    pathname.includes('/_images/weapons/shops-gallery/') ||
    /\/(?:ca|en|es|fr|pt)\/weapons\/weapons\/shops-gallery\//.test(pathname)
  ) {
    return {
      id: 'shops-gallery-carousel',
      title: 'IconPaginatedCarousel shop media',
      reason: 'Shop artwork and icon thumbnails used by image-paginated carousel demos.',
    }
  }

  if (pathname.includes('/_images/tape-assets/')) {
    return {
      id: 'tape-and-sticker-assets',
      title: 'Tape, sticker, and heading decorations',
      reason:
        'Shared decoration assets for HeadingTape, Tape, TornCard, PhotoFrame, and VideoDialog.',
    }
  }

  if (pathname.includes('/_images/news/') || pathname.includes('/images/news/')) {
    return {
      id: 'staple-card',
      title: 'StapleCard news pins',
      reason: 'Staple and pin art used by card shells.',
    }
  }

  if (pathname.includes('/_images/events/')) {
    return {
      id: 'interactive-event-states',
      title: 'Interactive event states',
      reason: 'Hover/active splats used by event tabs and interactive selectors.',
    }
  }

  if (pathname.includes('/_images/screenshots/') || pathname.includes('/_images/video/')) {
    return {
      id: 'video-dialog',
      title: 'VideoDialog media',
      reason: 'Thumbnail and video assets for the media overlay.',
    }
  }

  if (pathname.includes('/_images/squid/')) {
    return {
      id: 'loader-and-mask-transitions',
      title: 'Loader and mask transitions',
      reason: 'Squid loader and mask assets used by canvas/WebGL transitions.',
    }
  }

  if (pathname.includes('/fonts/') || asset.type === 'font') {
    return {
      id: 'typography',
      title: 'Typography assets',
      reason: 'Self-hosted font assets used by the design system.',
    }
  }

  if (pathname.includes('/_next/static/css/') || asset.type === 'stylesheet') {
    return {
      id: 'style-reference',
      title: 'Style reference CSS',
      reason: 'CSS chunks used for layout, motion, and responsive implementation audits.',
    }
  }

  if (pathname.includes('/_next/static/') || asset.type === 'script' || asset.type === 'data') {
    return {
      id: 'runtime-reference',
      title: 'Runtime reference',
      reason: 'Runtime chunks useful for animation and interaction audits.',
    }
  }

  if (asset.type === 'video') {
    return {
      id: 'video-dialog',
      title: 'VideoDialog media',
      reason: 'Video assets for the media overlay.',
    }
  }

  return null
}

function isShowcaseMediaPath(pathname) {
  return (
    [
      '/_images/home/header-back.jpg',
      '/_images/home/character.png',
      '/_images/home/s3-home-intro-blade.jpg',
      '/_images/gameplay/battle-online/gameplay-battle-online-anarchy-1.jpg',
      '/_images/gameplay/battle-online/gameplay-battle-online-turfwar-left-screen.jpg',
      '/_images/gameplay/battle-online/gameplay-battle-online-turfwar-right-screen.jpg',
      '/_images/gameplay/gameplay-salmonrun.jpg',
      '/_images/gameplay/splatfest/gameplay-splatfest-1.jpg',
      '/_images/gameplay/splatfest/gameplay-splatfest-2.jpg',
    ].includes(pathname) ||
    /\/(?:ca|en|es|fr|pt)\/gameplay\/gameplay\/(?:battle-online\/gameplay-battle-online-(?:anarchy-1|turfwar-left-screen|turfwar-right-screen)\.jpg|gameplay-salmonrun\.jpg|splatfest\/gameplay-splatfest-[12]\.jpg)$/.test(
      pathname
    )
  )
}

function matchingLocalPath(remotePathname, localPublicAssets) {
  const candidates = [
    remotePathname,
    remotePathname.replace(/^\/images\//, '/_images/'),
    remotePathname.replace(/^\/(?:ca|en|es|fr|pt)\/weapons\/weapons\//, '/_images/weapons/'),
    remotePathname.replace(/^\/(?:ca|en|es|fr|pt)\/gameplay\/gameplay\//, '/_images/gameplay/'),
    remotePathname.replace(/^\/(?:ca|en|es|fr|pt)\/gameplay\/characters\//, '/_images/characters/'),
  ]
  return candidates.find((candidate) => localPublicAssets.has(candidate)) ?? null
}

function summarize(componentGroups, manifest) {
  const totalAssets = componentGroups.reduce((sum, group) => sum + group.assets.length, 0)
  const localAssets = componentGroups.reduce((sum, group) => sum + group.localCoverage.available, 0)
  const missingAssets = componentGroups.reduce((sum, group) => sum + group.localCoverage.missing, 0)

  return {
    crawledPages: manifest.summary.crawledPages,
    discoveredAssets: manifest.summary.discoveredAssets,
    componentGroups: componentGroups.length,
    classifiedAssets: totalAssets,
    localAssets,
    missingAssets,
  }
}

function renderMarkdown(analysis) {
  const lines = [
    '# Splatoon Reference Asset Candidates',
    '',
    `Generated: ${analysis.generatedAt}`,
    `Source manifest: \`${analysis.sourceManifest}\``,
    '',
    '## Summary',
    '',
    `- Crawled pages: ${analysis.summary.crawledPages}`,
    `- Discovered assets: ${analysis.summary.discoveredAssets}`,
    `- Classified assets: ${analysis.summary.classifiedAssets}`,
    `- Local assets already available: ${analysis.summary.localAssets}`,
    `- Missing candidate assets: ${analysis.summary.missingAssets}`,
    '',
    '## Component Groups',
    '',
  ]

  for (const group of analysis.componentGroups) {
    lines.push(`### ${group.title}`)
    lines.push('')
    lines.push(group.reason)
    lines.push('')
    lines.push(`- Assets: ${group.assets.length}`)
    lines.push(`- Local: ${group.localCoverage.available}`)
    lines.push(`- Missing: ${group.localCoverage.missing}`)
    lines.push(
      `- Type counts: ${Object.entries(group.counts)
        .map(([type, count]) => `${type} ${count}`)
        .join(', ')}`
    )
    if (group.recommendedNextAssets.length > 0) {
      lines.push('- Recommended next assets:')
      for (const assetPath of group.recommendedNextAssets) {
        lines.push(`  - \`${assetPath}\``)
      }
    }
    lines.push('')
  }

  return `${lines.join('\n')}\n`
}
