import { saveAs } from 'file-saver'
import { Project } from 'src/store'
import { Project as ProjectProto, IProject } from 'src/proto'

import prefix from './prefix'

export default function saveProject(project: Project): void {
  // font
  if (project.style.font.font) {
    project.style.font.font = new Uint8Array(project.style.font.font)
  }

  // images
  project.glyphImages.forEach((glyphImage) => {
    if (glyphImage.buffer) glyphImage.buffer = new Uint8Array(glyphImage.buffer)
  })

  // fill
  if (project.style.fill.patternTexture.buffer) {
    project.style.fill.patternTexture.buffer = new Uint8Array(
      project.style.fill.patternTexture.buffer,
    )
  }

  // stroke
  if (project.style.stroke.patternTexture.buffer) {
    project.style.stroke.patternTexture.buffer = new Uint8Array(
      project.style.stroke.patternTexture.buffer,
    )
  }

  const protoProject = ProjectProto.create((project as unknown) as IProject)
  const projectBuffer = ProjectProto.encode(protoProject).finish()
  const perfixBuffer = prefix()

  const buffer = new Uint8Array(
    perfixBuffer.byteLength + projectBuffer.byteLength,
  )
  buffer.set(perfixBuffer, 0)
  buffer.set(projectBuffer, perfixBuffer.byteLength)

  saveAs(new Blob([buffer]), `${project.name}.sbf`)
}
