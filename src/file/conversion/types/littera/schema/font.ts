import { JTDSchemaType } from 'ajv/dist/jtd'

export interface FontData {
  size: number
  data?: string
  spacing: number
}

const font: JTDSchemaType<FontData> = {
  properties: {
    size: { type: 'int32' },
    spacing: { type: 'int32' },
  },
  optionalProperties: {
    data: { type: 'string' },
  },
}

export default font
