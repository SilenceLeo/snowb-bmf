import { Project } from 'src/store'
import { encodeProject } from './proto'

import prefix from './prefix'

export default function encode(project: Project): Uint8Array {
  const perfixBuffer = prefix()
  const projectBuffer = encodeProject(project)

  const buffer = new Uint8Array(
    perfixBuffer.byteLength + projectBuffer.byteLength,
  )

  buffer.set(perfixBuffer, 0)
  buffer.set(projectBuffer, perfixBuffer.byteLength)

  return buffer
}
