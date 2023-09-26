import { useTheme } from '@mui/material/styles'
import { observer } from 'mobx-react-lite'
import { IChange, deepObserve } from 'mobx-utils'
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import useSpaceDrag from 'src/app/hooks/useSpaceDrag'
import useWheel from 'src/app/hooks/useWheel'
import { GlyphFont, GlyphImage } from 'src/store/base'
import { useProject } from 'src/store/hooks'

import LetterList from './LetterList'
import styles from './PreviewCanvas.module.scss'

const PreviewCanvas: FunctionComponent<unknown> = () => {
  const { bgPixel } = useTheme()
  const project = useProject()
  const {
    ui,
    style: {
      font: {
        size,
        lineHeight,
        middle,
        hanging,
        top,
        alphabetic,
        ideographic,
        bottom,
        minBaseLine,
        maxBaseLine,
      },
    },
    layout: { padding },
    isPacking,
    globalAdjustMetric,
    packCanvas,
  } = project
  const { previewScale, previewOffsetX, previewOffsetY } = ui
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const domRef = useRef<HTMLDivElement>(null)
  const [dragState, handleMouseDown] = useSpaceDrag(
    (offsetInfo) => {
      const { offsetX: ix, offsetY: iy } = offsetInfo
      const {
        previewScale: os,
        previewOffsetX: ox,
        previewOffsetY: oy,
        setPreviewTransform,
      } = ui
      setPreviewTransform({
        previewOffsetX: ox + ix / os,
        previewOffsetY: oy + iy / os,
      })
    },
    [ui],
  )
  const [data, setData] = useState<{
    lines: number
    list: {
      x: number
      y: number
      width: number
      height: number
      letter: string
      next: string
      glyph: GlyphImage | GlyphFont
    }[]
    xOffset: number
    yOffset: number
    width: number
    height: number
  } | null>(null)

  const initData = useCallback(() => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const lh = size * lineHeight
    const fontHeight = maxBaseLine - minBaseLine
    const list: {
      x: number
      y: number
      width: number
      height: number
      letter: string
      next: string
      glyph: GlyphImage | GlyphFont
    }[] = []
    const lines = ui.previewText.split(/\r\n|\r|\n/)
    let minX = 0
    let minY = 0
    let maxX = 0
    let maxY = 0
    lines.forEach((str, index) => {
      let y = lh * index
      let x = 0
      const arr = Array.from(str)
      arr.forEach((letter, idx) => {
        const glyph = project.getGlyph(letter)
        if (!glyph) return
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

        if (glyph.kerning.get(next)) {
          x += glyph.kerning.get(next) as number
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
  }, [
    canvas,
    size,
    lineHeight,
    maxBaseLine,
    minBaseLine,
    ui.previewText,
    project,
    padding,
    globalAdjustMetric.xOffset,
    globalAdjustMetric.yOffset,
    globalAdjustMetric.xAdvance,
  ])

  useWheel(
    domRef,
    (info) => {
      const {
        previewOffsetX: ox,
        previewOffsetY: oy,
        previewScale: os,
        setPreviewTransform,
      } = ui
      const s = os + info.deltaScale
      const x = ox + info.deltaX / s
      const y = oy + info.deltaY / s
      setPreviewTransform({
        previewOffsetX: x,
        previewOffsetY: y,
        previewScale: s,
      })
    },
    [ui],
  )

  useEffect(() => {
    if (!canvas || isPacking || !data) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const lh = size * lineHeight
    const drawYOffset = Math.max((lh - size) / 2, 0)

    canvas.width = data.width
    canvas.height = data.height
    data.list.forEach((item) => {
      if (item.glyph instanceof GlyphImage && item.glyph.source) {
        ctx.drawImage(
          item.glyph.source,
          item.x - data.xOffset,
          item.y - data.yOffset + drawYOffset,
        )
      } else if (item.glyph instanceof GlyphFont && packCanvas) {
        ctx.drawImage(
          packCanvas,
          item.glyph.canvasX,
          item.glyph.canvasY,
          item.glyph.width,
          item.glyph.height,
          item.x - data.xOffset,
          item.y - data.yOffset + drawYOffset,
          item.glyph.width,
          item.glyph.height,
        )
      }
    })

    for (let index = 0; index < data.lines; index += 1) {
      ;[middle, hanging, top, alphabetic, ideographic, bottom].forEach(
        (baseLine) => {
          const basey = Math.round(baseLine - minBaseLine + index * lh)
          ctx.beginPath()
          ctx.moveTo(-data.xOffset, basey + 0.5 - data.yOffset + drawYOffset)
          ctx.lineTo(data.width, basey + 0.5 - data.yOffset + drawYOffset)
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
    packCanvas,
    size,
    top,
  ])

  useEffect(() => {
    initData()
    const observer = (change: IChange) => initData()
    const glyphsDisposer = deepObserve(project.glyphs, observer)
    const imagesDisposer = deepObserve(project.glyphImages, observer)
    return () => {
      glyphsDisposer()
      imagesDisposer()
    }
  }, [initData, project.glyphImages, project.glyphs])

  return (
    <div
      aria-hidden
      ref={domRef}
      className={styles.root}
      style={{
        ...bgPixel,
        cursor:
          dragState === 2 ? 'grabbing' : dragState === 1 ? 'grab' : 'default',
      }}
      onMouseDown={handleMouseDown}
      onClick={() => ui.setSelectLetter('', '')}
    >
      <div
        className={styles.wrap}
        style={{
          width: `${data ? data.width : 0}px`,
          height: `${data ? data.height : 0}px`,
          marginLeft: `${(data ? data.width : 0) / -2}px`,
          marginTop: `${(data ? data.height : 0) / -2}px`,
          transform: `scale(${previewScale}) translate(${previewOffsetX}px,${previewOffsetY}px)`,
        }}
      >
        <canvas ref={(node) => setCanvas(node)} className={styles.canvas} />
        {data ? (
          <LetterList
            data={data}
            drawYOffset={Math.max((size * lineHeight - size) / 2, 0)}
          />
        ) : null}
      </div>
    </div>
  )
}

export default observer(PreviewCanvas)
