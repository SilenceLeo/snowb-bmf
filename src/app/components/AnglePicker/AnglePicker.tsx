import Box from '@mui/material/Box'
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

export interface AnglePickerProps {
  width?: number
  angle: number
  onChange(angle: number): void
}

const AnglePicker: FunctionComponent<AnglePickerProps> = (
  props: AnglePickerProps,
) => {
  const { onChange } = props
  const rootRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent) => {
      if (!rootRef.current) return

      const { clientX, clientY } = e
      const bounds = rootRef.current.getBoundingClientRect()
      const radians = Math.atan2(
        clientY - (bounds.y + bounds.height / 2),
        clientX - (bounds.x + bounds.width / 2),
      )
      onChange(Math.round(radians * (180 / Math.PI)))
    },
    [onChange],
  )

  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!rootRef.current) return
    setIsDragging(true)
    handleMouseMove(e)
  }

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
    <Box
      aria-hidden
      sx={{
        width: props.width ? `${props.width}px` : '36px',
        height: props.width ? `${props.width}px` : '36px',
        position: 'relative',
        cursor: 'crosshair',
        overflow: 'hidden',
        borderRadius: '100%',
        background: '#fff',
      }}
      ref={rootRef}
      onMouseDown={handleMouseDown}
    >
      <Box
        sx={{
          width: '6px',
          height: '6px',
          borderRadius: '100%',
          position: 'relative',
          left: '50%',
          top: '50%',
          marginTop: '-2px',
          background: '#000',
          pointerEvents: 'none',
          transformOrigin: '0 50%',
          transform: `rotate(${props.angle || 0}deg) translate(${
            (props.width || 36) / 2 - 8
          }px, 0)`,
        }}
      />
    </Box>
  )
}

export default AnglePicker
