import { DecodeProjectFunction } from '../type'
import { allProto, toOriginBuffer, updateOldProject } from './proto/index'
import { createPrefix, getVersion } from './utils'

const decode: DecodeProjectFunction = (buffer) => {
  if (!(buffer instanceof ArrayBuffer)) {
    throw new Error('Invalid buffer format - expected ArrayBuffer')
  }

  const version = getVersion(buffer)
  if (version === 0) {
    throw new Error('Invalid or corrupted SBF file')
  }

  const versionHandler = allProto[version as keyof typeof allProto]
  if (!versionHandler) {
    throw new Error(`Unsupported SBF version: ${version}`)
  }

  const prefixLength = createPrefix().byteLength
  if (buffer.byteLength <= prefixLength) {
    throw new Error('File too small - missing payload data')
  }

  try {
    const payload = new Uint8Array(buffer).slice(prefixLength)
    const project = versionHandler.Project.decode(payload)
    const updatedProject = updateOldProject(project, version)

    return toOriginBuffer(updatedProject)
  } catch (error) {
    throw new Error(
      `Failed to decode protobuf data: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

export default decode
