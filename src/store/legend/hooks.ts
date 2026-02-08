import { useSelector } from '@legendapp/state/react'
import { useRef } from 'react'

import { glyphStore$ } from './glyphStore'
import { projectStore$ } from './projectStore'
import { type LayoutData, layoutStore$ } from './stores/layoutStore'
import {
  type FillData,
  FillType,
  type FontData,
  type FontResource,
  type GradientData,
  type MetricData,
  type PatternTextureData,
  type ShadowData,
  type StrokeData,
  type StyleData,
  styleStore$,
} from './stores/styleStore'
import { type UiData, uiStore$ } from './stores/uiStore'
import {
  type ProjectMeta,
  type WorkspaceData,
  workspaceStore$,
} from './stores/workspaceStore'
import type { FontGlyphData, ImageGlyphData } from './types'

/**
 * useSelector wrapper that uses shallow equality for object results.
 * Prevents unnecessary re-renders when selector returns new object literals
 * with identical primitive values.
 *
 * IMPORTANT: This hook is only suitable for flat objects whose values are
 * primitive types (string, number, boolean, null, undefined). It performs
 * a shallow comparison using strict equality (===) on each key, so nested
 * objects or arrays will always be treated as changed.
 */
function useSelectorShallow<T extends Record<string, unknown>>(
  selector: () => T,
): T {
  const prevRef = useRef<T | undefined>(undefined)
  const result = useSelector(selector)

  if (prevRef.current !== undefined) {
    const prev = prevRef.current
    const keys = Object.keys(result)
    if (
      keys.length === Object.keys(prev).length &&
      keys.every((key) => result[key] === prev[key])
    ) {
      return prev
    }
  }

  prevRef.current = result
  return result
}

/**
 * Shallow comparison helper for arrays of objects.
 * Returns the previous array reference if all elements are identical by reference.
 */
function useArrayShallow<T>(
  current: T[],
  prevRef: React.RefObject<T[] | undefined>,
): T[] {
  const prev = prevRef.current
  if (
    prev !== undefined &&
    prev.length === current.length &&
    prev.every((item, i) => item === current[i])
  ) {
    return prev
  }
  prevRef.current = current
  return current
}

// Glyph Hooks

export function useGlyph(letter: string): FontGlyphData | undefined {
  return useSelector(() => glyphStore$.glyphs[letter].get())
}

export function useGlyphPosition(letter: string): {
  x: number
  y: number
  page: number
} {
  return useSelectorShallow(() => {
    const glyph = glyphStore$.glyphs[letter].get()
    if (!glyph) {
      return { x: 0, y: 0, page: -1 }
    }
    return {
      x: glyph.x,
      y: glyph.y,
      page: glyph.page,
    }
  })
}

export function useGlyphDimensions(letter: string): {
  width: number
  height: number
  fontWidth: number
  fontHeight: number
} {
  return useSelectorShallow(() => {
    const glyph = glyphStore$.glyphs[letter].get()
    if (!glyph) {
      return { width: 0, height: 0, fontWidth: 0, fontHeight: 0 }
    }
    return {
      width: glyph.width,
      height: glyph.height,
      fontWidth: glyph.fontWidth,
      fontHeight: glyph.fontHeight,
    }
  })
}

export function useGlyphLetters(): string[] {
  return useSelector(() => Object.keys(glyphStore$.glyphs.get()))
}

export function useGlyphCount(): number {
  return useSelector(() => Object.keys(glyphStore$.glyphs.get()).length)
}

export function useAllGlyphs(): Record<string, FontGlyphData> {
  return useSelector(() => glyphStore$.glyphs.get())
}

// Image Glyph Hooks

export function useImageGlyphs(): ImageGlyphData[] {
  return useSelector(() => glyphStore$.imageGlyphs.get())
}

export function useImageGlyphCount(): number {
  return useSelector(() => glyphStore$.imageGlyphs.get().length)
}

