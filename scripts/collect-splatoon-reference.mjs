import fs from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_ORIGIN = 'https://splatoon.nintendo.com'
const DEFAULT_SITEMAP = `${DEFAULT_ORIGIN}/sitemap.xml`
const DEFAULT_OUTPUT_DIR = path.join('scratch', 'splatoon-reference')
const ASSET_EXTENSIONS = new Set([
  '.avif',
  '.css',
  '.gif',
  '.jpg',
  '.jpeg',
  '.js',
  '.json',
  '.mp4',
  '.png',
  '.svg',
  '.webm',
  '.webp',
  '.woff',
  '.woff2',
])

const args = parseArgs(process.argv.slice(2))
const options = {
  sitemap: args.sitemap ?? DEFAULT_SITEMAP,
  outputDir: args.outputDir ?? DEFAULT_OUTPUT_DIR,
  locale: args.locale ?? 'en',
  maxPages: parseMaxPages(args.maxPages ?? 80),
  maxCss: Number(args.maxCss ?? 60),
  maxAssetMb: Number(args.maxAssetMb ?? 20),
  downloadAssets: Boolean(args.downloadAssets),
}

const politeHeaders = {
  'User-Agent': 'Splatoon UI reference collector (+https://github.com/YoungSx/splatoon-ui)',
  Accept: 'text/html,application/xhtml+xml,application/xml,text/css,*/*;q=0.8',
}

const requestDelayMs = 120
const assetMap = new Map()
const cssFiles = []
const crawledPages = []
const failures = []

await main()

