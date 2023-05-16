import React, { useRef, useEffect, FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import { useTheme } from '@mui/material/styles'

import { useProject } from 'src/store/hooks'
import useWheel from 'src/app/hooks/useWheel'
import useSpaceDrag from 'src/app/hooks/useSpaceDrag'

import styles from './PackCanvas.module.scss'

const PackCanvas: FunctionComponent<unknown> = () => {
  const { bgPixel } = useTheme()

  const {
    isPacking,
    ui,
    layout: { padding, auto, fixedSize, width: packWidth, height: packHeight },
    glyphList,
    style: { bgColor },
    packCanvas,
    setCanvas,
  } = useProject()
  const { width, height, scale, offsetX, offsetY } = ui
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const domRef = useRef<HTMLDivElement>(null)
  const [dragState, handleMouseDown] = useSpaceDrag(
    (offsetInfo) => {
      const { offsetX: ix, offsetY: iy } = offsetInfo
      const { scale: os, offsetX: ox, offsetY: oy, setTransform } = ui
      setTransform({
        offsetX: ox + ix / os,
        offsetY: oy + iy / os,
      })
    },
    [ui],
  )

  useWheel(
    domRef,
    (info) => {
      const { offsetX: ox, offsetY: oy, scale: os, setTransform } = ui
      const s = os + info.deltaScale
      const x = ox + info.deltaX / s
      const y = oy + info.deltaY / s
      setTransform({
        offsetX: x,
        offsetY: y,
        scale: s,
      })
    },
    [ui],
  )

  useEffect(() => {
    if (canvasRef.current && canvasRef.current !== packCanvas)
      setCanvas(canvasRef.current)
  }, [canvasRef, packCanvas, setCanvas])

  useEffect(() => {
    if (!glyphList || isPacking || !width || !height) return
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (bgColor) {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    glyphList.forEach((glyph) => {
      if (
        glyph.source &&
        glyph.source.width !== 0 &&
        glyph.source.height !== 0
      ) {
        ctx.drawImage(
          glyph.source as HTMLCanvasElement,
          glyph.x + (padding || 0),
          glyph.y + (padding || 0),
        )
      }
    })
  }, [
    bgColor,
    glyphList,
    isPacking,
    height,
    width,
    padding,
    auto,
    fixedSize,
    packWidth,
    packHeight,
  ])

  return (
    <div
      aria-hidden
      ref={domRef}
      className={styles.root}
      style={{
        cursor:
          dragState === 2 ? 'grabbing' : dragState === 1 ? 'grab' : 'default',
      }}
      onMouseDown={handleMouseDown}
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{
          ...bgPixel,
          width: `${width}px`,
          height: `${height}px`,
          marginLeft: `${width / -2}px`,
          marginTop: `${height / -2}px`,
          transform: `scale(${scale}) translate(${offsetX}px,${offsetY}px)`,
        }}
      />
    </div>
  )
}

export default observer(PackCanvas)
