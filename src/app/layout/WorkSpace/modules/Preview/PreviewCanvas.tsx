import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import useSpaceDrag from 'src/app/hooks/useSpaceDrag'
import useWheel from 'src/app/hooks/useWheel'
import {
  clearSelection,
  getGlyphForLetter,
  setPreviewTransform,
  useFontLineHeight,
  useFontSize,
  useGlyphDataVersion,
  useGlobalAdjustMetric,
  useIsPacking,
  usePackCanvases,
  usePadding,
  usePreviewText,
  usePreviewTransform,
  useFontBaselines,
} from 'src/store/legend'
import type { FontGlyphData, ImageGlyphData } from 'src/store/legend'

import LetterList from './LetterList'

interface PreviewData {
  lines: number
  list: {
    x: number
    y: number
    width: number
    height: number
    letter: string
    next: string
    glyph: FontGlyphData | ImageGlyphData
  }[]
  xOffset: number
  yOffset: number
  width: number
  height: number
}

// TODO: Consider extracting usePreviewData (data calculation logic) and
// usePreviewDraw (canvas drawing logic) hooks to reduce component size.
// Currently deferred due to tight coupling between canvas ref, multiple
// store subscriptions, and interdependent useEffect chains.
const PreviewCanvas: FunctionComponent = () => {
  const { bgPixel } = useTheme()

  // Use Legend State hooks
  const fontSize = useFontSize()
  const lineHeight = useFontLineHeight()
  const { middle, hanging, top, alphabetic, ideographic, bottom } = useFontBaselines()
  const padding = usePadding()
  const isPacking = useIsPacking()
  const globalAdjustMetric = useGlobalAdjustMetric()
  const packCanvases = usePackCanvases()
  const {
    scale: previewScale,
    offsetX: previewOffsetX,
    offsetY: previewOffsetY,
  } = usePreviewTransform()
  const previewText = usePreviewText()

  // Subscribe to glyph data version for reactivity (excludes position-only changes)
  const glyphDataVersion = useGlyphDataVersion()

  // Calculate min/max baselines
  const minBaseLine = Math.min(
    middle,
    hanging,
    top,
    alphabetic,
    ideographic,
    bottom,
  )
  const maxBaseLine = Math.max(
    middle,
    hanging,
    top,
    alphabetic,
    ideographic,
    bottom,
  )

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const domRef = useRef<HTMLDivElement>(null)

  // Use ref to avoid stale closures in drag/wheel callbacks
  const previewTransformRef = useRef({
    previewScale,
    previewOffsetX,
    previewOffsetY,
  })
  previewTransformRef.current = { previewScale, previewOffsetX, previewOffsetY }

  const [dragState, handleMouseDown] = useSpaceDrag((offsetInfo) => {
    const {
      previewScale: s,
      previewOffsetX: ox,
      previewOffsetY: oy,
    } = previewTransformRef.current
    const { offsetX: ix, offsetY: iy } = offsetInfo
    setPreviewTransform({
      previewOffsetX: ox + ix / s,
      previewOffsetY: oy + iy / s,
    })
  })

  const [data, setData] = useState<PreviewData | null>(null)

  const initData = useCallback(() => {
    if (!canvas) {
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    const lh = fontSize * lineHeight
    const fontHeight = maxBaseLine - minBaseLine
    const list: {
      x: number
      y: number
      width: number
      height: number
      letter: string
      next: string
      glyph: FontGlyphData | ImageGlyphData
    }[] = []
    const lines = previewText.split(/\r\n|\r|\n/)
    let minX = 0
    let minY = 0
    let maxX = 0
    let maxY = 0
    lines.forEach((str, index) => {
      const y = lh * index
      let x = 0
      const arr = Array.from(str)
      arr.forEach((letter, idx) => {
        const glyph = getGlyphForLetter(letter)
        if (!glyph) {
          return
        }
        const next = arr[idx + 1]
        const isUnEmpty = !!(glyph && glyph.width && glyph.height)
        const width = isUnEmpty ? glyph.width + padding * 2 : 0
        const height = isUnEmpty ? glyph.height + padding * 2 : 0
        const xoffset =
          globalAdjustMetric.xOffset +
          glyph.adjustMetric.xOffset -
          (isUnEmpty ? glyph.trimOffsetLeft : 0) -
          (isUnEmpty ? padding : 0)
        const yoffset =
          globalAdjustMetric.yOffset +
          glyph.adjustMetric.yOffset -
          (isUnEmpty ? glyph.trimOffsetTop : 0) -
          (isUnEmpty ? padding : 0)
        const xadvance =
          Math.ceil(glyph.fontWidth) +
          globalAdjustMetric.xAdvance +
          glyph.adjustMetric.xAdvance

        const obj = {
          x: x + xoffset + (width === 0 ? 0 : padding),
          y: y + yoffset + (width === 0 ? 0 : padding),
          width: (width || xadvance) - (width === 0 ? 0 : padding * 2),
          height: (height || fontHeight) - (width === 0 ? 0 : padding * 2),
          letter,
          next,
          glyph,
        }

        x += xadvance

        const kerningValue = (glyph.kerning as Record<string, number>)[next]
        if (kerningValue) {
          x += kerningValue
        }

        minX = Math.min(obj.x, minX)
        minY = Math.min(obj.y, minY)
        maxX = Math.max(obj.x + obj.width, maxX)
        maxY = Math.max(obj.y + obj.height, maxY)
        list.push(obj)
      })
    })

    setData({
      lines: lines.length,
      list,
      xOffset: minX,
      yOffset: minY,
      width: maxX - minX,
      height: Math.max(maxY - minY, lines.length * lh - minY) + 2,
    })
    // getGlyphForLetter is intentionally omitted from deps — it reads directly
    // from Legend State observables via .get() on each call, so it always returns
    // the latest data. Glyph reactivity is triggered by allGlyphs/imageGlyphs
    // subscriptions in the useEffect that calls initData below.
  }, [
    canvas,
    fontSize,
    lineHeight,
    maxBaseLine,
    minBaseLine,
    previewText,
    padding,
    globalAdjustMetric.xOffset,
    globalAdjustMetric.yOffset,
    globalAdjustMetric.xAdvance,
  ])

  useWheel(
    domRef,
    (info) => {
      const {
        previewScale: cs,
        previewOffsetX: cx,
        previewOffsetY: cy,
      } = previewTransformRef.current
      const s = cs + info.deltaScale
      const x = cx + info.deltaX / s
      const y = cy + info.deltaY / s
      setPreviewTransform({
        previewOffsetX: x,
        previewOffsetY: y,
        previewScale: s,
      })
    },
  )

  // Draw canvas when data changes
  useEffect(() => {
    if (!canvas || isPacking || !data) {
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    const lh = fontSize * lineHeight
    const drawYOffset = Math.max((lh - fontSize) / 2, 0)

    canvas.width = data.width
    canvas.height = data.height

    data.list.forEach((item) => {
      // Use type field instead of instanceof check
      if (item.glyph.type === 'image') {
        const imageGlyph = item.glyph as ImageGlyphData
        if (imageGlyph.source && imageGlyph.width > 0 && imageGlyph.height > 0) {
          ctx.drawImage(
            imageGlyph.source,
            item.x - data.xOffset,
            item.y - data.yOffset + drawYOffset,
          )
        }
      } else if (item.glyph.type === 'text') {
        // Unified coordinate processing: always use packed page coordinates
        const glyphPage = item.glyph.page || 0
        const sourceCanvas = packCanvases?.[glyphPage]

        if (sourceCanvas) {
          try {
            // Use packed position coordinates consistently (coordinates from packCanvases)
            ctx.drawImage(
              sourceCanvas,
              item.glyph.x + padding,
              item.glyph.y + padding,
              item.glyph.width,
              item.glyph.height,
              item.x - data.xOffset,
              item.y - data.yOffset + drawYOffset,
              item.glyph.width,
              item.glyph.height,
            )
          } catch (error) {
            console.warn(
              `[Preview] Failed to draw glyph ${item.glyph.letter} from page ${glyphPage}:`,
              error,
            )
          }
        }
      }
    })

    for (let index = 0; index < data.lines; index += 1) {
      ;[middle, hanging, top, alphabetic, ideographic, bottom].forEach(
        (baseLine) => {
          const baseY = Math.round(baseLine - minBaseLine + index * lh)
          ctx.beginPath()
          ctx.moveTo(-data.xOffset, baseY + 0.5 - data.yOffset + drawYOffset)
          ctx.lineTo(data.width, baseY + 0.5 - data.yOffset + drawYOffset)
          if (baseLine === minBaseLine || baseLine === maxBaseLine) {
            ctx.strokeStyle = 'rgba(0,0,0,1)'
            ctx.setLineDash([])
          } else {
            ctx.strokeStyle = 'rgba(0,0,0,0.5)'
            ctx.setLineDash([10, 3, 2, 3])
          }
          ctx.stroke()
        },
      )
      ctx.beginPath()
      ctx.moveTo(-data.xOffset + 0.5, index * lh - data.yOffset + drawYOffset)
      ctx.lineTo(
        -data.xOffset + 0.5,
        index * lh - data.yOffset + maxBaseLine - minBaseLine + drawYOffset,
      )
      ctx.strokeStyle = 'rgba(0,0,0,1)'
      ctx.setLineDash([])
      ctx.stroke()
    }
  }, [
    alphabetic,
    bottom,
    canvas,
    data,
    hanging,
    ideographic,
    isPacking,
    lineHeight,
    maxBaseLine,
    middle,
    minBaseLine,
    packCanvases,
    padding,
    fontSize,
    top,
  ])

  // Initialize data when glyphs change or packing completes
  // packCanvases changes at the END of packing flow (after positions are updated)
  useEffect(() => {
    initData()
  }, [initData, glyphDataVersion, packCanvases])

  const handleClearSelection = () => {
    clearSelection()
  }

  return (
    <Box
      aria-hidden
      ref={domRef}
      style={{
        position: 'relative',
        flex: 1,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...bgPixel,
        cursor:
          dragState === 2 ? 'grabbing' : dragState === 1 ? 'grab' : 'default',
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClearSelection}
    >
      <Box
        sx={{
          transformOrigin: '50% 50%',
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${data ? data.width : 0}px`,
          height: `${data ? data.height : 0}px`,
          marginLeft: `${(data ? data.width : 0) / -2}px`,
          marginTop: `${(data ? data.height : 0) / -2}px`,
          transform: `scale(${previewScale}) translate(${previewOffsetX}px,${previewOffsetY}px)`,
          '& canvas': {
            width: '100%',
            height: '100%',
            imageRendering: 'pixelated' as const,
          },
        }}
      >
        <canvas ref={(node) => setCanvas(node)} />
        {data ? (
          <LetterList
            data={data}
            drawYOffset={Math.max((fontSize * lineHeight - fontSize) / 2, 0)}
          />
        ) : null}
      </Box>
    </Box>
  )
}

export default PreviewCanvas
