import { Project } from 'src/store'

import { IProject } from './1.1.2/project'

function convertKerning(kerning: Record<string, number>): Map<string, number> {
  const map = new Map()
  for (const [key, value] of Object.entries(kerning)) {
    map.set(key, value || 0)
  }
  return map
}

export default function toOriginBuffer(protoProject: IProject): Project {
  const project = protoProject as unknown as Project

  // Convert font buffers
  if (protoProject.style?.font?.fonts) {
    protoProject.style.font.fonts.forEach((fontResource, idx) => {
      if (fontResource.font) {
        project.style.font.fonts[idx].font = fontResource.font.slice().buffer
      }
    })
  }

  // Convert glyph image buffers and kerning
  if (protoProject.glyphImages) {
    protoProject.glyphImages.forEach((glyphImage, idx) => {
      if (glyphImage.buffer) {
        project.glyphImages[idx].buffer = glyphImage.buffer.slice().buffer
      }
      if (glyphImage.kerning) {
        glyphImage.kerning = convertKerning(glyphImage.kerning) as {}
      }
    })
  }

  // Convert glyphs and their kerning to Map
  if (protoProject.glyphs) {
    const glyphMap = new Map()
    for (const [key, glyph] of Object.entries(protoProject.glyphs)) {
      glyphMap.set(key, {
        ...glyph,
        kerning: glyph.kerning ? convertKerning(glyph.kerning) : new Map(),
      })
    }
    project.glyphs = glyphMap
  }

  // Convert texture buffers
  if (protoProject.style?.fill?.patternTexture?.buffer) {
    project.style.fill.patternTexture.buffer =
      protoProject.style.fill.patternTexture.buffer.slice().buffer
  }

  if (protoProject.style?.stroke?.patternTexture?.buffer) {
    project.style.stroke.patternTexture.buffer =
      protoProject.style.stroke.patternTexture.buffer.slice().buffer
  }

  return project
}
