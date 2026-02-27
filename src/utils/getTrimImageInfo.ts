import trimTransparentPixels, { TrimImageInfo } from './trimTransparentPixels'

interface TrimInfo extends TrimImageInfo {
  canvas: HTMLCanvasElement
}

export default function getTrimImageInfo(
  image: HTMLImageElement,
  threshold = 0,
): TrimInfo {
  const width = image.naturalWidth
  const height = image.naturalHeight

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get 2d context')

  // Guard: 0x0 image (corrupted file) — skip getImageData entirely
  if (width === 0 || height === 0) {
    canvas.width = 1
    canvas.height = 1
    return {
      canvas,
      width: 0,
      height: 0,
      trimOffsetLeft: 0,
      trimOffsetTop: 0,
    }
  }

  canvas.width = width
  canvas.height = height
  ctx.drawImage(image, 0, 0)
  const imageData = ctx.getImageData(0, 0, width, height)
  const trimInfo = trimTransparentPixels(imageData, threshold)

  // Guard: fully transparent image — avoid 0x0 canvas and invalid drawImage offsets
  if (trimInfo.width === 0 || trimInfo.height === 0) {
    canvas.width = 1
    canvas.height = 1
    return {
      canvas,
      width: 0,
      height: 0,
      trimOffsetLeft: 0,
      trimOffsetTop: 0,
    }
  }

  canvas.width = trimInfo.width
  canvas.height = trimInfo.height
  ctx.drawImage(image, trimInfo.trimOffsetLeft, trimInfo.trimOffsetTop)

  return {
    canvas,
    ...trimInfo,
  }
}
