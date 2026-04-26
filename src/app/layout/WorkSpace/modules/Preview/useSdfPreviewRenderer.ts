/**
 * React hook to manage the lifecycle of SdfShaderRenderer.
 *
 * Uses lazy useState init to create exactly one renderer instance per mount,
 * avoiding double-creation under React StrictMode (which would waste limited
 * WebGL contexts). Returns null if WebGL is not available.
 */
import { useEffect, useRef, useState } from 'react'
import { SdfShaderRenderer } from 'src/utils/webgl/SdfShaderRenderer'

export function useSdfPreviewRenderer(): SdfShaderRenderer | null {
  const [renderer] = useState<SdfShaderRenderer | null>(() => {
    const instance = new SdfShaderRenderer()
    return instance.isAvailable() ? instance : null
  })

  const rendererRef = useRef(renderer)
  rendererRef.current = renderer

  useEffect(() => {
    return () => {
      rendererRef.current?.dispose()
    }
  }, [])

  return renderer
}
