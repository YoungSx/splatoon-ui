import fs from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_REFERENCE_DIR = path.join('scratch', 'splatoon-reference-all-locales')
const politeHeaders = {
  'User-Agent': 'Splatoon UI reference collector (+https://github.com/YoungSx/splatoon-ui)',
  Accept: 'video/mp4,video/webm,*/*;q=0.8',
}
const args = parseArgs(process.argv.slice(2))
const options = {
  referenceDir: args.referenceDir ?? DEFAULT_REFERENCE_DIR,
  probe: Boolean(args.probe),
  maxLocalVideoMb: Number(args.maxLocalVideoMb ?? 8),
}

const manifestPath = path.join(options.referenceDir, 'manifest.json')
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
const videos = manifest.assets.filter((asset) => asset.type === 'video')
const candidates = await buildVideoCandidates(videos)
const summary = summarize(candidates, videos)
const analysis = {
  generatedAt: new Date().toISOString(),
  sourceManifest: manifestPath,
  policy: {
    publishableAssetDirectory: 'public/_images',
    videoBinaries: 'remote-reference-only',
    reason:
      'Official mp4 assets are tracked for fidelity research and direct <video> integration, but are not copied into public/ by this analysis.',
    maxLocalVideoMb: options.maxLocalVideoMb,
    probedContentLength: options.probe,
  },
  summary,
  candidates,
}

const jsonPath = path.join(options.referenceDir, 'video-media-candidates.json')
const markdownPath = path.join(options.referenceDir, 'video-media-candidates.md')

await fs.writeFile(jsonPath, `${JSON.stringify(analysis, null, 2)}\n`)
await fs.writeFile(markdownPath, renderMarkdown(analysis))

console.log(`Video media analysis complete: ${summary.uniqueVideos} unique videos`)
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

async function buildVideoCandidates(videoAssets) {
  const groups = new Map()

  for (const asset of videoAssets) {
    const basename = decodePathSegment(path.posix.basename(asset.pathname))
    const key = normalizeVideoKey(basename)
    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        title: titleFromBasename(basename),
        fileName: basename,
        extension: path.posix.extname(asset.pathname).toLowerCase(),
        variants: [],
      })
    }

    groups.get(key).variants.push({
      locale: localeFromPathname(asset.pathname),
      pathname: asset.pathname,
      url: asset.url,
      discoveredFrom: asset.discoveredFrom,
    })
  }

  const candidates = []
  for (const candidate of groups.values()) {
    candidate.variants.sort(
      (a, b) => localeRank(a.locale) - localeRank(b.locale) || a.pathname.localeCompare(b.pathname)
    )
    const preferred = candidate.variants[0]
    const probe = options.probe ? await probeVideo(preferred.url) : null

    candidates.push({
      ...candidate,
      preferred,
      locales: [...new Set(candidate.variants.map((variant) => variant.locale))],
      variantCount: candidate.variants.length,
      probe,
      recommendation: recommendationForProbe(probe),
    })
  }

  return candidates.sort((a, b) => a.title.localeCompare(b.title))
}

