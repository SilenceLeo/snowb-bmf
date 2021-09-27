import { saveAs } from 'file-saver'
import { Project } from 'src/store'
import { encodeProject } from 'src/proto'

import prefix from './prefix'

export default function saveProject(project: Project): void {
  const projectBuffer = encodeProject(project)
  const perfixBuffer = prefix()

  const buffer = new Uint8Array(
    perfixBuffer.byteLength + projectBuffer.byteLength,
  )

  buffer.set(perfixBuffer, 0)
  buffer.set(projectBuffer, perfixBuffer.byteLength)

  saveAs(new Blob([buffer]), `${project.name}.sbf`)
}
