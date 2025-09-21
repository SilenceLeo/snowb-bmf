import { JTDSchemaType } from 'ajv/dist/jtd'

export interface FontData {
  size: number
  data?: string
  spacing: number
}

const font: JTDSchemaType<FontData> = {
  properties: {
    size: { type: 'float32' },
    spacing: { type: 'float32' },
  },
  optionalProperties: {
    data: { type: 'string' },
  },
}

export default font
