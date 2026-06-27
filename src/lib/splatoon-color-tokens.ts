export type SplatoonColorToken =
  | 'yellow'
  | 'blue'
  | 'green'
  | 'purple'
  | 'orange'
  | 'red'
  | 'white'
  | 'black'
  | 'trueBlack'
  | 'salmonRunGreen'

export const splatoonColorVars = {
  yellow: 'var(--color-yellow)',
  blue: 'var(--color-blue)',
  green: 'var(--color-green)',
  purple: 'var(--color-purple)',
  orange: 'var(--color-orange)',
  red: 'var(--color-red)',
  white: 'var(--color-white)',
  black: 'var(--color-black)',
  trueBlack: 'var(--color-true-black)',
  salmonRunGreen: 'var(--color-salmon-run-green)',
} as const satisfies Record<SplatoonColorToken, string>

export type SplatoonControlTrackColor = 'yellow' | 'blue' | 'green' | 'orange' | 'purple'

export interface SplatoonControlTrackColorConfig {
  activeTextColor: string
  accentColor: string
}

export const splatoonControlTrackColorConfig = {
  yellow: {
    accentColor: splatoonColorVars.yellow,
    activeTextColor: splatoonColorVars.trueBlack,
  },
  blue: {
    accentColor: splatoonColorVars.blue,
    activeTextColor: splatoonColorVars.white,
  },
  green: {
    accentColor: splatoonColorVars.salmonRunGreen,
    activeTextColor: splatoonColorVars.trueBlack,
  },
  orange: {
    accentColor: splatoonColorVars.orange,
    activeTextColor: splatoonColorVars.trueBlack,
  },
  purple: {
    accentColor: splatoonColorVars.purple,
    activeTextColor: splatoonColorVars.white,
  },
} as const satisfies Record<SplatoonControlTrackColor, SplatoonControlTrackColorConfig>
