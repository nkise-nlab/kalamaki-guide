/** Prefix a public-asset path with the app's base path ('/kalamaki-guide/'). */
export function withBase(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}

/**
 * Absolute URL variant — required for MapLibre style glyphs/sprite.
 * Plain string concat: new URL() would percent-encode the {fontstack}/{range}
 * template tokens and MapLibre would reject the style.
 */
export function withAbsBase(path: string): string {
  return window.location.origin + withBase(path)
}
