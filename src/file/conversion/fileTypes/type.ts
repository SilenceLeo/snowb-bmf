import type { Project } from 'src/types/project'

export type CheckFunction = (fileSource: unknown) => boolean

export type DecodeProjectFunction = (buffer: unknown) => Partial<Project>

export interface ConversionFileItem {
  ext: string
  check: CheckFunction
  decode: DecodeProjectFunction
}
