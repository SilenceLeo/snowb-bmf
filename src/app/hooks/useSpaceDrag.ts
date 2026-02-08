import {
  DependencyList,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

interface OffsetInfo {
  offsetX: number
  offsetY: number
}

interface WheelCallback {
  (offsetInfo: OffsetInfo): void
}

function useSpaceDrag<T extends HTMLElement>(
  onMove: WheelCallback,
  deps: DependencyList = [],
): [0 | 1 | 2, (e: React.MouseEvent<T, MouseEvent>) => void] {
  const pointRef = useRef({ x: 0, y: 0 })

  const [moveState, setMoveState] = useState({
    ks: false,
    ms: false,
  })

  const dragStatus = useMemo(() => {
    if (moveState.ks && moveState.ms) return 2
    if (moveState.ks) return 1
    return 0
  }, [moveState.ks, moveState.ms])

  const moveCallback = useCallback(onMove, [onMove, ...deps])

  const handleKeyEvent = useCallback(
    (e: KeyboardEvent) => {
      const isSpaceDown = e.code === 'Space' && e.type === 'keydown'
      if (moveState.ks === isSpaceDown) return
      setMoveState((s) => ({ ...s, ks: isSpaceDown }))
    },
    [moveState.ks],
  )

  const handleMouseDown = (e: React.MouseEvent<T, MouseEvent>) => {
    if (!moveState.ks) return
    const { clientX, clientY } = e
    pointRef.current.x = clientX
    pointRef.current.y = clientY
    setMoveState((s) => ({ ...s, ms: true }))
  }

  const handleMove = useCallback(
    (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { x, y } = pointRef.current

      if (clientX - x === 0 && clientY - y === 0) return

      moveCallback({
        offsetX: clientX - x,
        offsetY: clientY - y,
      })

      pointRef.current.x = clientX
      pointRef.current.y = clientY
    },
    [moveCallback],
  )

  const handleEnd = useCallback(() => {
    setMoveState((s) => ({ ...s, ms: false }))
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyEvent)
    window.addEventListener('keyup', handleKeyEvent)

    return () => {
      window.removeEventListener('keydown', handleKeyEvent)
      window.removeEventListener('keyup', handleKeyEvent)
    }
  }, [handleKeyEvent])

  useEffect(() => {
    if (moveState.ks && moveState.ms) {
      window.addEventListener('mousemove', handleMove)
      window.addEventListener('mouseup', handleEnd)
    } else {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleEnd)
    }

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleEnd)
    }
  }, [handleEnd, handleMove, moveState.ks, moveState.ms])

  return [dragStatus, handleMouseDown]
}
export default useSpaceDrag
