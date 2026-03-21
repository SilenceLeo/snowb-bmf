export interface TrimImageInfo {
  width: number
  height: number
  trimOffsetTop: number
  trimOffsetLeft: number
}

export default function trimTransparentPixels(
  imageData: ImageData,
  threshold = 0,
): TrimImageInfo {
  const { width, height, data } = imageData
  return trimTransparentPixelsFromRegion(
    data,
    width,
    0,
    0,
    width,
    height,
    threshold,
  )
}

/**
 * Trim transparent pixels from a sub-region of a larger ImageData buffer.
 * Uses the same dual-scan algorithm as trimTransparentPixels but operates
 * on a region within a shared buffer, avoiding extra getImageData calls.
 */
export function trimTransparentPixelsFromRegion(
  data: Uint8ClampedArray,
  fullWidth: number,
  regionX: number,
  regionY: number,
  regionWidth: number,
  regionHeight: number,
  threshold = 0,
): TrimImageInfo {
  let topTrim = 0
  let bottomTrim = 0
  let leftTrim = 0
  let rightTrim = 0
  let hasTopTransparentPixels = true
  let hasBottomTransparentPixels = true
  let hasLeftTransparentPixels = true
  let hasRightTransparentPixels = true

  // First loop: find top and bottom boundaries simultaneously
  verticalLoop: for (let y = 0; y < regionHeight; y++) {
    for (let x = 0; x < regionWidth; x++) {
      if (hasTopTransparentPixels) {
        const idx = ((regionY + y) * fullWidth + (regionX + x)) * 4 + 3
        if (data[idx] > threshold) {
          hasTopTransparentPixels = false
        }
      }
      if (hasBottomTransparentPixels) {
        const idx =
          ((regionY + regionHeight - y - 1) * fullWidth + (regionX + x)) * 4 + 3
        if (data[idx] > threshold) {
          hasBottomTransparentPixels = false
        }
      }
      if (!hasTopTransparentPixels && !hasBottomTransparentPixels) {
        break verticalLoop
      }
    }
    if (hasTopTransparentPixels) {
      topTrim++
    }
    if (hasBottomTransparentPixels) {
      bottomTrim++
    }
  }

  // Check for empty image
  if (topTrim + bottomTrim >= regionHeight) {
    return {
      trimOffsetLeft: -regionWidth,
      trimOffsetTop: -regionHeight,
      width: 0,
      height: 0,
    }
  }

  const effectiveHeight = regionHeight - bottomTrim

  // Second loop: find left and right boundaries simultaneously
  horizontalLoop: for (let x = 0; x < regionWidth; x++) {
    for (let y = topTrim; y < effectiveHeight; y++) {
      if (hasLeftTransparentPixels) {
        const idx = ((regionY + y) * fullWidth + (regionX + x)) * 4 + 3
        if (data[idx] > threshold) {
          hasLeftTransparentPixels = false
        }
      }
      if (hasRightTransparentPixels) {
        const idx =
          ((regionY + y) * fullWidth + (regionX + regionWidth - x - 1)) * 4 + 3
        if (data[idx] > threshold) {
          hasRightTransparentPixels = false
        }
      }
      if (!hasLeftTransparentPixels && !hasRightTransparentPixels) {
        break horizontalLoop
      }
    }
    if (hasLeftTransparentPixels) {
      leftTrim++
    }
    if (hasRightTransparentPixels) {
      rightTrim++
    }
  }

  return {
    trimOffsetLeft: -leftTrim,
    trimOffsetTop: -topTrim,
    width: regionWidth - leftTrim - rightTrim,
    height: regionHeight - topTrim - bottomTrim,
  }
}
