import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const scriptPath = path.join(root, 'scripts', 'analyze-splatoon-videos.mjs')
const packagePath = path.join(root, 'package.json')

const script = fs.readFileSync(scriptPath, 'utf8')
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

const checks = [
  {
    name: 'video analyzer is exposed through package scripts',
    pass:
      packageJson.scripts['reference:analyze:videos']?.includes('analyze-splatoon-videos.mjs') &&
      packageJson.scripts['reference:analyze:videos:probe']?.includes('--probe'),
  },
  {
    name: 'video analyzer defaults to all-locale reference data and scratch output',
    pass:
      script.includes("path.join('scratch', 'splatoon-reference-all-locales')") &&
      script.includes('video-media-candidates.json') &&
      script.includes('video-media-candidates.md'),
  },
  {
    name: 'video analyzer deduplicates locale variants and prefers English sources',
    pass:
      script.includes('normalizeVideoKey') &&
      script.includes('localeRank') &&
      script.includes("if (locale === 'en') return 0"),
  },
  {
    name: 'video analyzer keeps official mp4 files as remote references instead of publishable assets',
    pass:
      script.includes("videoBinaries: 'remote-reference-only'") &&
      script.includes('do not auto-copy video binaries') &&
      script.includes('politeHeaders') &&
      !script.includes("path.join('public'"),
  },
  {
    name: 'video analyzer can optionally probe content length without requiring downloads',
    pass:
      script.includes("method: 'HEAD'") &&
      script.includes('content-length') &&
      script.includes('maxLocalVideoMb'),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Video reference analysis checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Video reference analysis checks passed.')
