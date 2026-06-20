import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const distDir = path.join(root, 'dist')
const globalsPath = path.join(root, 'src', 'app', 'globals.css')
const outputPath = path.join(distDir, 'styles.css')

function readCss(filePath) {
  return fs
    .readFileSync(filePath, 'utf8')
    .replace(/\/\*# sourceMappingURL=.*?\*\//g, '')
    .trim()
}

if (!fs.existsSync(distDir)) {
  throw new Error('dist/ does not exist. Run tsup before building package styles.')
}

const cssOutputs = fs
  .readdirSync(distDir)
  .filter((name) => name.endsWith('.css') && name !== 'styles.css')
  .sort((a, b) => {
    const order = ['server.css', 'client.css']
    const left = order.indexOf(a)
    const right = order.indexOf(b)
    if (left !== -1 || right !== -1) {
      return (left === -1 ? order.length : left) - (right === -1 ? order.length : right)
    }
    return a.localeCompare(b)
  })

const sections = [
  '/* Splatoon UI global styles */',
  readCss(globalsPath),
  ...cssOutputs.flatMap((name) => [
    `/* Splatoon UI component styles: ${name} */`,
    readCss(path.join(distDir, name)),
  ]),
]

fs.writeFileSync(outputPath, `${sections.join('\n\n')}\n`)

console.log(
  `Built ${path.relative(root, outputPath)} from globals.css and ${cssOutputs.length} CSS bundle(s).`
)
