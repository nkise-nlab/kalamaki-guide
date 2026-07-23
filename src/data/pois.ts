export interface Poi {
  id: string
  order: number
  name: string
  nameEl: string
  lat: number
  lng: number
  /** Geofence trigger radius in meters. */
  radiusM: number
  audio: string
  photo: string | null
  /** One-line hook shown in the list. */
  tagline: string
  /** Full narration text — also the ElevenLabs TTS input. */
  transcript: string
}

/** Welcome track played on "Start tour" (also unlocks iOS audio). */
export const INTRO_AUDIO = 'audio/intro.mp3'

export const INTRO_TRANSCRIPT = 'Placeholder — pending research.'

// PLACEHOLDER data — coordinates and transcripts are being replaced with
// researched, verified content. Do not ship until updated.
export const POIS: readonly Poi[] = [
  {
    id: 'agios-dionysios',
    order: 1,
    name: 'Church of Agios Dionysios',
    nameEl: 'Ιερός Ναός Αγίου Διονυσίου',
    lat: 37.7756,
    lng: 20.8994,
    radiusM: 60,
    audio: 'audio/agios-dionysios.mp3',
    photo: null,
    tagline: 'The saint who forgave his brother’s murderer',
    transcript: 'Placeholder — pending research.',
  },
] as const
