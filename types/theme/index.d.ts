import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
// import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import { TypeBackground } from '@material-ui/core/styles/createPalette'

declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    titleBar: string
    activityBar: string
    sidebar: string
  }
}

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    bgPixel: CSSProperties
  }
  // 使用 `createMuiTheme` 来配置
  interface ThemeOptions {
    bgPixel?: CSSProperties
  }
}
