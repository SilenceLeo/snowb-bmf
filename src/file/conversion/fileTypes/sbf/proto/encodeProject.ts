import { Project } from 'src/store'
import deepMapToObject from 'src/utils/deepMapToObject'

import { IProject, Project as ProjectProto } from './1.2.0/project'

function convertBuffersToUint8Array(project: Project): void {
  // font
  if (project.style?.font?.fonts?.length) {
    project.style.font.fonts.forEach((fontResource) => {
      if (fontResource.font && !(fontResource.font instanceof Uint8Array)) {
        fontResource.font = new Uint8Array(fontResource.font) as any
      }
    })
  }

  project.glyphImages?.forEach((glyphImage) => {
    if (glyphImage.buffer && !(glyphImage.buffer instanceof Uint8Array)) {
      glyphImage.buffer = new Uint8Array(glyphImage.buffer) as any
    }
  })

  // fill
  if (
    project.style?.fill?.patternTexture?.buffer &&
    !(project.style.fill.patternTexture.buffer instanceof Uint8Array)
  ) {
    project.style.fill.patternTexture.buffer = new Uint8Array(
      project.style.fill.patternTexture.buffer,
    ) as any
  }

  // stroke
  if (
    project.style?.stroke?.patternTexture?.buffer &&
    !(project.style.stroke.patternTexture.buffer instanceof Uint8Array)
  ) {
    project.style.stroke.patternTexture.buffer = new Uint8Array(
      project.style.stroke.patternTexture.buffer,
    ) as any
  }
}

export default function encodeProject(project: Project): Uint8Array {
  if (!project) {
    throw new Error('Project is required')
  }

  try {
    convertBuffersToUint8Array(project)

    const projectObject = deepMapToObject(project) as unknown as IProject
    const message = ProjectProto.create(projectObject)

    return ProjectProto.encode(message).finish()
  } catch (error) {
    throw new Error(
      `Failed to encode project: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
