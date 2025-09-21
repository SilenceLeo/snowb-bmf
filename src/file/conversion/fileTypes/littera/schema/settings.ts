import { JTDSchemaType } from 'ajv/dist/jtd'

export interface SettingsData {
  postfixes: string
  filename: string
  scalings: string
}

const settings: JTDSchemaType<SettingsData> = {
  properties: {
    postfixes: { type: 'string' },
    filename: { type: 'string' },
    scalings: { type: 'string' },
  },
}

export default settings
