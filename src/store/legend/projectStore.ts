/**
 * Project Store - Legend State implementation
 *
 * Manages project-level state that doesn't require high-frequency updates.
 * For glyph-specific state, use glyphStore.ts instead.
 */
import { batch, observable } from '@legendapp/state'

// ============================================================================
// Constants
// ============================================================================

export const DEFAULT_PROJECT_TEXT =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!№;%:?*()_+-=.,/|"\'@#$^&{}[]'

// ============================================================================
// Store State
// ============================================================================

// Timer IDs are kept as module-level variables rather than in the observable
// because they are opaque handles (not serializable state) and should not
// trigger reactive updates when changed.
let packTimerId = 0
let packLastExecuteTime = 0

/**
 * Project state
 */
export const projectStore$ = observable({
  // Current project info
  current: {
    id: 0,
    name: 'Unnamed',
    text: DEFAULT_PROJECT_TEXT,
  },

  // Initialization state
  initialization: {
    isInitializing: false,
  },
})

// ============================================================================
// Project Management
// ============================================================================

/**
 * Set current project
 */
export function setCurrentProject(project: {
  id: number
  name: string
  text: string
}): void {
  batch(() => {
    projectStore$.current.id.set(project.id)
    projectStore$.current.name.set(project.name)
    projectStore$.current.text.set(project.text)
  })
}

/**
 * Set project name
 */
export function setProjectName(name: string): void {
  projectStore$.current.name.set(name)
}

/**
 * Set project text
 */
export function setProjectText(text: string): void {
  // Remove whitespace except space (space is a valid bitmap font character)
  const cleanedText = text.replace(/[^\S ]/gm, '')
  projectStore$.current.text.set(cleanedText)
}

/**
 * Get current text
 */
export function getProjectText(): string {
  return projectStore$.current.text.get()
}

// ============================================================================
// Timing State (for throttling pack operations)
// ============================================================================

/**
 * Update pack last execution time
 */
export function setPackLastExecuteTime(time: number): void {
  packLastExecuteTime = time
}

/**
 * Get pack last execution time
 */
export function getPackLastExecuteTime(): number {
  return packLastExecuteTime
}

/**
 * Set pack timer ID
 */
export function setPackTimer(timerId: number): void {
  packTimerId = timerId
}

/**
 * Get pack timer ID
 */
export function getPackTimer(): number {
  return packTimerId
}

/**
 * Clear pack timer
 */
export function clearPackTimer(): void {
  if (packTimerId) {
    window.clearTimeout(packTimerId)
    packTimerId = 0
  }
}

// ============================================================================
// Initialization State
// ============================================================================

/**
 * Set initializing state
 */
export function setInitializing(isInitializing: boolean): void {
  projectStore$.initialization.isInitializing.set(isInitializing)
}

/**
 * Get initializing state
 */
export function isInitializing(): boolean {
  return projectStore$.initialization.isInitializing.get()
}

// ============================================================================
// Store Reset
// ============================================================================

/**
 * Reset project store to initial state
 */
export function resetProjectStore(): void {
  // Clear any pending pack timer before resetting
  clearPackTimer()
  packLastExecuteTime = 0

  batch(() => {
    projectStore$.current.id.set(0)
    projectStore$.current.name.set('Unnamed')
    projectStore$.current.text.set(DEFAULT_PROJECT_TEXT)
    projectStore$.initialization.isInitializing.set(false)
  })
}
