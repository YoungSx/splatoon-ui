import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const ruleContainerAtRules = new Set(['container', 'layer', 'media', 'scope', 'supports'])

function isIdentifierStart(char) {
  return /[A-Za-z_-]/.test(char)
}

function isIdentifierPart(char) {
  return /[\w-]/.test(char)
}

function consumeComment(source, index) {
  const end = source.indexOf('*/', index + 2)
  return end === -1 ? source.length : end + 2
}

function consumeString(source, index) {
  const quote = source[index]
  let cursor = index + 1

  while (cursor < source.length) {
    if (source[cursor] === '\\') {
      cursor += 2
      continue
    }
    if (source[cursor] === quote) {
      return cursor + 1
    }
    cursor += 1
  }

  return source.length
}

function consumeAttributeSelector(source, index) {
  let cursor = index + 1

  while (cursor < source.length) {
    if (source.startsWith('/*', cursor)) {
      cursor = consumeComment(source, cursor)
      continue
    }
    if (source[cursor] === '"' || source[cursor] === "'") {
      cursor = consumeString(source, cursor)
      continue
    }
    if (source[cursor] === ']') {
      return cursor + 1
    }
    cursor += 1
  }

  return source.length
}

function findMatchingToken(source, openIndex, openToken, closeToken, limit = source.length) {
  let depth = 0
  let cursor = openIndex

  while (cursor < limit) {
    if (source.startsWith('/*', cursor)) {
      cursor = consumeComment(source, cursor)
      continue
    }
    if (source[cursor] === '"' || source[cursor] === "'") {
      cursor = consumeString(source, cursor)
      continue
    }
    if (source[cursor] === openToken) {
      depth += 1
    } else if (source[cursor] === closeToken) {
      depth -= 1
      if (depth === 0) return cursor
    }
    cursor += 1
  }

  return limit
}

function trimLeadingWhitespaceAndComments(source) {
  let cursor = 0

  while (cursor < source.length) {
    if (/\s/.test(source[cursor])) {
      cursor += 1
      continue
    }
    if (source.startsWith('/*', cursor)) {
      cursor = consumeComment(source, cursor)
      continue
    }
    break
  }

  return source.slice(cursor)
}

function scopeSelector(selector, scope, classNames) {
  let output = ''
  let cursor = 0

  while (cursor < selector.length) {
    if (selector.startsWith('/*', cursor)) {
      const end = consumeComment(selector, cursor)
      output += selector.slice(cursor, end)
      cursor = end
      continue
    }

    if (selector[cursor] === '"' || selector[cursor] === "'") {
      const end = consumeString(selector, cursor)
      output += selector.slice(cursor, end)
      cursor = end
      continue
    }

    if (selector[cursor] === '[') {
      const end = consumeAttributeSelector(selector, cursor)
      output += selector.slice(cursor, end)
      cursor = end
      continue
    }

    if (selector.startsWith(':global(', cursor)) {
      const open = cursor + ':global'.length
      const close = findMatchingToken(selector, open, '(', ')')
      output += selector.slice(open + 1, close)
      cursor = close < selector.length ? close + 1 : close
      continue
    }

    if (
      selector[cursor] === '.' &&
      selector[cursor - 1] !== '\\' &&
      isIdentifierStart(selector[cursor + 1] ?? '')
    ) {
      let end = cursor + 2
      while (end < selector.length && isIdentifierPart(selector[end])) {
        end += 1
      }

      const className = selector.slice(cursor + 1, end)
      classNames.add(className)
      output += `.${scope}_${className}`
      cursor = end
      continue
    }

    output += selector[cursor]
    cursor += 1
  }

  return output
}

function blockModeForPrelude(prelude) {
  const trimmed = trimLeadingWhitespaceAndComments(prelude)
  if (!trimmed.startsWith('@')) return 'raw'

  const atRule = trimmed.match(/^@(-?[\w-]+)/)?.[1]?.toLowerCase()
  if (!atRule) return 'raw'
  if (ruleContainerAtRules.has(atRule)) return 'rules'

  return 'raw'
}

/** `@keyframes`, plus any vendor-prefixed spelling of it. */
const keyframesAtRulePattern = String.raw`@-(?:webkit|moz|o|ms)-keyframes|@keyframes`
const keyframesDefinitionPattern = new RegExp(
  String.raw`^(\s*(?:${keyframesAtRulePattern})\s+)([A-Za-z_][\w-]*)`,
  'i'
)
const keyframesBlockPattern = new RegExp(String.raw`^(?:${keyframesAtRulePattern})\b`, 'i')

/**
 * An `animation` or `animation-name` declaration, split into the property part
 * and its value. The leading `^|;|{|\n` anchors the property to the start of a
 * declaration so `animation` inside another value is not mistaken for one.
 */
