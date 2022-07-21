import getTrimImageData, { TrimImageData } from './getTrimImageData'

interface TrimImageInfo extends TrimImageData {
  canvas: HTMLCanvasElement
}

export default function getTrimImageInfo(
  image: HTMLImageElement,
  threshold = 10,
): TrimImageInfo {
  const width = image.naturalWidth
  const height = image.naturalHeight

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.drawImage(image, 0, 0)
  const imageData = ctx.getImageData(0, 0, width, height)
  const trimInfo = getTrimImageData(imageData, threshold)
  canvas.width = trimInfo.width
  canvas.height = trimInfo.height
  ctx.drawImage(image, trimInfo.trimOffsetLeft, trimInfo.trimOffsetTop)
  console.log({ trimInfo })

  return {
    canvas,
    ...trimInfo,
  }
}
