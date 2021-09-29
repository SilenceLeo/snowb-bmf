import { JTDSchemaType } from 'ajv/dist/jtd'

export interface BackgroundData {
  color: number
  alpha: number
}

const background: JTDSchemaType<BackgroundData> = {
  properties: {
    color: { type: 'float32' },
    alpha: { type: 'float32' },
  },
}

export default background
