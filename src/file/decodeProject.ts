import { Project } from 'src/store'
import {
  Project as ProjectProto,
  oldProto,
  OldProto,
  toOriginBuffer,
} from 'src/proto'
import getVersionNumber from 'src/utils/getVersionNumber'
import updateOldProject from './updateOldProject'
import prefix from './prefix'

export default function decodeProject(buffer: ArrayBuffer): Project {
  if (buffer.byteLength < 17) throw new Error('error')
  const perfixBuffer = prefix()
  const perfixName = perfixBuffer.slice(0, perfixBuffer.byteLength - 3)
  const u8 = new Uint8Array(buffer)
  const filePrefix = u8.slice(0, perfixBuffer.byteLength)
  const versionBuffer = filePrefix.slice(filePrefix.byteLength - 3)
  let isSbf = true

  perfixName.forEach((e, i) => {
    if (filePrefix[i] !== e) isSbf = false
  })

  if (!isSbf) throw new Error('unknow file')

  const fileVersion = getVersionNumber(Array.from(versionBuffer))

  const decodeProto =
    oldProto[fileVersion as keyof OldProto]?.Project || ProjectProto
  const project = decodeProto.decode(u8.slice(filePrefix.byteLength))
  return toOriginBuffer(updateOldProject(project, fileVersion))
}
