import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import useSpaceDrag from 'src/app/hooks/useSpaceDrag'
import useWheel from 'src/app/hooks/useWheel'
import {
  clearSelection,
  getGlyphForLetter,
  setPreviewTransform,
  useDistanceRange,
  useFontBaselines,
  useFontLineHeight,
  useFontSize,
  useGlobalAdjustMetric,
  useGlyphDataVersion,
  useIsPacking,
  usePackCanvases,
  usePadding,
  usePreviewText,
  usePreviewTransform,
  useRenderMode,
  useSdfChannel,
  useSdfPreviewColor,
  useSdfPreviewFontSize,
  useSdfPreviewLineHeight,
} from 'src/store/legend'
import type { FontGlyphData, ImageGlyphData } from 'src/store/legend'
import { hexToNormalizedRgb } from 'src/utils/webgl/SdfShaderRenderer'

import LetterList from './LetterList'
import { useSdfPreviewRenderer } from './useSdfPreviewRenderer'

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
  /** SDF size ratio used during layout calculation (1.0 = original size) */
  sizeRatio: number
}

// TODO: Consider extracting usePreviewData (data calculation logic) and
// usePreviewDraw (canvas drawing logic) hooks to reduce component size.
// Currently deferred due to tight coupling between canvas ref, multiple
// store subscriptions, and interdependent useEffect chains.
const PreviewCanvas: FunctionComponent = () => {
  const { bgPixel } = useTheme()

  // Use Legend State hooks
  const renderMode = useRenderMode()
  const distanceRange = useDistanceRange()
  const sdfChannel = useSdfChannel()
  const sdfRenderer = useSdfPreviewRenderer()
  const isSdfMode = renderMode !== 'default'

  // SDF preview settings
  const sdfPreviewColor = useSdfPreviewColor()
  const sdfPreviewFontSize = useSdfPreviewFontSize()
  const sdfPreviewLineHeight = useSdfPreviewLineHeight()

  // Convert hex color to normalized RGB for WebGL shader
  const sdfColorRgb = useMemo(
    () => hexToNormalizedRgb(sdfPreviewColor),
    [sdfPreviewColor],
  )

  const fontSize = useFontSize()
  const lineHeight = useFontLineHeight()

  // Effective font size / line height (SDF preview may override base values)
  const effectiveFontSize =
    isSdfMode && sdfPreviewFontSize != null ? sdfPreviewFontSize : fontSize
  const effectiveLineHeight =
    isSdfMode && sdfPreviewLineHeight != null
      ? sdfPreviewLineHeight
      : lineHeight
  const sizeRatio = effectiveFontSize / fontSize
  const { middle, hanging, top, alphabetic, ideographic, bottom } =
    useFontBaselines()
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
  const prevPackCanvasesRef = useRef<typeof packCanvases>(null)

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

    const lh = effectiveFontSize * effectiveLineHeight
    const fontHeight = (maxBaseLine - minBaseLine) * sizeRatio
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
        const scaledPadding = padding * sizeRatio
        const width = isUnEmpty
          ? glyph.width * sizeRatio + scaledPadding * 2
          : 0
        const height = isUnEmpty
          ? glyph.height * sizeRatio + scaledPadding * 2
          : 0
        const xoffset =
          (globalAdjustMetric.xOffset +
            glyph.adjustMetric.xOffset -
            (isUnEmpty ? glyph.trimOffsetLeft : 0) -
            (isUnEmpty ? padding : 0)) *
          sizeRatio
        const yoffset =
          (globalAdjustMetric.yOffset +
            glyph.adjustMetric.yOffset -
            (isUnEmpty ? glyph.trimOffsetTop : 0) -
            (isUnEmpty ? padding : 0)) *
          sizeRatio
        const xadvance =
          (Math.ceil(glyph.fontWidth) +
            globalAdjustMetric.xAdvance +
            glyph.adjustMetric.xAdvance) *
          sizeRatio

        const obj = {
          x: x + xoffset + (width === 0 ? 0 : scaledPadding),
          y: y + yoffset + (width === 0 ? 0 : scaledPadding),
          width: (width || xadvance) - (width === 0 ? 0 : scaledPadding * 2),
          height:
            (height || fontHeight) - (width === 0 ? 0 : scaledPadding * 2),
          letter,
          next,
          glyph,
        }

        x += xadvance

        const kerningValue = (glyph.kerning as Record<string, number>)[next]
        if (kerningValue) {
          x += kerningValue * sizeRatio
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
      sizeRatio,
    })
    // getGlyphForLetter is intentionally omitted from deps — it reads directly
    // from Legend State observables via .get() on each call, so it always returns
    // the latest data. Glyph reactivity is triggered by allGlyphs/imageGlyphs
    // subscriptions in the useEffect that calls initData below.
  }, [
    canvas,
    effectiveFontSize,
    effectiveLineHeight,
    maxBaseLine,
    minBaseLine,
    previewText,
    padding,
    sizeRatio,
    globalAdjustMetric.xOffset,
    globalAdjustMetric.yOffset,
    globalAdjustMetric.xAdvance,
  ])

  useWheel(domRef, (info) => {
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
  })

  // Draw canvas when data changes
  useEffect(() => {
    if (!canvas || isPacking || !data) {
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    const lh = effectiveFontSize * effectiveLineHeight
    const drawYOffset = Math.max((lh - effectiveFontSize) / 2, 0)
    const { sizeRatio: dataSizeRatio } = data

    // SDF mode: render at display resolution (zoom × DPR) for crisp AA.
    // Quantize to 0.5 steps to reduce canvas resize churn during wheel zoom.
    const dpr = window.devicePixelRatio || 1
    const renderScale = isSdfMode ? Math.ceil(previewScale * dpr * 2) / 2 : 1

    canvas.width = Math.max(Math.round(data.width * renderScale), 1)
    canvas.height = Math.max(Math.round(data.height * renderScale), 1)
    canvas.style.width = `${data.width}px`
    canvas.style.height = `${data.height}px`
    // Scale context so all draw calls use logical coordinates;
    // physical pixels = logical × renderScale → 1:1 at display resolution.
    ctx.setTransform(renderScale, 0, 0, renderScale, 0, 0)

    // Clear texture cache only when packCanvases reference actually changes,
    // avoiding expensive per-redraw texture re-upload
    if (
      isSdfMode &&
      sdfRenderer &&
      prevPackCanvasesRef.current !== packCanvases
    ) {
      sdfRenderer.clearTextureCache()
      prevPackCanvasesRef.current = packCanvases
    }

    // Pre-size the offscreen GL canvas for the largest glyph this frame
    if (isSdfMode && sdfRenderer) {
      let maxW = 0
      let maxH = 0
      for (const item of data.list) {
        if (
          item.glyph.type === 'text' &&
          item.glyph.width &&
          item.glyph.height
        ) {
          const w = item.glyph.width * dataSizeRatio * renderScale
          const h = item.glyph.height * dataSizeRatio * renderScale
          if (w > maxW) maxW = w
          if (h > maxH) maxH = h
        }
      }
      sdfRenderer.beginFrame(maxW, maxH)
    }

    data.list.forEach((item) => {
      // Use type field instead of instanceof check
      if (item.glyph.type === 'image') {
        const imageGlyph = item.glyph as ImageGlyphData
        if (
          imageGlyph.source &&
          imageGlyph.width > 0 &&
          imageGlyph.height > 0
        ) {
          ctx.drawImage(
            imageGlyph.source,
            0,
            0,
            imageGlyph.width,
            imageGlyph.height,
            item.x - data.xOffset,
            item.y - data.yOffset + drawYOffset,
            imageGlyph.width * dataSizeRatio,
            imageGlyph.height * dataSizeRatio,
          )
        }
      } else if (item.glyph.type === 'text') {
        // Unified coordinate processing: always use packed page coordinates
        const glyphPage = item.glyph.page || 0
        const sourceCanvas = packCanvases?.[glyphPage]

        if (sourceCanvas) {
          try {
            if (isSdfMode && sdfRenderer) {
              // WebGL SDF shader rendering for distance field preview
              sdfRenderer.renderGlyph(
                ctx,
                {
                  sourceCanvas,
                  sx: item.glyph.x + padding,
                  sy: item.glyph.y + padding,
                  sw: item.glyph.width,
                  sh: item.glyph.height,
                  dx: item.x - data.xOffset,
                  dy: item.y - data.yOffset + drawYOffset,
                  dw: item.glyph.width * dataSizeRatio,
                  dh: item.glyph.height * dataSizeRatio,
                },
                {
                  mode: renderMode,
                  distanceRange,
                  sdfChannel,
                  color: sdfColorRgb,
                  renderScale,
                },
              )
            } else {
              // Canvas 2D rendering for default mode
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
            }
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
          const baseY = Math.round(
            (baseLine - minBaseLine) * sizeRatio + index * lh,
          )
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
        index * lh -
          data.yOffset +
          (maxBaseLine - minBaseLine) * sizeRatio +
          drawYOffset,
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
    distanceRange,
    effectiveFontSize,
    effectiveLineHeight,
    hanging,
    ideographic,
    isPacking,
    isSdfMode,
    maxBaseLine,
    middle,
    minBaseLine,
    packCanvases,
    padding,
    previewScale,
    renderMode,
    sdfChannel,
    sdfColorRgb,
    sdfRenderer,
    sizeRatio,
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
            // SDF mode: smooth scaling (resolution-independent)
            // Default mode: pixelated (bitmap font preview)
            imageRendering: isSdfMode
              ? ('auto' as const)
              : ('pixelated' as const),
          },
        }}
      >
        <canvas ref={(node) => setCanvas(node)} />
        {data ? (
          <LetterList
            data={data}
            drawYOffset={Math.max(
              (effectiveFontSize * effectiveLineHeight - effectiveFontSize) / 2,
              0,
            )}
          />
        ) : null}
      </Box>
    </Box>
  )
}

export default PreviewCanvas
