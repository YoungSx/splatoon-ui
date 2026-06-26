import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const componentPath = path.join(root, 'src', 'components', 'ui', 'in-view.tsx')
const cssPath = path.join(root, 'src', 'components', 'ui', 'in-view.module.css')

const component = fs.readFileSync(componentPath, 'utf8')
const css = fs.readFileSync(cssPath, 'utf8')

const checks = [
  {
    name: 'InView observes and animates the single child element without wrapper DOM',
    pass:
      component.includes('children: InViewElement') &&
      component.includes('React.Children.only(children)') &&
      (component.match(/React\.cloneElement/g)?.length ?? 0) >= 2 &&
      !/return\s*\(\s*<div\s+ref={ref}/s.test(component) &&
      !/className={cn\(styles\.root/s.test(component),
  },
  {
    name: 'InView forwards className and style onto the observed child element',
    pass:
      component.includes('className: cn(child.props.className, className') &&
      component.includes('mergeChildStyle(child.props.style, style)') &&
      component.includes('...(mergedStyle ? { style: mergedStyle } : null)'),
  },
  {
    name: 'InView does not inject an empty style object that can erase component-owned inline styles',
    pass:
      component.includes('if (!childStyle && !ownerStyle) return undefined') &&
      !component.includes('style: { ...child.props.style, ...style }'),
  },
  {
    name: 'InView CSS uses same-element animation selectors like the reference site',
    pass:
      css.includes('.inView.anim') &&
      css.includes('.inView.stagger > *') &&
      !css.includes('.inView .anim') &&
      !css.includes('.inView .stagger > *'),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('InView regression checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('InView regression checks passed.')