export function useImageGlyph(index: number): ImageGlyphData | undefined {
  return useSelector(() => glyphStore$.imageGlyphs[index].get())
}

// Packing State Hooks

export function useIsPacking(): boolean {
  return useSelector(() => glyphStore$.packing.isPacking.get())
}

export function useIsRenderingGlyphs(): boolean {
  return useSelector(() => glyphStore$.packing.isRenderingGlyphs.get())
}

export function usePackCanvases(): HTMLCanvasElement[] {
  return useSelector(() => glyphStore$.packing.packCanvases.get())
}

export function useSourceCanvas(): HTMLCanvasElement | null {
  return useSelector(() => glyphStore$.packing.sourceCanvas.get())
}

// Project State Hooks

export function useCurrentProject(): {
  id: number
  name: string
  text: string
} {
  return useSelector(() => projectStore$.current.get())
}

export function useProjectName(): string {
  return useSelector(() => projectStore$.current.name.get())
}

export function useProjectText(): string {
  return useSelector(() => projectStore$.current.text.get())
}

export function useIsInitializing(): boolean {
  return useSelector(() => projectStore$.initialization.isInitializing.get())
}

// Combined Hooks

export function useLoadingStates(): {
  isPacking: boolean
  isRenderingGlyphs: boolean
  isInitializing: boolean
} {
  return useSelectorShallow(() => ({
    isPacking: glyphStore$.packing.isPacking.get(),
    isRenderingGlyphs: glyphStore$.packing.isRenderingGlyphs.get(),
    isInitializing: projectStore$.initialization.isInitializing.get(),
  }))
}

export function useGlyphForLetter(
  letter: string,
): FontGlyphData | ImageGlyphData | undefined {
  return useSelector(() => {
    const imageGlyph = glyphStore$.imageGlyphs
      .get()
      .find((img) => img.letter === letter && img.selected)
    if (imageGlyph) {
      return imageGlyph
    }
    return glyphStore$.glyphs[letter].get()
  })
}

/**
 * Uses shallow array comparison to avoid unnecessary re-renders when the
 * underlying glyph references have not changed.
 */
export function useGlyphsForPage(
  pageIndex: number,
): Array<FontGlyphData | ImageGlyphData> {
  const prevRef = useRef<Array<FontGlyphData | ImageGlyphData> | undefined>(
    undefined,
  )

  const result = useSelector(() => {
    const items: Array<FontGlyphData | ImageGlyphData> = []

    const glyphs = glyphStore$.glyphs.get()
    Object.values(glyphs).forEach((glyph) => {
      if (glyph.page === pageIndex) {
        items.push(glyph)
      }
    })

    glyphStore$.imageGlyphs.get().forEach((img) => {
      if (img.page === pageIndex && img.selected) {
        items.push(img)
      }
    })

    return items
  })

  return useArrayShallow(result, prevRef)
}

// Style Hooks

export function useStyle(): StyleData {
  return useSelector(() => styleStore$.style.get())
}

export function useFont(): FontData {
  return useSelector(() => styleStore$.style.font.get())
}

export function useFontSize(): number {
  return useSelector(() => styleStore$.style.font.size.get())
}

export function useFontLineHeight(): number {
  return useSelector(() => styleStore$.style.font.lineHeight.get())
}

export function useFontSharp(): number {
  return useSelector(() => styleStore$.style.font.sharp.get())
}

export function useFontResources(): FontResource[] {
  return useSelector(() => styleStore$.style.font.fonts.get())
}

export function useMainFontFamily(): string {
  return useSelector(() => {
    const fonts = styleStore$.style.font.fonts.get()
    if (fonts.length > 0 && fonts[0].family) {
      return fonts[0].family
    }
    return 'sans-serif'
  })
}

export function useFill(): FillData {
  return useSelector(() => styleStore$.style.fill.get())
}

export function useFillColor(): string {
  return useSelector(() => styleStore$.style.fill.color.get())
}

