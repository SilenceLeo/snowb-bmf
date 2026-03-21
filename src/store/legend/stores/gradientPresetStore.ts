import { observable } from '@legendapp/state'

import type { GradientPreset } from 'src/types/gradientPreset'
import type { GradientColor } from 'src/types/style'
import builtinGradientPresets from 'src/utils/builtinGradientPresets'
import { db } from 'src/utils/persistence'

// ============================================================================
// Store
// ============================================================================

export const gradientPresetStore$ = observable<{
  presets: GradientPreset[]
  isLoaded: boolean
}>({
  presets: [],
  isLoaded: false,
})

// ============================================================================
// Actions
// ============================================================================

/**
 * Load presets from IndexedDB and merge with built-in presets.
 * Called once at application startup.
 */
export async function loadGradientPresets(): Promise<void> {
  try {
    const table = db.table('gradientPresets')
    const userPresets: GradientPreset[] = await table.toArray()

    // Built-in presets first, then user presets
    gradientPresetStore$.presets.set([
      ...builtinGradientPresets,
      ...userPresets.map((p) => ({ ...p, isBuiltin: false })),
    ])
    gradientPresetStore$.isLoaded.set(true)
  } catch {
    // Table may not exist yet (first run before version upgrade triggers)
    gradientPresetStore$.presets.set([...builtinGradientPresets])
    gradientPresetStore$.isLoaded.set(true)
  }
}

/**
 * Save a user-defined gradient preset.
 */
export async function saveGradientPreset(
  name: string,
  palette: GradientColor[],
): Promise<GradientPreset> {
  const preset: GradientPreset = {
    id: `user-${Date.now()}`,
    name,
    palette: palette.map(({ offset, color }) => ({ offset, color })),
    isBuiltin: false,
  }

  try {
    const table = db.table('gradientPresets')
    await table.put(preset)
  } catch (error) {
    console.error('[GradientPresets] Failed to save preset:', error)
  }

  // Append to store regardless of DB result — if DB write failed,
  // the preset is still visible in the current session (transient).
  const current = gradientPresetStore$.presets.get()
  gradientPresetStore$.presets.set([...current, preset])

  return preset
}

/**
 * Delete a user-defined gradient preset. Built-in presets cannot be deleted.
 */
export async function deleteGradientPreset(id: string): Promise<boolean> {
  const preset = gradientPresetStore$.presets
    .get()
    .find((p) => p.id === id)

  if (!preset || preset.isBuiltin) return false

  try {
    const table = db.table('gradientPresets')
    await table.delete(id)
  } catch (error) {
    console.error('[GradientPresets] Failed to delete preset:', error)
  }

  gradientPresetStore$.presets.set(
    gradientPresetStore$.presets.get().filter((p) => p.id !== id),
  )

  return true
}
