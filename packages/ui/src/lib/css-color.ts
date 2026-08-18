/**
 * Distinguishes a raw CSS color value from a utility class name.
 *
 * Components that accept a `textColor`-style prop support both forms: a CSS
 * color goes to the `style` attribute, anything else is treated as a class.
 */
export function isCssColor(value: string) {
  return (
    value.startsWith('#') ||
    value.startsWith('rgb') ||
    value.startsWith('var(') ||
    value.startsWith('hsl')
  )
}
