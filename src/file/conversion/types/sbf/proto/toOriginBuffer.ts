import { Project } from 'src/store'
import { IProject } from './project'

export default function toOriginBuffer(protoProject: IProject): Project {
  const project = protoProject as unknown as Project
  const map = new Map()

  // font
  if (protoProject?.style?.font?.fonts) {
    protoProject.style.font.fonts.forEach((fontResource, idx) => {
      if (fontResource.font)
        project.style.font.fonts[idx].font = fontResource.font.slice().buffer
    })
  }

  // images
  if (protoProject?.glyphImages) {
    protoProject.glyphImages.forEach((glyphImage, idx) => {
      if (glyphImage.buffer) {
        project.glyphImages[idx].buffer = glyphImage.buffer.slice().buffer
      }
      if (glyphImage.kerning) {
        const imgKerning = new Map()
        Object.keys(glyphImage.kerning).forEach((key) => {
          if (glyphImage && glyphImage.kerning && glyphImage.kerning[key])
            imgKerning.set(key, glyphImage.kerning[key] || 0)
        })
        glyphImage.kerning = imgKerning as {}
      }
    })
  }

  if (protoProject?.glyphs) {
    Object.keys(protoProject.glyphs).forEach((k) => {
      if (protoProject && protoProject.glyphs && protoProject.glyphs[k]) {
        const gl = protoProject.glyphs[k]
        const glyphKerning = new Map()
        if (gl && gl.kerning) {
          Object.keys(gl.kerning).forEach((key) => {
            if (gl.kerning) glyphKerning.set(key, gl.kerning[key] || 0)
          })
        }
        map.set(k, { ...gl, kerning: glyphKerning })
      }
    })
    project.glyphs = map
  }

  // fill
  if (protoProject?.style?.fill?.patternTexture?.buffer) {
    project.style.fill.patternTexture.buffer =
      protoProject.style.fill.patternTexture.buffer.slice().buffer
  }

  // stroke
  if (protoProject?.style?.stroke?.patternTexture?.buffer) {
    project.style.stroke.patternTexture.buffer =
      protoProject.style.stroke.patternTexture.buffer.slice().buffer
  }

  return project
}
