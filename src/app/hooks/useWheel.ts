import { RefObject, useCallback, useEffect, useRef } from 'react'

interface DeltaInfo {
  deltaScale: number
  deltaX: number
  deltaY: number
}

interface WheelCallback {
  (deltaInfo: DeltaInfo): void
}

const WHEEL_SCALE_FACTOR = -0.01 // Sensitivity factor for wheel-to-zoom conversion
const TRACKPAD_THRESHOLD = 50 // deltaY values above this indicate a mouse wheel (not trackpad)
const TRACKPAD_DAMPING = 0.1 // Additional damping for mouse wheel to avoid excessive zoom

function useWheel(
  ref: RefObject<HTMLElement | null>,
  onWheel: WheelCallback,
): void {
  const callbackRef = useRef(onWheel)
  callbackRef.current = onWheel

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const { ctrlKey, altKey, deltaX, deltaY } = e
    if (ctrlKey) {
      let d = WHEEL_SCALE_FACTOR
      if (Math.abs(deltaY) > TRACKPAD_THRESHOLD) d *= TRACKPAD_DAMPING
      callbackRef.current({ deltaScale: deltaY * d, deltaX: 0, deltaY: 0 })
    } else {
      let x = -deltaX
      let y = -deltaY
      if (deltaX === 0 && altKey && Math.abs(deltaY) > TRACKPAD_THRESHOLD) {
        x = -deltaY
        y = 0
      }
      callbackRef.current({
        deltaX: x,
        deltaY: y,
        deltaScale: 0,
      })
    }
  }, [])

  useEffect(() => {
    if (!ref.current) return undefined

    const dom = ref.current

    dom.addEventListener('wheel', handleWheel, {
      passive: false,
    })

    return () => dom.removeEventListener('wheel', handleWheel)
  }, [ref, handleWheel])
}
export default useWheel
