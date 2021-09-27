import getVersionNumber from 'src/utils/getVersionNumber'
import prefix from './prefix'

export default function decode(buffer: unknown): number {
  if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < 17) return 0
  const perfixBuffer = prefix()
  const perfixName = perfixBuffer.slice(0, perfixBuffer.byteLength - 3)
  const u8 = new Uint8Array(buffer)
  const filePrefix = u8.slice(0, perfixBuffer.byteLength)
  const versionBuffer = filePrefix.slice(filePrefix.byteLength - 3)
  let isSbf = true

  perfixName.forEach((e, i) => {
    if (filePrefix[i] !== e) isSbf = false
  })

  if (!isSbf) return 0

  return getVersionNumber(Array.from(versionBuffer))
}
