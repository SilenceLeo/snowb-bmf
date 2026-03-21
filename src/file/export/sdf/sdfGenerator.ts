/**
 * SDF (Signed Distance Field) generator using Felzenszwalb/Huttenlocher EDT algorithm.
 * Computes 2D Euclidean distance transform in O(n) linear time.
 *
 * Reference: "Distance Transforms of Sampled Functions"
 * P. Felzenszwalb & D. Huttenlocher, 2012
 */

const INF = 1e20

/**
 * 1D squared Euclidean distance transform using parabolic envelope method.
 * Operates in-place on a strided view of the data array.
 *
 * @param data - Float64 array containing distance values (modified in-place)
 * @param offset - Starting index in the array
 * @param stride - Step between consecutive elements
 * @param length - Number of elements to process
 * @param f - Temporary buffer for input values (reused across calls)
 * @param v - Temporary buffer for parabola locations (reused across calls)
 * @param z - Temporary buffer for parabola boundaries (reused across calls)
 */
function edt1d(
  data: Float64Array,
  offset: number,
  stride: number,
  length: number,
  f: Float64Array,
  v: Float64Array,
  z: Float64Array,
): void {
  // Copy input values
  for (let q = 0; q < length; q++) {
    f[q] = data[offset + q * stride]
  }

  // Compute lower envelope of parabolas
  let k = 0
  v[0] = 0
  z[0] = -INF
  z[1] = INF

  for (let q = 1; q < length; q++) {
    // Intersection of parabola q with parabola v[k]
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])

    while (k > 0 && s <= z[k]) {
      k--
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
    }

    k++
    v[k] = q
    z[k] = s
    z[k + 1] = INF
  }

  // Fill in distance values from lower envelope
  k = 0
  for (let q = 0; q < length; q++) {
    while (z[k + 1] < q) k++
    const dx = q - v[k]
    data[offset + q * stride] = f[v[k]] + dx * dx
  }
}

/**
 * Generate SDF grayscale data from a bitmap alpha channel.
 *
 * Algorithm:
 * 1. Convert alpha values to inside/outside distance seeds
 * 2. Run 2D EDT (decomposed into row + column 1D passes) for both inside and outside
 * 3. Combine: SDF = outside_dist - inside_dist, mapped to [0, 255]
 *
 * @param alphaData - Alpha channel values [0-255]
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @param radius - Distance field spread radius in pixels
 * @param cutoff - Inside/outside balance (0.25 = more outside range, 0.5 = symmetric)
 * @returns SDF grayscale values [0-255] where 128 = edge, >128 = inside, <128 = outside
 */
export function generateSdfFromAlpha(
  alphaData: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number,
  cutoff: number,
): Uint8ClampedArray {
  const size = width * height

  // Squared distance arrays for outside and inside
  const outerDist = new Float64Array(size)
  const innerDist = new Float64Array(size)

  // Initialize distance seeds from alpha values
  for (let i = 0; i < size; i++) {
    const a = alphaData[i] / 255 // Normalize to [0, 1]
    // Outside: 0 at opaque pixels, INF at transparent
    // Inside: 0 at transparent pixels, INF at opaque
    outerDist[i] = a === 1.0 ? 0 : a === 0.0 ? INF : Math.pow(Math.max(0, 0.5 - a), 2)
    innerDist[i] = a === 1.0 ? INF : a === 0.0 ? 0 : Math.pow(Math.max(0, a - 0.5), 2)
  }

  // Temporary buffers (reused for both passes)
  const maxDim = Math.max(width, height)
  const f = new Float64Array(maxDim)
  const v = new Float64Array(maxDim)
  const z = new Float64Array(maxDim + 1)

  // 2D EDT = row pass + column pass for each distance array
  edt2d(outerDist, width, height, f, v, z)
  edt2d(innerDist, width, height, f, v, z)

  // Combine into SDF values
  const sdf = new Uint8ClampedArray(size)
  for (let i = 0; i < size; i++) {
    const outerSqrt = Math.sqrt(outerDist[i])
    const innerSqrt = Math.sqrt(innerDist[i])
    const dist = outerSqrt - innerSqrt
    // Map distance to [0, 255]: cutoff maps to 128, +-radius maps to 0/255
    sdf[i] = Math.round(255 - 255 * (dist / radius + cutoff) / (2 * cutoff))
  }

  return sdf
}

/**
 * Apply 2D EDT by decomposing into 1D passes (rows then columns).
 */
function edt2d(
  data: Float64Array,
  width: number,
  height: number,
  f: Float64Array,
  v: Float64Array,
  z: Float64Array,
): void {
  // Horizontal pass (each row)
  for (let y = 0; y < height; y++) {
    edt1d(data, y * width, 1, width, f, v, z)
  }
  // Vertical pass (each column)
  for (let x = 0; x < width; x++) {
    edt1d(data, x, width, height, f, v, z)
  }
}

/**
 * Extract alpha channel from RGBA ImageData.
 */
export function extractAlphaChannel(imageData: ImageData): Uint8ClampedArray {
  const { data, width, height } = imageData
  const alpha = new Uint8ClampedArray(width * height)
  for (let i = 0; i < alpha.length; i++) {
    alpha[i] = data[i * 4 + 3] // Alpha is the 4th component
  }
  return alpha
}

/**
 * Convert SDF grayscale values to RGBA ImageData.
 *
 * Channel modes:
 * - 'rgb' (default): R=G=B=distance, A=255 — opaque grayscale (white glyph on black)
 * - 'rgb-inv': R=G=B=(255-distance), A=255 — inverted grayscale (black glyph on white)
 * - 'alpha': R=G=B=255, A=distance — distance stored in alpha channel (white text)
 * - 'alpha-inv': R=G=B=0, A=distance — distance stored in alpha channel (black text)
 */
export function sdfToImageData(
  sdfData: Uint8ClampedArray,
  width: number,
  height: number,
  channel: 'rgb' | 'rgb-inv' | 'alpha' | 'alpha-inv' = 'rgb',
): ImageData {
  const imageData = new ImageData(width, height)
  const { data } = imageData
  for (let i = 0; i < sdfData.length; i++) {
    const v = sdfData[i]
    const offset = i * 4
    if (channel === 'alpha') {
      data[offset] = 255     // R = white
      data[offset + 1] = 255 // G = white
      data[offset + 2] = 255 // B = white
      data[offset + 3] = v   // A = distance
    } else if (channel === 'alpha-inv') {
      data[offset] = 0       // R = black
      data[offset + 1] = 0   // G = black
      data[offset + 2] = 0   // B = black
      data[offset + 3] = v   // A = distance
    } else if (channel === 'rgb-inv') {
      const inv = 255 - v
      data[offset] = inv     // R = inverted distance
      data[offset + 1] = inv // G = inverted distance
      data[offset + 2] = inv // B = inverted distance
      data[offset + 3] = 255 // A = opaque
    } else {
      data[offset] = v       // R = distance
      data[offset + 1] = v   // G = distance
      data[offset + 2] = v   // B = distance
      data[offset + 3] = 255 // A = opaque
    }
  }
  return imageData
}
