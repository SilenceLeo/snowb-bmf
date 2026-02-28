import type { GradientColor } from './style'

export interface GradientPreset {
  id: string // 'builtin-xxx' | 'user-{timestamp}'
  name: string
  palette: GradientColor[] // { offset, color } without id
  isBuiltin: boolean
}
