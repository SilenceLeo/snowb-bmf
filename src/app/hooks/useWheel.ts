import { DependencyList, RefObject, useCallback, useEffect } from 'react'

interface DeltaInfo {
  deltaScale: number
  deltaX: number
  deltaY: number
}

interface WheelCallback {
  (deltaInfo: DeltaInfo): void
}

function useWheel(
  ref: RefObject<HTMLElement | null>,
  onWheel: WheelCallback,
  deps: DependencyList = [],
): void {
  const callback = useCallback(onWheel, [onWheel, deps])
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const { ctrlKey, altKey, deltaX, deltaY } = e
      if (ctrlKey) {
        let d = -0.01
        if (Math.abs(deltaY) > 50) d *= 0.1
        callback({ deltaScale: deltaY * d, deltaX: 0, deltaY: 0 })
      } else {
        let x = -deltaX
        let y = -deltaY
        if (deltaX === 0 && altKey && Math.abs(deltaY) > 50) {
          x = -deltaY
          y = 0
        }
        callback({
          deltaX: x,
          deltaY: y,
          deltaScale: 0,
        })
      }
    },
    [callback],
  )

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
