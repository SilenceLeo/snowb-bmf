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

  // Timing state (for throttling)
  timing: {
    packStart: 0,
    packTimer: 0,
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
 * Update pack timing
 */
export function setPackStart(time: number): void {
  projectStore$.timing.packStart.set(time)
}

/**
 * Get pack start time
 */
export function getPackStart(): number {
  return projectStore$.timing.packStart.get()
}

/**
 * Set pack timer ID
 */
export function setPackTimer(timerId: number): void {
  projectStore$.timing.packTimer.set(timerId)
}

/**
 * Get pack timer ID
 */
export function getPackTimer(): number {
  return projectStore$.timing.packTimer.get()
}

/**
 * Clear pack timer
 */
export function clearPackTimer(): void {
  const timerId = projectStore$.timing.packTimer.get()
  if (timerId) {
    window.clearTimeout(timerId)
    projectStore$.timing.packTimer.set(0)
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

  batch(() => {
    projectStore$.current.id.set(0)
    projectStore$.current.name.set('Unnamed')
    projectStore$.current.text.set(DEFAULT_PROJECT_TEXT)
    projectStore$.timing.packStart.set(0)
    projectStore$.timing.packTimer.set(0)
    projectStore$.initialization.isInitializing.set(false)
  })
}
