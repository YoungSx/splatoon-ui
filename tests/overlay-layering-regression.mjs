import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const componentRoot = path.join(root, 'packages', 'ui', 'src', 'components', 'ui')

const globals = fs.readFileSync(
  path.join(root, 'packages', 'ui', 'src', 'styles', 'globals.css'),
  'utf8'
)
const dialog = fs.readFileSync(path.join(componentRoot, 'dialog.tsx'), 'utf8')
const sheet = fs.readFileSync(path.join(componentRoot, 'sheet.tsx'), 'utf8')
const sheetCss = fs.readFileSync(path.join(componentRoot, 'sheet.module.css'), 'utf8')
const popover = fs.readFileSync(path.join(componentRoot, 'popover.tsx'), 'utf8')
const select = fs.readFileSync(path.join(componentRoot, 'select.tsx'), 'utf8')

function tokenValue(name) {
  const match = globals.match(new RegExp(`${name}:\\s*(\\d+);`))
  return match ? Number(match[1]) : null
}

const zNav = tokenValue('--z-nav')
const zFloating = tokenValue('--z-floating')
const zDialogOverlay = tokenValue('--z-dialog-overlay')
const zDialog = tokenValue('--z-dialog')
const zDialogClose = tokenValue('--z-dialog-close')
const zSheetOverlay = tokenValue('--z-sheet-overlay')
const zSheet = tokenValue('--z-sheet')

const checks = [
  {
    name: 'Global z-index tokens put floating and modal layers above fixed navigation',
    pass:
      zNav !== null &&
      zFloating !== null &&
      zDialogOverlay !== null &&
      zDialog !== null &&
      zDialogClose !== null &&
      zSheetOverlay !== null &&
      zSheet !== null &&
      zFloating > zNav &&
      zDialogOverlay > zNav &&
      zDialog > zDialogOverlay &&
      zDialogClose > zDialog &&
      zSheetOverlay > zNav &&
      zSheet > zSheetOverlay,
  },
  {
    name: 'Dialog overlay, fullscreen splash, backdrop, and popup use modal layer tokens',
    pass:
      dialog.includes('import { uiZIndex }') &&
      dialog.includes('overlay: uiZIndex.dialogOverlay') &&
      dialog.includes('content: uiZIndex.dialog') &&
      dialog.includes('close: uiZIndex.dialogClose') &&
      dialog.includes('style={{ zIndex: DIALOG_Z_INDEX.overlay') &&
      dialog.includes('style={{ zIndex: DIALOG_Z_INDEX.content') &&
      dialog.includes('zIndex: DIALOG_Z_INDEX.close') &&
      !dialog.includes('fixed inset-0 isolate z-50') &&
      !dialog.includes('fixed inset-0 z-50 supports-backdrop-filter') &&
      !dialog.includes('fixed top-1/2 left-1/2 z-50'),
  },
  {
    name: 'Sheet overlay and popup use modal layer tokens instead of hard-coded values',
    pass:
      sheet.includes('import { uiZIndex }') &&
      sheet.includes('overlay: uiZIndex.sheetOverlay') &&
      sheet.includes('content: uiZIndex.sheet') &&
      sheet.includes('style={{ zIndex: SHEET_Z_INDEX.overlay') &&
      sheet.includes('style={{ zIndex: SHEET_Z_INDEX.content') &&
      sheetCss.includes('z-index: var(--z-sheet);') &&
      !sheetCss.includes('z-index: 110;'),
  },
  {
    name: 'Popover and Select portals use the floating layer above fixed navigation',
    pass:
      popover.includes('const POPOVER_Z_INDEX = uiZIndex.floating') &&
      popover.includes('style={{ zIndex: POPOVER_Z_INDEX') &&
      select.includes('z-[var(--z-floating)]') &&
      !popover.includes('isolate z-50') &&
      !select.includes('isolate z-50'),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Overlay layering regression checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Overlay layering regression checks passed.')
