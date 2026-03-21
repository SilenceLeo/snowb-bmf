import { useCallback, useEffect, useRef, useState } from 'react'

interface OffsetInfo {
  offsetX: number
  offsetY: number
}

interface WheelCallback {
  (offsetInfo: OffsetInfo): void
}

function useSpaceDrag<T extends HTMLElement>(
  onMove: WheelCallback,
): [0 | 1 | 2, (e: React.MouseEvent<T, MouseEvent>) => void] {
  const pointRef = useRef({ x: 0, y: 0 })
  const callbackRef = useRef(onMove)
  callbackRef.current = onMove

  const [moveState, setMoveState] = useState({
    isSpaceDown: false,
    isMouseDown: false,
  })

  const dragStatus: 0 | 1 | 2 =
    moveState.isSpaceDown && moveState.isMouseDown
      ? 2
      : moveState.isSpaceDown
        ? 1
        : 0

  const handleKeyEvent = useCallback((e: KeyboardEvent) => {
    // Only respond to Space key events; ignore all other keys
    if (e.code !== 'Space') return
    const spaceDown = e.type === 'keydown'
    // De-duplicate check inside updater to avoid depending on external state
    setMoveState((s) =>
      s.isSpaceDown === spaceDown ? s : { ...s, isSpaceDown: spaceDown },
    )
  }, [])

  // Not wrapped in useCallback: only used as a direct event handler in the returned tuple,
  // not passed as a dependency to other hooks
  const handleMouseDown = (e: React.MouseEvent<T, MouseEvent>) => {
    if (!moveState.isSpaceDown) return
    const { clientX, clientY } = e
    pointRef.current.x = clientX
    pointRef.current.y = clientY
    setMoveState((s) => ({ ...s, isMouseDown: true }))
  }

  const handleMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e
    const { x, y } = pointRef.current

    if (clientX - x === 0 && clientY - y === 0) return

    callbackRef.current({
      offsetX: clientX - x,
      offsetY: clientY - y,
    })

    pointRef.current.x = clientX
    pointRef.current.y = clientY
  }, [])

  const handleEnd = useCallback(() => {
    setMoveState((s) => ({ ...s, isMouseDown: false }))
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
    if (moveState.isSpaceDown && moveState.isMouseDown) {
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
  }, [handleEnd, handleMove, moveState.isSpaceDown, moveState.isMouseDown])

  return [dragStatus, handleMouseDown]
}
export default useSpaceDrag
