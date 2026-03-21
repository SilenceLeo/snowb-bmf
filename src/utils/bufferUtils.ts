/**
 * Ensures a value is a Uint8Array.
 * Converts ArrayBuffer to Uint8Array if needed.
 */
export function ensureUint8Array(buffer: ArrayBuffer | Uint8Array): Uint8Array {
  if (buffer instanceof Uint8Array) {
    return buffer
  }
  return new Uint8Array(buffer)
}

/**
 * Converts a Uint8Array to an ArrayBuffer with precise byte boundaries.
 * Uses .slice() to ensure the resulting buffer exactly matches the byte range,
 * avoiding issues with shared underlying ArrayBuffer from TypedArray views.
 */
export function uint8ArrayToArrayBuffer(u8: Uint8Array): ArrayBuffer {
  return u8.byteOffset === 0 && u8.byteLength === u8.buffer.byteLength
    ? (u8.buffer as ArrayBuffer)
    : u8.slice().buffer
}
