import React, { useRef, useEffect, FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import { useProject } from 'src/store/hooks'
import useWheel from 'src/app/hooks/useWheel'
import useSpaceDrag from 'src/app/hooks/useSpaceDrag'

interface StyleProps {
  width: number
  height: number
  scale: number
  offsetX: number
  offsetY: number
  dragState: number
}

const useStyles = makeStyles(({ bgPixel }) =>
  createStyles({
    root: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      flex: 1,
      cursor: (props: StyleProps) => {
        if (props.dragState === 2) return 'grabbing'
        if (props.dragState === 1) return 'grab'
        return 'default'
      },
    },
    canvas: {
      ...bgPixel,
      transformOrigin: '50% 50%',
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: (props: StyleProps) => `${props.width}px`,
      height: (props: StyleProps) => `${props.height}px`,
      marginLeft: (props: StyleProps) => `${props.width / -2}px`,
      marginTop: (props: StyleProps) => `${props.height / -2}px`,
      transform: (props: StyleProps) =>
        `scale(${props.scale}) translate(${props.offsetX}px,${props.offsetY}px)`,
      imageRendering: 'pixelated',
    },
  }),
)

const PackCanvas: FunctionComponent<unknown> = () => {
  const {
    isPacking,
    ui,
    layout: { padding },
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

  const classes = useStyles({
    width,
    height,
    scale,
    offsetX,
    offsetY,
    dragState,
  })

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
  }, [bgColor, glyphList, isPacking, height, width, padding])

  return (
    <div
      aria-hidden
      ref={domRef}
      className={classes.root}
      onMouseDown={handleMouseDown}
    >
      <canvas ref={canvasRef} className={classes.canvas} />
    </div>
  )
}

export default observer(PackCanvas)
