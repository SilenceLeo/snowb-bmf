import { Font } from 'opentype.js'

declare module 'opentype.js' {
  interface Options {
    lowMemory?: boolean
  }
  // eslint-disable-next-line import/prefer-default-export
  export function parse(buffer: ArrayBuffer, options?: Options): Font
}
