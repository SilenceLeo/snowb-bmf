import { Project } from 'src/store'

import { encodeProject } from './proto/index'
import { createPrefix } from './utils'

export default function encode(project: Project): Uint8Array {
  if (!project) {
    throw new Error('Project cannot be null or undefined')
  }

  try {
    const prefix = createPrefix()
    const payload = encodeProject(project)
    const buffer = new Uint8Array(prefix.byteLength + payload.byteLength)

    buffer.set(prefix, 0)
    buffer.set(payload, prefix.byteLength)

    return buffer
  } catch (error) {
    throw new Error(
      `Failed to encode project: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
