import type { Project } from 'src/types/project'
import { ensureUint8Array } from 'src/utils/bufferUtils'

import { IProject, Project as ProjectProto } from './1.3.0/project'

function convertBuffersToUint8Array(project: Project): void {
  // font
  if (project.style?.font?.fonts?.length) {
    project.style.font.fonts.forEach(
      (fontResource: { font?: ArrayBuffer | Uint8Array }) => {
        if (fontResource.font) {
          // Protobuf requires Uint8Array; Project stores ArrayBuffer for runtime use
          fontResource.font = ensureUint8Array(fontResource.font) as any
        }
      },
    )
  }

  project.glyphImages?.forEach((glyphImage) => {
    if (glyphImage.buffer) {
      // Protobuf requires Uint8Array; Project stores ArrayBuffer for runtime use
      glyphImage.buffer = ensureUint8Array(glyphImage.buffer) as any
    }
  })

  // fill
  if (project.style?.fill?.patternTexture?.buffer) {
    // Protobuf requires Uint8Array; Project stores ArrayBuffer for runtime use
    project.style.fill.patternTexture.buffer = ensureUint8Array(
      project.style.fill.patternTexture.buffer,
    ) as any
  }

  // stroke
  if (project.style?.stroke?.patternTexture?.buffer) {
    // Protobuf requires Uint8Array; Project stores ArrayBuffer for runtime use
    project.style.stroke.patternTexture.buffer = ensureUint8Array(
      project.style.stroke.patternTexture.buffer,
    ) as any
  }
}

export default function encodeProject(project: Project): Uint8Array {
  if (!project) {
    throw new Error('Project is required')
  }

  try {
    const projectCopy = structuredClone(project)
    convertBuffersToUint8Array(projectCopy)

    const projectObject = projectCopy as unknown as IProject
    const message = ProjectProto.create(projectObject)

    return ProjectProto.encode(message).finish()
  } catch (error) {
    throw new Error(
      `Failed to encode project: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