const animationDeclarationPattern = /((?:^|;|{|\n)\s*animation(?:-name)?\s*:)([^;{}]+)/gi

/**
 * Collects every `@keyframes` name in the file up front, so a reference that
 * appears before its definition (`animation: fade` in a `@media` block above
 * `@keyframes fade`) still gets rewritten.
 */
function collectKeyframeNames(source, keyframeNames) {
  let cursor = 0

  while (cursor < source.length) {
    if (source.startsWith('/*', cursor)) {
      cursor = consumeComment(source, cursor)
      continue
    }

    if (source[cursor] === '"' || source[cursor] === "'") {
      cursor = consumeString(source, cursor)
      continue
    }

    if (source[cursor] === '@') {
      const name = source.slice(cursor).match(keyframesDefinitionPattern)?.[2]
      if (name) keyframeNames.add(name)
    }

    cursor += 1
  }
}

/**
 * Renames the animation in an `@keyframes NAME` prelude to a module-local name.
 * The prelude still carries whatever whitespace and comments preceded the
 * at-rule, so the rename is applied to the trimmed part and the trivia is
 * put back untouched.
 */
function scopeKeyframesPrelude(prelude, trimmedPrelude, scope) {
  const leadingTrivia = prelude.slice(0, prelude.length - trimmedPrelude.length)
  const scopedAtRule = trimmedPrelude.replace(
    keyframesDefinitionPattern,
    (match, prefix, name) => `${prefix}${scope}_${name}`
  )

  return `${leadingTrivia}${scopedAtRule}`
}

/** Rewrites keyframe names referenced from an `animation`/`animation-name` value. */
function scopeKeyframeReferences(value, scope, keyframeNames) {
  return value.replace(/[A-Za-z_][\w-]*/g, (token) =>
    keyframeNames.has(token) ? `${scope}_${token}` : token
  )
}

function transformCssRules(
  source,
  scope,
  classNames,
  keyframeNames,
  start = 0,
  end = source.length
) {
  let output = ''
  let segmentStart = start
  let cursor = start

  while (cursor < end) {
    if (source.startsWith('/*', cursor)) {
      cursor = consumeComment(source, cursor)
      continue
    }

    if (source[cursor] === '"' || source[cursor] === "'") {
      cursor = consumeString(source, cursor)
      continue
    }

    if (source[cursor] !== '{') {
      cursor += 1
      continue
    }

    const prelude = source.slice(segmentStart, cursor)
    const trimmedPrelude = trimLeadingWhitespaceAndComments(prelude)
    const isAtRule = trimmedPrelude.startsWith('@')
    const blockEnd = findMatchingToken(source, cursor, '{', '}', end)
    const blockMode = blockModeForPrelude(prelude)
    const isKeyframesBlock =
      blockMode === 'raw' && isAtRule && keyframesBlockPattern.test(trimmedPrelude)

    if (isKeyframesBlock) {
      output += scopeKeyframesPrelude(prelude, trimmedPrelude, scope)
    } else if (isAtRule) {
      output += prelude
    } else {
      output += scopeSelector(prelude, scope, classNames)
    }

    output += '{'

    let blockContent
    if (blockMode === 'rules') {
      blockContent = transformCssRules(
        source,
        scope,
        classNames,
        keyframeNames,
        cursor + 1,
        blockEnd
      )
    } else {
      blockContent = source.slice(cursor + 1, blockEnd)
      if (!isAtRule && keyframeNames.size > 0) {
        blockContent = blockContent.replace(
          animationDeclarationPattern,
          (match, propPrefix, value) =>
            `${propPrefix}${scopeKeyframeReferences(value, scope, keyframeNames)}`
        )
      }
    }

    output += blockContent
    output += '}'

    cursor = blockEnd < end ? blockEnd + 1 : blockEnd
    segmentStart = cursor
  }

  output += source.slice(segmentStart, end)
  return output
}

export function createCssModuleScope(filePath, root = process.cwd()) {
  const relativePath = path.relative(root, filePath).replace(/\\/g, '/')
  const fileName = path.basename(filePath, '.module.css').replace(/[^A-Za-z0-9_]/g, '_')
  const hash = crypto.createHash('sha1').update(relativePath).digest('hex').slice(0, 7)
  return `${fileName}_${hash}`
}

export function transformCssModule(source, scope) {
  const classNames = new Set()
  const keyframeNames = new Set()
  // Collect keyframe names first so that forward references (animation:
  // NAME used before @keyframes NAME is defined) are rewritten.
  collectKeyframeNames(source, keyframeNames)
  const css = transformCssRules(source, scope, classNames, keyframeNames)
  const classMap = Object.fromEntries(
    [...classNames]
      .sort((left, right) => left.localeCompare(right))
      .map((className) => [className, `${scope}_${className}`])
  )
  const keyframes = Object.fromEntries(
    [...keyframeNames]
      .sort((left, right) => left.localeCompare(right))
      .map((name) => [name, `${scope}_${name}`])
  )

  return { classMap, keyframes, css }
}

export function readCssModule(filePath, root = process.cwd()) {
  const source = fs.readFileSync(filePath, 'utf8')
  return transformCssModule(source, createCssModuleScope(filePath, root))
}

export function walkCssModuleFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      return walkCssModuleFiles(entryPath)
    }

    return entry.name.endsWith('.module.css') ? [entryPath] : []
  })
}
