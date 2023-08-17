import { useRef, useState, useEffect, FunctionComponent, useMemo } from 'react'
import { observer } from 'mobx-react'
import { useTheme } from '@mui/material/styles'

import { useProject } from 'src/store/hooks'
import useWheel from 'src/app/hooks/useWheel'
import useSpaceDrag from 'src/app/hooks/useSpaceDrag'
import { BMFontChar, toBmfInfo } from 'src/file/export'

import getPreviewCanvas from './getPreviewCanvas'
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
  const data = useMemo(() => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { chars, kernings } = toBmfInfo(project)
    const kerningMap: Map<number, Map<number, number>> = new Map()
    kernings.list.forEach(({ first, second, amount }) => {
      if (!kerningMap.has(first)) kerningMap.set(first, new Map())
      const k = kerningMap.get(first)
      k?.set(second, amount)
    })
    const charMap: Map<string, BMFontChar> = new Map()
    chars.list.forEach((char) => {
      charMap.set(char.letter, char)
    })
    // TODO: LINEHEIGHT
    const lh = size * lineHeight
    return getPreviewCanvas(
      ui.previewText,
      charMap,
      kerningMap,
      lh,
      maxBaseLine - minBaseLine,
      padding,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isPacking,
    canvas,
    lineHeight,
    maxBaseLine,
    minBaseLine,
    padding,
    project,
    project.globalAdjustMetric.xAdvance,
    project.globalAdjustMetric.yOffset,
    project.globalAdjustMetric.xOffset,
    size,
    ui.previewText,
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
    // TODO: LINEHEIGHT
    const lh = size * lineHeight
    const drawYOffset = Math.max((lh - size) / 2, 0)

    canvas.width = data.width
    canvas.height = data.height
    data.list.forEach((item) => {
      if (!item.source || item.source.width === 0 || item.source.height === 0)
        return
      ctx.drawImage(
        item.source,
        item.x - data.xOffset,
        item.y - data.yOffset + drawYOffset,
      )
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
    size,
    top,
  ])

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
