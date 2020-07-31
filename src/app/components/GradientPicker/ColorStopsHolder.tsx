import React, {
  FunctionComponent,
  useCallback,
  useRef,
  MutableRefObject,
  useState,
  useEffect,
} from 'react'
import clsx from 'clsx'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import ColorStop from './ColorStop'

export interface AddPaletteItem {
  offset: number
  color: string
}

export interface PaletteItem extends AddPaletteItem {
  id: number
  offset: number
  color: string
}

interface ColorStopsHolderProps {
  className?: string
  palette: PaletteItem[]
  activeId?: number
  onAdd(offset: number): void
  onUpdate(paletteItem: Partial<AddPaletteItem>, isDelete?: boolean): void
  onSelect(id?: number): void
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      height: '17px',
      position: 'relative',
      cursor: 'crosshair',
    },
  }),
)

const ColorStopsHolder: FunctionComponent<ColorStopsHolderProps> = (
  props: ColorStopsHolderProps,
) => {
  const { className, palette, activeId, onAdd, onUpdate, onSelect } = props
  const classes = useStyles(props)
  const [width, setWidth] = useState(0)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0, offset: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const rootRef: MutableRefObject<HTMLDivElement | null> = useRef(null)

  useEffect(() => {
    if (rootRef.current) {
      setWidth(rootRef.current.clientWidth)
    }
  }, [rootRef])

  const handleAddPalette = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const target = rootRef.current
    if (!target || e.buttons !== 1) return
    const { left } = target.getBoundingClientRect()
    const offset = (e.clientX - left) / width
    onAdd(offset)
    setIsDragging(true)
    setStartPoint({ x: e.clientX, y: e.clientY, offset })
  }

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    paletteItem: PaletteItem,
  ) => {
    if (e.buttons !== 1) return
    e.preventDefault()
    e.stopPropagation()
    setStartPoint({ x: e.clientX, y: e.clientY, offset: paletteItem.offset })
    setIsDragging(true)
    onSelect(paletteItem.id)
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !activeId) return
      if (e.buttons !== 1) {
        setIsDragging(false)
        return
      }
      const idx = palette.findIndex(
        (paletteItem) => paletteItem.id === activeId,
      )

      if (idx < 0) return
      const newPalette = [...palette]

      if (Math.abs(e.clientY - startPoint.y) > 50) {
        onUpdate(newPalette[idx], true)
        return
      }

      const paletteItem = newPalette[idx]
      const offset = Math.min(
        Math.max((e.clientX - startPoint.x) / width + startPoint.offset, 0),
        1,
      )
      newPalette[idx] = { ...paletteItem, offset }
      onUpdate({ offset })
    },
    [
      activeId,
      isDragging,
      onUpdate,
      palette,
      startPoint.offset,
      startPoint.x,
      startPoint.y,
      width,
    ],
  )

  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp, isDragging])

  return (
    <div
      aria-hidden
      ref={rootRef}
      className={clsx(classes.root, className)}
      onMouseDown={handleAddPalette}
    >
      {palette.map((paletteItem) => (
        <ColorStop
          key={paletteItem.id}
          left={width * paletteItem.offset}
          color={paletteItem.color}
          isActive={paletteItem.id === activeId}
          onMouseDown={(e) => handleMouseDown(e, paletteItem)}
        />
      ))}
    </div>
  )
}

export default ColorStopsHolder
