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
      dialog.includes('max-w-[calc(100%-3.5rem)]') &&
      dialog.includes('className="max-h-full min-h-0"') &&
      dialog.includes('flex min-h-0 flex-col gap-4 overflow-x-hidden overflow-y-auto overscroll-contain'),
  },
  {
    name: 'Dialog close control stays on the right edge with responsive viewport safe area',
    pass:
      dialog.includes('className="absolute top-[30%] right-0 translate-x-1/2 -translate-y-1/2"') &&
      dialog.includes('style={{ zIndex: DIALOG_Z_INDEX.close }}') &&
      !dialog.includes('absolute -top-1 -right-3 z-50') &&
      !dialog.includes('absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2'),
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
      select.includes('flex w-full max-w-full min-w-0') &&
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
