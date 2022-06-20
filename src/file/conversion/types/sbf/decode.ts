import { DecodeProjectFunction } from '../type'
import {
  Project as ProjectProto,
  oldProto,
  OldProto,
  toOriginBuffer,
} from './proto'
import prefix from './prefix'
import getVersion from './getVersion'
import updateOldProject from './updateOldProject'

const decode: DecodeProjectFunction = (buffer) => {
  if (!(buffer instanceof ArrayBuffer)) throw new Error('unknow file')

  const version = getVersion(buffer)

  if (version === 0) throw new Error('unknow file')

  const perfixBuffer = prefix()
  const u8 = new Uint8Array(buffer)
  const filePrefix = u8.slice(0, perfixBuffer.byteLength)

  const decodeProto =
    oldProto[version as keyof OldProto]?.Project || ProjectProto

  const project = decodeProto.decode(u8.slice(filePrefix.byteLength))

  return toOriginBuffer(updateOldProject(project, version))
}

export default decode