function normalizeVideoKey(basename) {
  return basename
    .replace(/\.[^.]+$/, '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function titleFromBasename(basename) {
  return basename
    .replace(/\.[^.]+$/, '')
    .replaceAll('_', ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function decodePathSegment(segment) {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

function localeFromPathname(pathname) {
  return pathname.split('/').filter(Boolean)[0] ?? 'root'
}

function localeRank(locale) {
  if (locale === 'en') return 0
  if (locale === 'ca') return 1
  return 2
}

async function probeVideo(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', headers: politeHeaders })
    return {
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type'),
      contentLength: numberOrNull(response.headers.get('content-length')),
      acceptRanges: response.headers.get('accept-ranges'),
    }
  } catch (error) {
    return {
      ok: false,
      status: null,
      error: error.message,
    }
  }
}

function numberOrNull(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function recommendationForProbe(probe) {
  if (!probe) {
    return {
      mode: 'remote-video',
      reason:
        'Use VideoDialogContent mode="video" with the preferred remote URL; size was not probed.',
    }
  }

  const maxBytes = options.maxLocalVideoMb * 1024 * 1024
  if (!probe.ok) {
    return {
      mode: 'remote-video',
      reason: `Keep as remote reference; HEAD probe failed with ${probe.status ?? probe.error}.`,
    }
  }

  if (probe.contentLength !== null && probe.contentLength <= maxBytes) {
    return {
      mode: 'eligible-for-curation',
      reason: `Small enough for manual review under ${options.maxLocalVideoMb}MB, but do not auto-copy video binaries.`,
    }
  }

  return {
    mode: 'remote-video',
    reason: `Keep remote; video exceeds ${options.maxLocalVideoMb}MB or size is unknown.`,
  }
}

function summarize(candidates, videoAssets) {
  const localeCounts = {}
  for (const asset of videoAssets) {
    const locale = localeFromPathname(asset.pathname)
    localeCounts[locale] = (localeCounts[locale] ?? 0) + 1
  }

  return {
    crawledPages: manifest.summary.crawledPages,
    discoveredVideoAssets: videoAssets.length,
    uniqueVideos: candidates.length,
    duplicateLocaleVariants: videoAssets.length - candidates.length,
    localeCounts,
    probed: options.probe,
    remoteOnlyCandidates: candidates.filter(
      (candidate) => candidate.recommendation.mode === 'remote-video'
    ).length,
    curationEligibleCandidates: candidates.filter(
      (candidate) => candidate.recommendation.mode === 'eligible-for-curation'
    ).length,
  }
}

function renderMarkdown({ generatedAt, sourceManifest, policy, summary, candidates }) {
  const lines = [
    '# Splatoon Video Media Candidates',
    '',
    `Generated: ${generatedAt}`,
    `Source manifest: \`${sourceManifest}\``,
    '',
    '## Policy',
    '',
    `- Video binaries: ${policy.videoBinaries}`,
    `- Publishable asset directory: \`${policy.publishableAssetDirectory}\``,
    `- Probe content length: ${policy.probedContentLength ? 'yes' : 'no'}`,
    `- Max local review size: ${policy.maxLocalVideoMb}MB`,
    `- Reason: ${policy.reason}`,
    '',
    '## Summary',
    '',
    `- Crawled pages: ${summary.crawledPages}`,
    `- Discovered video assets: ${summary.discoveredVideoAssets}`,
    `- Unique videos: ${summary.uniqueVideos}`,
    `- Duplicate locale variants: ${summary.duplicateLocaleVariants}`,
    `- Remote-only candidates: ${summary.remoteOnlyCandidates}`,
    `- Manual curation eligible: ${summary.curationEligibleCandidates}`,
    '',
    '## Locale Counts',
    '',
    ...Object.entries(summary.localeCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([locale, count]) => `- ${locale}: ${count}`),
    '',
    '## Candidates',
    '',
  ]

  for (const candidate of candidates) {
    lines.push(`### ${candidate.title}`)
    lines.push('')
    lines.push(`- Preferred locale: ${candidate.preferred.locale}`)
    lines.push(`- Preferred URL: ${candidate.preferred.url}`)
    lines.push(`- Variants: ${candidate.variantCount} (${candidate.locales.join(', ')})`)
    lines.push(`- Recommendation: ${candidate.recommendation.mode}`)
    lines.push(`- Reason: ${candidate.recommendation.reason}`)
    if (candidate.probe?.contentLength) {
      lines.push(`- Content length: ${formatBytes(candidate.probe.contentLength)}`)
    }
    lines.push('')
  }

  return `${lines.join('\n')}\n`
}

function formatBytes(bytes) {
  const mb = bytes / 1024 / 1024
  return `${mb.toFixed(2)}MB`
}
