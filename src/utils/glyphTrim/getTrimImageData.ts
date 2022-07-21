export interface TrimImageData {
  width: number
  height: number
  trimOffsetTop: number
  trimOffsetLeft: number
}

export default function getTrimImageData(
  imageData: ImageData,
  threshold = 0,
): TrimImageData {
  const { data, width, height } = imageData
  let topTrim = 0
  let bottomTrim = 0
  let leftTrim = 0
  let rightTrim = 0
  let topStatus = true
  let bottomStatus = true
  let leftStatus = true
  let rightStatus = true

  let h: number = Math.ceil(height / 2)
  const w: number = Math.ceil(width / 2)

  for (let i = 0; i < h; i += 1) {
    for (let j = 0; j < width; j += 1) {
      if (topStatus && data[(i * width + j) * 4 + 3] > threshold) {
        topStatus = false
      }
      if (
        bottomStatus &&
        data[((height - i - 1) * width + j) * 4 + 3] > threshold
      ) {
        bottomStatus = false
      }
      if (!topStatus && !bottomStatus) {
        break
      }
    }
    if (!topStatus && !bottomStatus) {
      break
    }
    if (topStatus) topTrim += 1
    if (bottomStatus) bottomTrim += 1
  }

  if (topTrim + bottomTrim >= height) {
    // Is empty image.
    return {
      trimOffsetLeft: width * -1,
      trimOffsetTop: height * -1,
      width: 0,
      height: 0,
    }
  }

  h = height - bottomTrim

  for (let i = 0; i < w; i += 1) {
    for (let j = topTrim; j < h; j += 1) {
      if (leftStatus && data[(width * j + i) * 4 + 3] > threshold) {
        leftStatus = false
      }
      if (
        rightStatus &&
        data[(width * j + width - i - 1) * 4 + 3] > threshold
      ) {
        rightStatus = false
      }
      if (!leftStatus && !rightStatus) {
        break
      }
    }
    if (!leftStatus && !rightStatus) {
      break
    }
    if (leftStatus) leftTrim += 1
    if (rightStatus) rightTrim += 1
  }

  return {
    trimOffsetLeft: leftTrim * -1,
    trimOffsetTop: topTrim * -1,
    width: width - leftTrim - rightTrim,
    height: height - topTrim - bottomTrim,
  }
}
