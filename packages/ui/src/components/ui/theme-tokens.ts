export type SplatoonColorToken =
  | 'yellow'
  | 'blue'
  | 'green'
  | 'purple'
  | 'worldPurple'
  | 'orange'
  | 'red'
  | 'white'
  | 'black'
  | 'trueBlack'
  | 'salmonRunGreen'

export type SplatoonColorValue = SplatoonColorToken | (string & {})

export type SplatoonControlTrackColor = 'yellow' | 'blue' | 'green' | 'orange' | 'purple'
