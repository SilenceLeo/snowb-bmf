import { Project, Font } from 'src/store'
import { Project as ProjectProto, IProject } from 'src/proto'
import { Project as Project1000000 } from 'src/proto/1.0.0'
import { Project as Project1000001 } from 'src/proto/1.0.1'
import getVersionNumber from 'src/utils/getVersionNumber'
import updateOldProject from './updateOldProject'
import prefix from './prefix'

interface ProtoVersionMap {
  [key: number]: typeof ProjectProto
}

const oldDecodeProto: ProtoVersionMap = {
  1000000: Project1000000,
  1000001: Project1000001,
}

function toOriginBuffer(protoProject: IProject): Project {
  const project = { ...protoProject }
  const map = new Map()

  // font
  if (project?.style?.font?.font) {
    project.style.font = {
      ...(project.style.font as Font),
      font: project.style.font.font.slice().buffer as Uint8Array,
    }
  }

  // images
  if (project?.glyphImages) {
    project.glyphImages.forEach((glyphImage) => {
      if (glyphImage.buffer) {
        glyphImage.buffer = glyphImage.buffer.slice().buffer as Uint8Array
      }
      if (glyphImage.kerning) {
        const imgKerning = new Map()
        Object.keys(glyphImage.kerning).forEach((key) => {
          if (glyphImage && glyphImage.kerning && glyphImage.kerning[key])
            imgKerning.set(key, glyphImage.kerning[key] || 0)
        })
      }
    })

    // project.glyphImages = new Set(project.glyphImages)
  }

  if (project?.glyphs) {
    Object.keys(project.glyphs).forEach((k) => {
      if (project && project.glyphs && project.glyphs[k]) {
        const gl = project.glyphs[k]
        const glyphKerning = new Map()
        if (gl && gl.kerning) {
          Object.keys(gl.kerning).forEach((key) => {
            if (gl.kerning) glyphKerning.set(key, gl.kerning[key] || 0)
          })
        }
        map.set(k, { ...gl, kerning: glyphKerning })
      }
    })
  }

  // fill
  if (project?.style?.fill?.patternTexture?.buffer) {
    project.style.fill.patternTexture.buffer = project.style.fill.patternTexture.buffer.slice()
      .buffer as Uint8Array
  }

  // stroke
  if (project?.style?.stroke?.patternTexture?.buffer) {
    project.style.stroke.patternTexture.buffer = project.style.stroke.patternTexture.buffer.slice()
      .buffer as Uint8Array
  }

  return ({
    ...project,
    glyphs: map,
    glyphImages: project.glyphImages || [],
  } as unknown) as Project
}

export default function decodeProject(buffer: ArrayBuffer): Project {
  if (buffer.byteLength < 17) throw new Error('error')
  const perfixBuffer = prefix()
  const perfixName = perfixBuffer.slice(0, perfixBuffer.byteLength - 3)
  // const latestVersionBuffer = perfixBuffer.slice(perfixBuffer.byteLength - 3)
  const u8 = new Uint8Array(buffer)
  const filePrefix = u8.slice(0, perfixBuffer.byteLength)
  const versionBuffer = filePrefix.slice(filePrefix.byteLength - 3)
  let isSbf = true
  perfixName.forEach((e, i) => {
    if (filePrefix[i] !== e) isSbf = false
  })
  if (!isSbf) throw new Error('unknow file')
  // const currentVersion = getVersionNumber(Array.from(latestVersionBuffer))
  const fileVersion = getVersionNumber(Array.from(versionBuffer))

  const decodeProto = oldDecodeProto[fileVersion] || ProjectProto
  const project = decodeProto.decode(u8.slice(filePrefix.byteLength))

  return toOriginBuffer(updateOldProject(project, fileVersion))
}
