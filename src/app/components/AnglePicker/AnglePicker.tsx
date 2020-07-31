import React, {
  useState,
  useRef,
  useEffect,
  FunctionComponent,
  useCallback,
} from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'

export interface AnglePickerProps {
  width?: number
  angle: number
  onChange(angle: number): void
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: (props: AnglePickerProps) =>
        props.width ? `${props.width}px` : '36px',
      height: (props) => (props.width ? `${props.width}px` : '36px'),
      position: 'relative',
      cursor: 'crosshair',
      overflow: 'hidden',
      borderRadius: '100%',
      background: '#FFF',
    },
    point: {
      width: '6px',
      height: '6px',
      borderRadius: '100%',
      position: 'relative',
      left: '50%',
      top: '50%',
      marginTop: '-2px',
      background: '#000',
      pointerEvents: 'none',
      transformOrigin: `0 50%`,
      transform: (props) =>
        `rotate(${props.angle || 0}deg) translate(${
          (props.width || 36) / 2 - 8
        }px, 0)`,
    },
  }),
)

const AnglePicker: FunctionComponent<AnglePickerProps> = (
  props: AnglePickerProps,
) => {
  const { onChange } = props
  const rootRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const classes = useStyles(props)

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
    <div
      aria-hidden
      className={classes.root}
      ref={rootRef}
      onMouseDown={handleMouseDown}
    >
      <div className={classes.point} />
    </div>
  )
}

export default AnglePicker
