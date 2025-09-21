import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { observer } from 'mobx-react-lite'
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import useSpaceDrag from 'src/app/hooks/useSpaceDrag'
import useWheel from 'src/app/hooks/useWheel'
import { useProject } from 'src/store/hooks'

const PackCanvas: FunctionComponent<unknown> = () => {
  const { bgPixel } = useTheme()

  const {
    isPacking,
    ui,
    layout: { packWidth, packHeight, page: pageCount },
    style: { bgColor },
    packCanvases,
  } = useProject()
  const { width: gridWidth, height: gridHeight, scale, offsetX, offsetY } = ui
  const canvasRefs = useRef<HTMLCanvasElement[]>([])
  const domRef = useRef<HTMLDivElement>(null)
  const [refsReady, setRefsReady] = useState(false)

  // Check if all required canvas refs are available
  const checkRefsReady = useCallback(() => {
    const ready = canvasRefs.current
      .slice(0, pageCount)
      .every((ref) => ref != null)
    setRefsReady(ready)
    return ready
  }, [pageCount])

  // Pre-allocate canvas refs array when pageCount changes
  useEffect(() => {
    // Resize the refs array to match pageCount
    if (canvasRefs.current.length !== pageCount) {
      const newRefs = new Array(pageCount)
      // Copy existing refs that are still valid
      for (let i = 0; i < Math.min(canvasRefs.current.length, pageCount); i++) {
        newRefs[i] = canvasRefs.current[i]
      }
      canvasRefs.current = newRefs
    }

    // Reset refs ready state when pageCount changes
    setRefsReady(false)
    // Check if refs are immediately ready (in case DOM elements already exist)
    setTimeout(() => checkRefsReady(), 0)
  }, [pageCount, checkRefsReady])

  // Calculate grid layout for canvas positioning
  const cols = Math.ceil(Math.sqrt(pageCount))
  const spacing = 20

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
      const s = Math.max(0.1, Math.min(10, os + info.deltaScale))
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
    if (isPacking || !packWidth || !packHeight) {
      return
    }

    // Check if all canvas refs are available before drawing
    if (!refsReady) {
      return
    }

    // Unified rendering logic: directly copy corresponding page from packCanvases
    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
      const canvas = canvasRefs.current[pageIndex]
      if (!canvas) {
        continue
      }

      canvas.width = packWidth
      canvas.height = packHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        continue
      }

      // Set background color
      if (bgColor) {
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      // Unified processing: directly copy corresponding page canvas content
      if (packCanvases[pageIndex]) {
        ctx.drawImage(packCanvases[pageIndex], 0, 0)
      }
    }
  }, [
    packCanvases,
    bgColor,
    isPacking,
    packWidth,
    packHeight,
    pageCount,
    refsReady,
  ])

  return (
    <Box
      aria-hidden
      ref={domRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        flex: 1,
      }}
      style={{
        cursor:
          dragState === 2 ? 'grabbing' : dragState === 1 ? 'grab' : 'default',
      }}
      onMouseDown={handleMouseDown}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${gridWidth}px`,
          height: `${gridHeight}px`,
          marginLeft: `${gridWidth / -2}px`,
          marginTop: `${gridHeight / -2}px`,
          transformOrigin: '50% 50%',
        }}
        style={{
          transform: `scale(${scale}) translate(${offsetX}px,${offsetY}px)`,
        }}
      >
        {Array.from({ length: pageCount }).map((_, pageIndex) => {
          const col = pageIndex % cols
          const row = Math.floor(pageIndex / cols)
          const canvasX = col * (packWidth + spacing)
          const canvasY = row * (packHeight + spacing)

          return (
            <Box
              component='canvas'
              key={pageIndex}
              ref={(el) => {
                if (el) {
                  canvasRefs.current[pageIndex] = el as HTMLCanvasElement
                  // Check if all refs are now ready
                  checkRefsReady()
                }
              }}
              sx={{
                imageRendering: 'pixelated',
                ...bgPixel,
                position: 'absolute',
                left: `${canvasX}px`,
                top: `${canvasY}px`,
                width: `${packWidth}px`,
                height: `${packHeight}px`,
              }}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default observer(PackCanvas)
