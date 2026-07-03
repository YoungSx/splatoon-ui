import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const examplesDir = path.join(root, 'src', 'docs', 'examples')
const outputPath = path.join(root, 'src', 'docs', 'generated', 'example-source.json')
const checkOnly = process.argv.includes('--check')

function normalizeSource(source) {
  return source
    .trim()
    .replace(/from ['"]@\/components\/ui\/([^'"]+)['"]/g, "from 'splatoon-ui/$1'")
    .replace(/\r\n/g, '\n')
}

function extractSource(filePath) {
  const source = fs.readFileSync(filePath, 'utf8')
  const match = source.match(/\/\/ docs-source-start\n(?<body>[\s\S]*?)\n\/\/ docs-source-end/)

  if (!match?.groups?.body) {
    throw new Error(`Missing docs source markers in ${path.relative(root, filePath)}`)
  }

  return normalizeSource(match.groups.body)
}

const entries = Object.fromEntries(
  fs
    .readdirSync(examplesDir)
    .filter((fileName) => fileName.endsWith('.tsx') && fileName !== 'index.tsx')
    .sort((left, right) => left.localeCompare(right))
    .map((fileName) => {
      const id = fileName.replace(/\.tsx$/, '')
      return [id, extractSource(path.join(examplesDir, fileName))]
    })
)

const output = `${JSON.stringify(entries, null, 2)}\n`

if (checkOnly) {
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : ''
  if (current !== output) {
    throw new Error('Generated docs example sources are stale. Run pnpm docs:examples.')
  }

  console.log(`Docs example sources are up to date for ${Object.keys(entries).length} examples.`)
} else {
  fs.writeFileSync(outputPath, output)

  console.log(`Generated docs example sources for ${Object.keys(entries).length} examples.`)
}
