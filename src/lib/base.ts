/** Prefix a public-asset path with the app's base path ('/kalamaki-guide/'). */
export function withBase(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}

/** Absolute URL variant — required for MapLibre style glyphs/sprite. */
export function withAbsBase(path: string): string {
  return new URL(withBase(path), window.location.origin).toString()
}
