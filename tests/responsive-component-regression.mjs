import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const componentRoot = path.join(root, 'src', 'components', 'ui')

const navigationDialog = fs.readFileSync(path.join(componentRoot, 'navigation-dialog.tsx'), 'utf8')
const tabs = fs.readFileSync(path.join(componentRoot, 'tabs.tsx'), 'utf8')
const dialog = fs.readFileSync(path.join(componentRoot, 'dialog.tsx'), 'utf8')
const sheet = fs.readFileSync(path.join(componentRoot, 'sheet.tsx'), 'utf8')
const sheetCss = fs.readFileSync(path.join(componentRoot, 'sheet.module.css'), 'utf8')
const select = fs.readFileSync(path.join(componentRoot, 'select.tsx'), 'utf8')

const checks = [
  {
    name: 'NavigationDialog remains scrollable on short desktop viewports',
    pass:
      navigationDialog.includes('overflow-y-auto px-6 pt-[5.625rem] pb-[3.75rem] lg:p-6') &&
      navigationDialog.includes('relative my-auto flex w-full max-w-[44rem]') &&
      !navigationDialog.includes('lg:overflow-hidden') &&
      !navigationDialog.includes('lg:justify-center'),
  },
  {
    name: 'Default Tabs keep horizontal scrolling available for long or numerous labels',
    pass:
      tabs.includes('overflow-x-auto overflow-y-hidden') &&
      tabs.includes('snap-x snap-mandatory') &&
      !tabs.includes('sm:overflow-visible') &&
      !tabs.includes('sm:justify-center'),
  },
  {
    name: 'Dialog content constrains long bodies to the viewport and scrolls inside the surface',
    pass:
      dialog.includes('max-h-[calc(100dvh-2rem)]') &&
      dialog.includes('className="min-h-0 max-h-full"') &&
      dialog.includes('flex min-h-0 flex-col gap-4 overflow-y-auto overscroll-contain'),
  },
  {
    name: 'Sheet popup owns overflow for long drawer content',
    pass:
      sheet.includes('overflow-y-auto overscroll-contain') &&
      sheetCss.includes('max-height: 100dvh;'),
  },
  {
    name: 'Select trigger defaults cannot force parent horizontal overflow',
    pass:
      select.includes('flex min-w-0 flex-1 truncate text-left') &&
      select.includes('w-full min-w-0 max-w-full') &&
      select.includes('*:data-[slot=select-value]:min-w-0') &&
      !select.includes('field-cut flex w-fit'),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Responsive component regression checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Responsive component regression checks passed.')
