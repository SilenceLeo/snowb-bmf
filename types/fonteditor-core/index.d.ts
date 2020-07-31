declare module 'fonteditor-core' {
  type Deflate = (() => void) | null
  type Inflate = (() => void) | null

  interface FontName {
    copyright: string
    designer: string
    fontFamily: string
    fontSubFamily: string
    fullName: string
    postScriptName: string
    preferredFamily: string
    preferredSubFamily: string
    tradeMark: string
    uniqueSubFamily: string
    urlOfFontVendor: string
    urlOfLicence: string
    version: string
  }

  export interface Support {
    head: {
      [key: string]: number | Date
    }
    hhea: {
      [key: string]: number
    }
  }

  export interface FontInfo extends Support {
    GPOS: number[]
    entrySelector: number
    name: FontName
  }

  export interface CreateConfig {
    type: string
    subset?: number[]
    hinting?: boolean
    compound2simple?: boolean
    inflate?: Inflate
    combinePath?: boolean
  }

  export interface WriteConfig {
    type: 'ttf' | 'woff' | 'woff2' | 'eot' | 'svg'
    hinting: boolean // save font hinting
    deflate?: Deflate // deflate function for woff
    support: Support // for user to overwrite head.xMin, head.xMax, head.yMin, head.yMax, hhea etc.
  }

  export class Font {
    static create(buffer: ArrayBuffer, config: CreateConfig): Font
    write(config: WriteConfig): ArrayBuffer
    get(): FontInfo
  }

  // export const Font: FontModule
}
