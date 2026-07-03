import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const crawlerPath = path.join(root, 'scripts', 'collect-splatoon-reference.mjs')
const analyzerPath = path.join(root, 'scripts', 'analyze-splatoon-reference.mjs')
const packagePath = path.join(root, 'package.json')
const docsPackagePath = path.join(root, 'apps', 'docs', 'package.json')

const crawler = fs.readFileSync(crawlerPath, 'utf8')
const analyzer = fs.readFileSync(analyzerPath, 'utf8')
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
const docsPackageJson = JSON.parse(fs.readFileSync(docsPackagePath, 'utf8'))

const checks = [
  {
    name: 'reference crawl scripts are exposed through package.json',
    pass:
      packageJson.scripts['reference:crawl']?.includes('--filter @splatoon-ui/docs') &&
      packageJson.scripts['reference:analyze']?.includes('--filter @splatoon-ui/docs') &&
      docsPackageJson.scripts['reference:crawl']?.includes('collect-splatoon-reference.mjs') &&
      docsPackageJson.scripts['reference:crawl:download']?.includes('--download-assets') &&
      docsPackageJson.scripts['reference:analyze']?.includes('analyze-splatoon-reference.mjs'),
  },
  {
    name: 'reference crawl output stays in ignored scratch storage by default',
    pass:
      crawler.includes("path.join('scratch', 'splatoon-reference')") &&
      analyzer.includes("path.join('scratch', 'splatoon-reference')") &&
      !/DEFAULT_OUTPUT_DIR\s*=.*public/s.test(crawler),
  },
  {
    name: 'crawler discovers official pages from sitemap indexes instead of hard-coded page lists',
    pass:
      crawler.includes('const DEFAULT_SITEMAP = `${DEFAULT_ORIGIN}/sitemap.xml`') &&
      crawler.includes('collectSitemapUrls') &&
      crawler.includes('<sitemapindex') &&
      crawler.includes('parseMaxPages') &&
      crawler.includes("value === 'all'") &&
      crawler.includes("locale === 'all'") &&
      packageJson.scripts['reference:crawl:all-locales']?.includes('--filter @splatoon-ui/docs') &&
      packageJson.scripts['reference:analyze:all-locales']?.includes(
        '--filter @splatoon-ui/docs'
      ) &&
      docsPackageJson.scripts['reference:crawl:all-locales']?.includes('--locale all') &&
      docsPackageJson.scripts['reference:crawl:all-locales']?.includes(
        'scratch/splatoon-reference-all-locales'
      ) &&
      docsPackageJson.scripts['reference:analyze:all-locales']?.includes(
        'scratch/splatoon-reference-all-locales'
      ) &&
      crawler.includes("maxPages: Number.isFinite(options.maxPages) ? options.maxPages : 'all'"),
  },
  {
    name: 'crawler extracts responsive and CSS-referenced assets',
    pass:
      crawler.includes('parseSrcSet') &&
      crawler.includes('data-srcset') &&
      crawler.includes('url\\(('),
  },
  {
    name: 'asset downloading is opt-in and size-limited',
    pass:
      crawler.includes("'download-assets'") &&
      crawler.includes('maxAssetMb') &&
      crawler.includes('downloadAsset(asset)'),
  },
  {
    name: 'analyzer maps reference assets to component-oriented groups',
    pass:
      analyzer.includes("id: 'section-background'") &&
      analyzer.includes("id: 'banner-divider'") &&
      analyzer.includes("id: 'tape-and-sticker-assets'") &&
      analyzer.includes("id: 'typography'"),
  },
  {
    name: 'analyzer compares official reference paths against local public assets',
    pass:
      analyzer.includes('collectLocalPublicAssets') &&
      analyzer.includes('matchingLocalPath') &&
      analyzer.includes('localCoverage') &&
      analyzer.includes('recommendedNextAssets') &&
      analyzer.includes("remotePathname.replace(/^\\/images\\//, '/_images/')") &&
      !analyzer.includes("remotePathname.replace(/^\\/_images\\//, '/images/')"),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Reference crawl pipeline checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Reference crawl pipeline checks passed.')
