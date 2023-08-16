import is from './is'

export interface FontStyleConfig {
  fontStyle?: 'normal' | 'italic' | 'oblique' | string
  fontVariant?: 'normal' | 'none' | 'small-caps' | string
  fontWeight?:
    | 'normal'
    | 'bold'
    | 'lighter'
    | 'bolder'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900
    | 'inherit'
    | 'initial'
    | 'unset'
  fontSize?: string | number
  lineHeight?: string | number
  fontFamily?: string
}

const defaultConfig: FontStyleConfig = {
  fontSize: '14px',
  fontFamily: 'sans-serif',
}

// https://developer.mozilla.org/zh-CN/docs/Web/CSS/font
export default function fontStyleStringify(
  fontStyleConfig: FontStyleConfig,
): string {
  const config = { ...defaultConfig, ...fontStyleConfig }
  const arr = []

  if (config.fontStyle) arr.push(config.fontStyle)

  if (config.fontVariant) arr.push(config.fontVariant)

  if (config.fontWeight) arr.push(config.fontWeight)

  if (is.num(config.fontSize)) {
    config.fontSize = `${config.fontSize}px`
  } else {
    config.fontSize = defaultConfig.fontSize
  }

  if (config.lineHeight) {
    // TODO: LINEHEIGHT
    arr.push(`${config.fontSize}/${config.lineHeight}`)
  } else {
    arr.push(config.fontSize)
  }

  arr.push(config.fontFamily)

  return arr.join(' ')
}
