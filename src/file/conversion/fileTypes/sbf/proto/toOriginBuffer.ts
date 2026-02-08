import type { Project } from 'src/types/project'
import { uint8ArrayToArrayBuffer } from 'src/utils/bufferUtils'

import { IProject } from './1.2.1/project'

function convertKerning(
  kerning: Record<string, number>,
): Record<string, number> {
  const result: Record<string, number> = {}
  for (const [key, value] of Object.entries(kerning)) {
    if (value !== 0) {
      result[key] = value
    }
  }
  return result
}

export default function toOriginBuffer(protoProject: IProject): Project {
  const project = protoProject as unknown as Project

  // Convert font buffers
  if (protoProject.style?.font?.fonts) {
    protoProject.style.font.fonts.forEach((fontResource, idx) => {
      if (fontResource.font) {
        project.style.font.fonts[idx].font = uint8ArrayToArrayBuffer(
          fontResource.font,
        )
      }
    })
  }

  // Convert glyph image buffers and kerning
  if (protoProject.glyphImages) {
    protoProject.glyphImages.forEach((glyphImage, idx) => {
      if (glyphImage.buffer) {
        project.glyphImages[idx].buffer = uint8ArrayToArrayBuffer(
          glyphImage.buffer,
        )
      }
      if (glyphImage.kerning) {
        glyphImage.kerning = convertKerning(glyphImage.kerning) as Record<
          string,
          number
        >
      }
    })
  }

  // Convert glyphs and their kerning to Record
  if (protoProject.glyphs) {
    const glyphRecord: Record<string, unknown> = {}
    for (const [key, glyph] of Object.entries(protoProject.glyphs)) {
      glyphRecord[key] = {
        ...glyph,
        kerning: glyph.kerning ? convertKerning(glyph.kerning) : {},
      }
    }
    project.glyphs = glyphRecord as Project['glyphs']
  }

  // Convert texture buffers
  if (protoProject.style?.fill?.patternTexture?.buffer) {
    project.style.fill.patternTexture.buffer = uint8ArrayToArrayBuffer(
      protoProject.style.fill.patternTexture.buffer,
    )
  }

  if (protoProject.style?.stroke?.patternTexture?.buffer) {
    project.style.stroke.patternTexture.buffer = uint8ArrayToArrayBuffer(
      protoProject.style.stroke.patternTexture.buffer,
    )
  }

  return project
}
