import { Project } from 'src/store'
import { Project as ProjectProto, IProject } from './project'
import deepMapToObject from 'src/utils/deepMapToObject'

export default function saveProject(project: Project): Uint8Array {
  // font
  if (project.style.font.fonts && project.style.font.fonts.length) {
    project.style.font.fonts.forEach(
      (fontResource) => (fontResource.font = new Uint8Array(fontResource.font)),
    )
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

  return ProjectProto.encode(
    ProjectProto.create(deepMapToObject(project) as unknown as IProject),
  ).finish()
}