async function main() {
  const sitemapUrls = await collectSitemapUrls(options.sitemap)
  const pageUrls = selectPageUrls(sitemapUrls)

  await fs.mkdir(options.outputDir, { recursive: true })

  for (const pageUrl of pageUrls) {
    await delay(requestDelayMs)
    await crawlPage(pageUrl)
  }

  const cssAssets = [...assetMap.values()].filter((asset) => asset.type === 'stylesheet')
  for (const asset of cssAssets.slice(0, options.maxCss)) {
    await delay(requestDelayMs)
    await crawlStylesheet(asset.url, asset.discoveredFrom[0])
  }

  const assets = [...assetMap.values()].sort((a, b) => a.url.localeCompare(b.url))

  if (options.downloadAssets) {
    for (const asset of assets) {
      if (asset.type === 'page') continue
      await delay(requestDelayMs)
      await downloadAsset(asset)
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: {
      origin: DEFAULT_ORIGIN,
      sitemap: options.sitemap,
      locale: options.locale,
      maxPages: Number.isFinite(options.maxPages) ? options.maxPages : 'all',
      totalSitemapPages: sitemapUrls.length,
      selectedPages: pageUrls.length,
      maxCss: options.maxCss,
      downloadAssets: options.downloadAssets,
      outputDir: options.outputDir,
    },
    summary: {
      crawledPages: crawledPages.length,
      discoveredAssets: assets.length,
      stylesheetsScanned: cssFiles.length,
      failures: failures.length,
    },
    pages: crawledPages,
    cssFiles,
    assets,
    failures,
  }

  const manifestPath = path.join(options.outputDir, 'manifest.json')
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  console.log(`Reference crawl complete: ${crawledPages.length} pages, ${assets.length} assets`)
  console.log(`Manifest written to ${manifestPath}`)
  if (failures.length > 0) {
    console.warn(`${failures.length} requests failed. See manifest.failures for details.`)
  }
}

function parseArgs(argv) {
  const parsed = {}
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (!arg.startsWith('--')) continue
    const key = arg.slice(2)
    if (key === 'download-assets') {
      parsed.downloadAssets = true
      continue
    }
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

function parseMaxPages(value) {
  if (value === 'all') return Number.POSITIVE_INFINITY
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid --maxPages value: ${value}`)
  }
  return parsed
}

async function collectSitemapUrls(sitemapUrl, seen = new Set()) {
  if (seen.has(sitemapUrl)) return []
  seen.add(sitemapUrl)

  const xml = await fetchText(sitemapUrl)
  const locs = [...xml.matchAll(/<loc>(?<loc>[^<]+)<\/loc>/g)].map((match) =>
    decodeXml(match.groups.loc)
  )

  if (/<sitemapindex[\s>]/.test(xml)) {
    const nested = []
    for (const loc of locs) {
      nested.push(...(await collectSitemapUrls(loc, seen)))
    }
    return nested
  }

  return locs
}

function selectPageUrls(urls) {
  const selected = []
  const seen = new Set()
  const crawlAllLocales = options.locale === 'all'
  const localePrefix = `/${options.locale}/`

  for (const url of urls) {
    let parsed
    try {
      parsed = new URL(url)
    } catch {
      continue
    }

    if (parsed.origin !== DEFAULT_ORIGIN) continue
    if (!crawlAllLocales && parsed.pathname !== '/' && !parsed.pathname.startsWith(localePrefix))
      continue
    if (seen.has(parsed.href)) continue

    seen.add(parsed.href)
    selected.push(parsed.href)
    if (Number.isFinite(options.maxPages) && selected.length >= options.maxPages) break
  }

  return selected
}

async function crawlPage(pageUrl) {
  try {
    const html = await fetchText(pageUrl)
    const title = extractTitle(html)
    const discoveredAssets = extractAssets(html, pageUrl)

    for (const assetUrl of discoveredAssets) {
      addAsset(assetUrl, pageUrl)
    }

    crawledPages.push({
      url: pageUrl,
      title,
      assetCount: discoveredAssets.size,
    })
  } catch (error) {
    failures.push({ url: pageUrl, reason: error.message })
  }
}

async function crawlStylesheet(cssUrl, discoveredFrom) {
  try {
    const css = await fetchText(cssUrl)
    const cssAssets = extractCssUrls(css, cssUrl)
    for (const assetUrl of cssAssets) {
      addAsset(assetUrl, cssUrl)
    }
    cssFiles.push({
      url: cssUrl,
      discoveredFrom,
      assetCount: cssAssets.size,
    })
  } catch (error) {
    failures.push({ url: cssUrl, reason: error.message })
  }
}

function extractAssets(source, baseUrl) {
  const urls = new Set()

  for (const match of source.matchAll(/\b(?:href|poster|src)=["'](?<value>[^"']+)["']/g)) {
    addResolvedUrl(urls, match.groups.value, baseUrl)
  }

  for (const match of source.matchAll(/\b(?:data-src|data-lazy-src)=["'](?<value>[^"']+)["']/g)) {
    addResolvedUrl(urls, match.groups.value, baseUrl)
  }

  for (const match of source.matchAll(/\b(?:data-srcset|srcset)=["'](?<value>[^"']+)["']/g)) {
    for (const candidate of parseSrcSet(match.groups.value)) {
      addResolvedUrl(urls, candidate, baseUrl)
    }
  }

  for (const match of source.matchAll(/url\((?<value>[^)]+)\)/g)) {
    addResolvedUrl(urls, stripCssUrl(match.groups.value), baseUrl)
  }

  for (const match of source.matchAll(
    /["'](?<value>[^"']+\.(?:avif|css|gif|jpe?g|js|json|mp4|png|svg|webm|webp|woff2?)(?:\?[^"']*)?)["']/gi
  )) {
    addResolvedUrl(urls, match.groups.value, baseUrl)
  }

  return urls
}

function extractCssUrls(css, cssUrl) {
  const urls = new Set()
  for (const match of css.matchAll(/url\((?<value>[^)]+)\)/g)) {
    addResolvedUrl(urls, stripCssUrl(match.groups.value), cssUrl)
  }
  return urls
}

function parseSrcSet(srcset) {
  return srcset
    .split(',')
    .map((entry) => entry.trim().split(/\s+/)[0])
    .filter(Boolean)
}

function addResolvedUrl(urls, rawValue, baseUrl) {
  if (!rawValue) return
  if (rawValue.startsWith('data:') || rawValue.startsWith('blob:') || rawValue.startsWith('#'))
    return

  let resolved
  try {
    resolved = new URL(rawValue, baseUrl)
  } catch {
    return
  }

  if (resolved.origin !== DEFAULT_ORIGIN) return
  if (!isAssetUrl(resolved)) return
  urls.add(resolved.href)
}

function addAsset(assetUrl, discoveredFrom) {
  const parsed = new URL(assetUrl)
  const type = assetType(parsed)
  const existing = assetMap.get(assetUrl)

  if (existing) {
    if (!existing.discoveredFrom.includes(discoveredFrom)) {
      existing.discoveredFrom.push(discoveredFrom)
    }
    return
  }

  assetMap.set(assetUrl, {
    url: assetUrl,
    type,
    extension: path.extname(parsed.pathname).toLowerCase(),
    pathname: parsed.pathname,
    discoveredFrom: [discoveredFrom],
  })
}

function isAssetUrl(url) {
  const extension = path.extname(url.pathname).toLowerCase()
  if (ASSET_EXTENSIONS.has(extension)) return true
  return url.pathname.startsWith('/_next/static/')
}

function assetType(url) {
  const extension = path.extname(url.pathname).toLowerCase()
  if (extension === '.css') return 'stylesheet'
  if (extension === '.js') return 'script'
  if (['.woff', '.woff2'].includes(extension)) return 'font'
  if (['.mp4', '.webm'].includes(extension)) return 'video'
  if (extension === '.json') return 'data'
  if (['.avif', '.gif', '.jpg', '.jpeg', '.png', '.svg', '.webp'].includes(extension))
    return 'image'
  return 'asset'
}

async function downloadAsset(asset) {
  try {
    const response = await fetch(asset.url, { headers: politeHeaders })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const contentLength = Number(response.headers.get('content-length') ?? 0)
    const maxBytes = options.maxAssetMb * 1024 * 1024
    if (contentLength > maxBytes) {
      throw new Error(`Skipped ${contentLength} byte asset over ${options.maxAssetMb}MB limit`)
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    if (buffer.byteLength > maxBytes) {
      throw new Error(`Skipped ${buffer.byteLength} byte asset over ${options.maxAssetMb}MB limit`)
    }

    const localPath = path.join(options.outputDir, 'assets', sanitizeAssetPath(asset.pathname))
    await fs.mkdir(path.dirname(localPath), { recursive: true })
    await fs.writeFile(localPath, buffer)
    asset.localPath = localPath
    asset.bytes = buffer.byteLength
  } catch (error) {
    failures.push({ url: asset.url, reason: error.message })
  }
}

function sanitizeAssetPath(pathname) {
  const normalized = pathname.replace(/^\/+/, '')
  return normalized.replace(/[^a-zA-Z0-9._/-]/g, '_')
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>(?<title>[^<]*)<\/title>/i)
  return match?.groups?.title ? decodeXml(match.groups.title.trim()) : ''
}

async function fetchText(url) {
  const response = await fetch(url, { headers: politeHeaders })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.text()
}

function decodeXml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
}

function stripCssUrl(value) {
  return value.trim().replace(/^['"]|['"]$/g, '')
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
