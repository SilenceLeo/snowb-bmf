import { JTDSchemaType } from 'ajv/dist/jtd'

export interface BackgroundData {
  color: number
  alpha: number
}

const background: JTDSchemaType<BackgroundData> = {
  properties: {
    color: { type: 'int32' },
    alpha: { type: 'int32' },
  },
}

export default background
