export interface TrimImageInfo {
  width: number
  height: number
  trimOffsetTop: number
  trimOffsetLeft: number
}

function isPixelVisible(
  data: Uint8ClampedArray,
  index: number,
  threshold: number,
): boolean {
  return data[index * 4 + 3] > threshold
}

export default function trimTransparentPixels(
  imageData: ImageData,
  threshold = 0,
): TrimImageInfo {
  const { data, width, height } = imageData
  let topTrim = 0
  let bottomTrim = 0
  let leftTrim = 0
  let rightTrim = 0
  let hasTopTransparentPixels = true
  let hasBottomTransparentPixels = true
  let hasLeftTransparentPixels = true
  let hasRightTransparentPixels = true

  // First loop: find top and bottom boundaries simultaneously
  verticalLoop: for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (
        hasTopTransparentPixels &&
        isPixelVisible(data, y * width + x, threshold)
      ) {
        hasTopTransparentPixels = false
      }
      if (
        hasBottomTransparentPixels &&
        isPixelVisible(data, (height - y - 1) * width + x, threshold)
      ) {
        hasBottomTransparentPixels = false
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
  if (topTrim + bottomTrim >= height) {
    return {
      trimOffsetLeft: -width,
      trimOffsetTop: -height,
      width: 0,
      height: 0,
    }
  }

  const effectiveHeight = height - bottomTrim

  // Second loop: find left and right boundaries simultaneously
  horizontalLoop: for (let x = 0; x < width; x++) {
    for (let y = topTrim; y < effectiveHeight; y++) {
      if (
        hasLeftTransparentPixels &&
        isPixelVisible(data, y * width + x, threshold)
      ) {
        hasLeftTransparentPixels = false
      }
      if (
        hasRightTransparentPixels &&
        isPixelVisible(data, y * width + (width - x - 1), threshold)
      ) {
        hasRightTransparentPixels = false
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
    width: width - leftTrim - rightTrim,
    height: height - topTrim - bottomTrim,
  }
}
