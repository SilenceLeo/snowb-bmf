import { CSSProperties } from 'react'

// MUI v7 theme extension
declare module '@mui/material/styles' {
  interface TypeBackground {
    titleBar: string
    activityBar: string
    sidebar: string
  }

  interface Theme {
    bgPixel: CSSProperties
  }

  interface ThemeOptions {
    bgPixel?: CSSProperties
  }
}
