import getVersionNumber from 'src/utils/getVersionNumber'

import { CheckFunction } from '../type'

// SBF file prefix constants
const PREFIX_STR = 'SnowBambooBMF'
const VERSION_BYTES = [1, 2, 1]

/**
 * Creates the SBF file prefix with version bytes
 */
export function createPrefix(): Uint8Array {
  const prefixBytes = [...PREFIX_STR].map((char) => char.charCodeAt(0))
  return new Uint8Array([...prefixBytes, ...VERSION_BYTES])
}

/**
 * Gets the version number from an SBF file buffer
 */
export function getVersion(buffer: unknown): number {
  if (!(buffer instanceof ArrayBuffer)) return 0

  const prefixBuffer = createPrefix()
  if (buffer.byteLength < prefixBuffer.byteLength) return 0

  const u8 = new Uint8Array(buffer)
  const filePrefix = u8.slice(0, prefixBuffer.byteLength)
  const prefixName = prefixBuffer.slice(0, -3) // Remove last 3 bytes (version)

  // Check SBF signature
  for (let i = 0; i < prefixName.length; i++) {
    if (filePrefix[i] !== prefixName[i]) return 0
  }

  const versionBytes = filePrefix.slice(-3)
  return getVersionNumber(Array.from(versionBytes))
}

/**
 * Checks if a buffer is a valid SBF file
 */
export function isSBFFile(buffer: unknown): boolean {
  return getVersion(buffer) > 0
}

/**
 * Check function for file type detection
 */
export const check: CheckFunction = isSBFFile
