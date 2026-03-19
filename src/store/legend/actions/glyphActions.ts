import { batch, opaqueObject } from '@legendapp/state'
import getTrimImageInfo from 'src/utils/getTrimImageInfo'

import {
  addGlyph,
  createFontGlyph,
  generateImageGlyphUid,
  glyphStore$,
  incrementGlyphDataVersion,
  setPackCanvases,
  setSourceCanvas,
} from '../glyphStore'
import { getProjectText, setProjectText } from '../projectStore'
import type { FontGlyphData, ImageGlyphData } from '../types'
import { packStyle, throttlePack } from './packingActions'

// Types

export interface ImageFileInfo {
  letter?: string
  fileName: string
  fileType: string
  buffer: ArrayBuffer
}

export interface KerningUpdate {
  letter: string
  nextLetter: string
  value: number
}

export interface MetricAdjustment {
  // `letter` identifies the glyph but is not used when passed as Partial<MetricAdjustment>
  // to setGlyphAdjustMetric/setImageGlyphAdjustMetric (letter is a separate parameter).
  // Retained for batch update scenarios where letter must travel with the adjustment.
  letter: string
  xAdvance?: number
  xOffset?: number
  yOffset?: number
}

// Text and Glyph Synchronization

/**
 * Set project text and synchronize glyphs.
 * This is the main entry point for text changes.
 */
export function setText(newText: string): void {
  const oldText = getProjectText()
  setProjectText(newText)
  syncGlyphsWithTextChange(oldText)
}

/**
 * Synchronize glyphs based on text change.
 * Uses Set-based O(n) diff algorithm to add new glyphs and remove obsolete ones.
 */
export function syncGlyphsWithTextChange(oldText: string = ''): void {
  const currentText = getProjectText()

  const currentSet = new Set(currentText)
  currentSet.add(' ')

  // For first-time initialization (no old text), add all current characters
  if (!oldText) {
    const allCurrent = Array.from(currentSet)
    batch(() => {
      allCurrent.forEach((letter) => {
        if (!glyphStore$.glyphs[letter].get()) {
          glyphStore$.glyphs[letter].set(createFontGlyph(letter))
        }
      })
    })
    packStyle()
    return
  }

  const oldSet = new Set(oldText)

  const toAdd: string[] = []
  currentSet.forEach((char) => {
    if (!oldSet.has(char)) {
      toAdd.push(char)
    }
  })

  const toRemove: string[] = []
  oldSet.forEach((char) => {
    if (!currentSet.has(char)) {
      toRemove.push(char)
    }
  })

  if (toAdd.length === 0 && toRemove.length === 0) {
    return
  }

  batch(() => {
    toAdd.forEach((letter) => {
      if (!glyphStore$.glyphs[letter].get()) {
        glyphStore$.glyphs[letter].set(createFontGlyph(letter))
      }
    })

    toRemove.forEach((letter) => {
      glyphStore$.glyphs[letter].delete()
    })
  })

  packStyle()
}

export function initializeGlyphsFromText(text: string): void {
  const charList = Array.from(new Set(Array.from(` ${text}`)))

  batch(() => {
    glyphStore$.glyphs.set({})
    charList.forEach((letter) => {
      glyphStore$.glyphs[letter].set(createFontGlyph(letter))
    })
  })
}

export function ensureSpaceGlyph(): void {
  if (!glyphStore$.glyphs[' '].get()) {
    addGlyph(' ')
  }
}

// Image Glyph Management

export async function addImages(fileList: ImageFileInfo[]): Promise<void> {
  const results = await Promise.allSettled(
    fileList.map(async (fileInfo) => {
      const imageGlyph = createImageGlyphFromFile(fileInfo)
      await initializeImageGlyphOffStore(imageGlyph, fileInfo.buffer)
      return imageGlyph
    }),
  )

  const initializedGlyphs: ImageGlyphData[] = []
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      initializedGlyphs.push(result.value)
    } else {
      console.warn(`[GlyphActions] ${result.reason}`)
    }
  })

  if (initializedGlyphs.length === 0) {
    return
  }

  batch(() => {
    initializedGlyphs.forEach((glyph) => {
      glyphStore$.imageGlyphs.push(glyph)
    })
    incrementGlyphDataVersion()
  })

  throttlePack()
}

