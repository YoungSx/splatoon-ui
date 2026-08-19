import { spawnSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { checkTiers, findUnregisteredCheckFiles } from './registry.mjs'

const testsDir = path.dirname(new URL(import.meta.url).pathname)
const requestedTiers = process.argv.slice(2)
const tierNames = requestedTiers.length > 0 ? requestedTiers : ['static']

const unknownTiers = tierNames.filter((tier) => !(tier in checkTiers))
if (unknownTiers.length > 0) {
  console.error(`Unknown check tier(s): ${unknownTiers.join(', ')}`)
  console.error(`Available: ${Object.keys(checkTiers).join(', ')}`)
  process.exit(1)
}

const { unregistered, missing } = findUnregisteredCheckFiles()
if (unregistered.length > 0 || missing.length > 0) {
  console.error('tests/registry.mjs is out of sync with the files on disk:')
  for (const name of unregistered) {
    console.error(`- ${name} exists but is in no tier, so nothing would run it`)
  }
  for (const name of missing) {
    console.error(`- ${name} is registered but no longer exists`)
  }
  process.exit(1)
}

const files = tierNames.flatMap((tier) => checkTiers[tier])
const failures = []

for (const file of files) {
  const result = spawnSync(process.execPath, [path.join(testsDir, file)], {
    cwd: path.resolve(testsDir, '..'),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  if (result.status === 0) {
    console.log(`PASS  ${file}`)
    continue
  }

  failures.push(file)
  console.error(`FAIL  ${file}`)
  process.stderr.write(result.stdout)
  process.stderr.write(result.stderr)
}

console.log(`\n${files.length - failures.length}/${files.length} checks passed.`)

if (failures.length > 0) {
  console.error(`Failed: ${failures.join(', ')}`)
  process.exit(1)
}