export function useFillType(): FillType {
  return useSelector(() => styleStore$.style.fill.type.get())
}

export function useGradient(): GradientData {
  return useSelector(() => styleStore$.style.fill.gradient.get())
}

export function usePatternTexture(): PatternTextureData {
  return useSelector(() => styleStore$.style.fill.patternTexture.get())
}

export function useStrokeEnabled(): boolean {
  return useSelector(() => styleStore$.style.useStroke.get())
}

export function useStroke(): StrokeData {
  return useSelector(() => styleStore$.style.stroke.get())
}

export function useShadowEnabled(): boolean {
  return useSelector(() => styleStore$.style.useShadow.get())
}

export function useShadow(): ShadowData {
  return useSelector(() => styleStore$.style.shadow.get())
}

export function useBgColor(): string {
  return useSelector(() => styleStore$.style.bgColor.get())
}

export function useGlobalAdjustMetric(): MetricData {
  return useSelector(() => styleStore$.globalAdjustMetric.get())
}

// Layout Hooks

export function useLayout(): LayoutData {
  return useSelector(() => layoutStore$.layout.get())
}

export function usePadding(): number {
  return useSelector(() => layoutStore$.layout.padding.get())
}

export function useSpacing(): number {
  return useSelector(() => layoutStore$.layout.spacing.get())
}

export function useLayoutWidth(): number {
  return useSelector(() => layoutStore$.layout.width.get())
}

export function useLayoutHeight(): number {
  return useSelector(() => layoutStore$.layout.height.get())
}

export function useAutoLayout(): boolean {
  return useSelector(() => layoutStore$.layout.auto.get())
}

export function useFixedSize(): boolean {
  return useSelector(() => layoutStore$.layout.fixedSize.get())
}

export function usePageCount(): number {
  return useSelector(() => layoutStore$.layout.page.get())
}

// UI Hooks

export function useUi(): UiData {
  return useSelector(() => uiStore$.ui.get())
}

export function usePreviewText(): string {
  return useSelector(() => uiStore$.ui.previewText.get())
}

export function useShowPreview(): boolean {
  return useSelector(() => uiStore$.ui.showPreview.get())
}

export function useSelectLetter(): {
  selectLetter: string
  selectNextLetter: string
} {
  return useSelectorShallow(() => ({
    selectLetter: uiStore$.ui.selectLetter.get(),
    selectNextLetter: uiStore$.ui.selectNextLetter.get(),
  }))
}

export function usePackFailed(): boolean {
  return useSelector(() => uiStore$.ui.packFailed.get())
}

export function useUiTransform(): {
  scale: number
  offsetX: number
  offsetY: number
} {
  return useSelectorShallow(() => ({
    scale: uiStore$.ui.scale.get(),
    offsetX: uiStore$.ui.offsetX.get(),
    offsetY: uiStore$.ui.offsetY.get(),
  }))
}

export function usePreviewTransform(): {
  scale: number
  offsetX: number
  offsetY: number
} {
  return useSelectorShallow(() => ({
    scale: uiStore$.ui.previewScale.get(),
    offsetX: uiStore$.ui.previewOffsetX.get(),
    offsetY: uiStore$.ui.previewOffsetY.get(),
  }))
}

// Workspace Hooks

export function useWorkspace(): WorkspaceData {
  return useSelector(() => workspaceStore$.workspace.get())
}

export function useActiveProjectId(): number {
  return useSelector(() => workspaceStore$.workspace.activeId.get())
}

export function useProjectList(): ProjectMeta[] {
  return useSelector(() =>
    Object.values(workspaceStore$.workspace.projectList.get()),
  )
}

export function useProjectCount(): number {
  return useSelector(
    () => Object.keys(workspaceStore$.workspace.projectList.get()).length,
  )
}

export function useProjectMeta(projectId: number): ProjectMeta | undefined {
  return useSelector(() =>
    workspaceStore$.workspace.projectList[projectId].get(),
  )
}