function createImageGlyphFromFile(fileInfo: ImageFileInfo): ImageGlyphData {
  return {
    type: 'image' as const,
    letter: fileInfo.letter || '',
    uid: generateImageGlyphUid(),
    selected: true,
    source: null,
    x: 0,
    y: 0,
    page: -1,
    width: 0,
    height: 0,
    fontWidth: 0,
    fontHeight: 0,
    trimOffsetTop: 0,
    trimOffsetLeft: 0,
    canvasX: 0,
    canvasY: 0,
    kerning: {},
    adjustMetric: { xAdvance: 0, xOffset: 0, yOffset: 0 },
    fileName: fileInfo.fileName,
    fileType: fileInfo.fileType,
    buffer: opaqueObject(fileInfo.buffer),
    src: '',
  }
}

/**
 * Initialize image glyph off-store by loading and processing the image.
 * Mutates the provided glyph object directly (before it's added to store).
 */
async function initializeImageGlyphOffStore(
  imageGlyph: ImageGlyphData,
  buffer: ArrayBuffer,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const src = URL.createObjectURL(new Blob([buffer]))
    const image = new Image()

    image.onload = () => {
      const { naturalWidth, naturalHeight } = image
      const trimInfo = getTrimImageInfo(image)

      imageGlyph.fontWidth = naturalWidth
      imageGlyph.fontHeight = naturalHeight
      imageGlyph.width = trimInfo.width
      imageGlyph.height = trimInfo.height
      imageGlyph.trimOffsetLeft = trimInfo.trimOffsetLeft
      imageGlyph.trimOffsetTop = trimInfo.trimOffsetTop
      imageGlyph.source =
        trimInfo.width > 0 && trimInfo.height > 0
          ? opaqueObject(trimInfo.canvas)
          : null
      imageGlyph.src = src

      resolve()
    }

    image.onerror = () => {
      URL.revokeObjectURL(src)
      reject(new Error(`Failed to load image: ${imageGlyph.fileName}`))
    }

    image.src = src
  })
}

export function removeImage(index: number): void {
  const imageGlyphs = glyphStore$.imageGlyphs.get()

  if (index >= 0 && index < imageGlyphs.length) {
    const imageGlyph = imageGlyphs[index]
    if (imageGlyph.src) {
      URL.revokeObjectURL(imageGlyph.src)
    }
    glyphStore$.imageGlyphs.set(imageGlyphs.filter((_, i) => i !== index))
    incrementGlyphDataVersion()
    throttlePack()
  }
}

export function removeImageByData(imageGlyph: ImageGlyphData): void {
  const imageGlyphs = glyphStore$.imageGlyphs.get()
  const index = imageGlyphs.findIndex(
    (img) =>
      img.letter === imageGlyph.letter && img.fileName === imageGlyph.fileName,
  )

  if (index !== -1) {
    removeImage(index)
  }
}

export function setImageGlyphLetter(index: number, letter: string): void {
  const imageGlyphs = glyphStore$.imageGlyphs.get()

  if (index >= 0 && index < imageGlyphs.length) {
    glyphStore$.imageGlyphs[index].letter.set(letter[0] || '')
    incrementGlyphDataVersion()
    throttlePack()
  }
}

export function setImageGlyphSelected(index: number, selected: boolean): void {
  const imageGlyphs = glyphStore$.imageGlyphs.get()

  if (index >= 0 && index < imageGlyphs.length) {
    glyphStore$.imageGlyphs[index].selected.set(selected)
    incrementGlyphDataVersion()
    throttlePack()
  }
}

export function findImageGlyphIndex(letter: string): number {
  const imageGlyphs = glyphStore$.imageGlyphs.get()
  return imageGlyphs.findIndex((img) => img.letter === letter && img.selected)
}

// Glyph Property Modifications

export function setKerning(
  letter: string,
  nextLetter: string,
  value: number,
): void {
  const glyph = glyphStore$.glyphs[letter].get()

  if (glyph) {
    const newKerning = { ...glyph.kerning }
    if (value === 0) {
      delete newKerning[nextLetter]
    } else {
      newKerning[nextLetter] = value
    }
    glyphStore$.glyphs[letter].kerning.set(newKerning)
    incrementGlyphDataVersion()
  }
}

export function batchSetKerning(updates: KerningUpdate[]): void {
  batch(() => {
    updates.forEach(({ letter, nextLetter, value }) => {
      setKerning(letter, nextLetter, value)
    })
  })
}

export function getKerning(letter: string, nextLetter: string): number {
  const glyph = glyphStore$.glyphs[letter].get()
  if (glyph) {
    return glyph.kerning[nextLetter] || 0
  }
  // Fallback: check image glyphs
  // Kerning is semantically per-letter (character pair spacing), so letter-based
  // lookup is correct here — multiple image glyphs sharing a letter share kerning.
  const imageGlyph = glyphStore$.imageGlyphs
    .get()
    .find((img) => img.letter === letter && img.selected)
  return imageGlyph?.kerning[nextLetter] || 0
}

/**
 * Apply metric adjustments to an observable adjustMetric node.
 * Shared helper for both font and image glyph metric updates.
 */
function applyMetricUpdate(
  adjustMetricNode: {
    xAdvance: { set: (v: number) => void }
    xOffset: { set: (v: number) => void }
    yOffset: { set: (v: number) => void }
  },
  metric: Partial<MetricAdjustment>,
): void {
  batch(() => {
    if (metric.xAdvance !== undefined) {
      adjustMetricNode.xAdvance.set(metric.xAdvance)
    }
    if (metric.xOffset !== undefined) {
      adjustMetricNode.xOffset.set(metric.xOffset)
    }
    if (metric.yOffset !== undefined) {
      adjustMetricNode.yOffset.set(metric.yOffset)
    }
  })
}

export function setGlyphAdjustMetric(
  letter: string,
  metric: Partial<MetricAdjustment>,
): void {
  const glyph = glyphStore$.glyphs[letter].get()

  if (glyph) {
    applyMetricUpdate(glyphStore$.glyphs[letter].adjustMetric, metric)
    incrementGlyphDataVersion()
  }
}

export function setImageGlyphAdjustMetric(
  index: number,
  metric: Partial<MetricAdjustment>,
): void {
  const imageGlyphs = glyphStore$.imageGlyphs.get()

  if (index >= 0 && index < imageGlyphs.length) {
    applyMetricUpdate(glyphStore$.imageGlyphs[index].adjustMetric, metric)
    incrementGlyphDataVersion()
  }
}

// Glyph Data Access

export function getFontGlyph(letter: string): FontGlyphData | undefined {
  return glyphStore$.glyphs[letter].get()
}

export function getImageGlyph(index: number): ImageGlyphData | undefined {
  const imageGlyphs = glyphStore$.imageGlyphs.get()
  return imageGlyphs[index]
}

export function getAllFontGlyphs(): Record<string, FontGlyphData> {
  return glyphStore$.glyphs.get()
}

export function getAllImageGlyphs(): ImageGlyphData[] {
  return glyphStore$.imageGlyphs.get()
}

export function getSelectedImageGlyphs(): ImageGlyphData[] {
  return glyphStore$.imageGlyphs.get().filter((img) => img.selected)
}

export function getTotalGlyphCount(): number {
  const fontCount = Object.keys(glyphStore$.glyphs.get()).length
  const imageCount = glyphStore$.imageGlyphs
    .get()
    .filter((img) => img.selected).length
  return fontCount + imageCount
}

// Cleanup

export function clearAllImageGlyphs(): void {
  const imageGlyphs = glyphStore$.imageGlyphs.get()

  imageGlyphs.forEach((img) => {
    if (img.src) {
      URL.revokeObjectURL(img.src)
    }
  })

  glyphStore$.imageGlyphs.set([])
}

export function resetAllGlyphs(): void {
  clearAllImageGlyphs()
  batch(() => {
    setSourceCanvas(null)
    setPackCanvases([])
    glyphStore$.glyphs.set({})
  })
}
