// cspell:words Dexie
import Dexie, { type Table } from 'dexie'
import conversion from 'src/file/conversion'
import encodeProject from 'src/file/conversion/fileTypes/sbf/proto/encodeProject'
import { createPrefix } from 'src/file/conversion/fileTypes/sbf/utils'
import {
  DEFAULT_PROJECT_TEXT,
  addProject,
  cancelAllOperations,
  cleanupListeners,
  clearAllImageGlyphs,
  ensureSpaceGlyph,
  getActiveId,
  getNamedList,
  hasProject,
  initPackingEngine,
  initializeGlyphsFromText,
  initializeWorkspaceFromData,
  packStyle,
  resetGlyphStore,
  resetLayoutStore,
  resetStyleStore,
  resetUiStore,
  selectProject,
  setPackCanvases,
  setSourceCanvas,
  updateBaselines,
  setCurrentProject,
  setInitializing,
  setupAutoRunListeners,
  workspaceStore$,
} from 'src/store/legend'
import {
  type DecodedProject,
  type SerializableProject,
  deserializeProject,
  initializeImageGlyphSources,
  serializeProject,
} from 'src/store/legend/persistence'
import { uint8ArrayToArrayBuffer } from 'src/utils/bufferUtils'

// Database schema types
interface WorkspaceMeta {
  id: 'current' // Singleton key
  activeId: number
  projectIds: number[]
  lastSaved: number
}

interface ProjectData {
  id: number // Primary key
  data: Uint8Array // Protobuf-encoded project
  name: string // For indexing/querying
  lastModified: number
}

// Dexie database class
class SnowBambooDatabase extends Dexie {
  workspaceMeta!: Table<WorkspaceMeta, string>
  projects!: Table<ProjectData, number>

  constructor() {
    super('snowb-bmf')

    this.version(1).stores({
      workspaceMeta: 'id',
      projects: 'id, name, lastModified',
    })
  }
}

// Singleton database instance
const db = new SnowBambooDatabase()

// ============================================================================
// Legend State Persistence Functions
// ============================================================================

/**
 * Encode a SerializableProject to Uint8Array for storage
 */
function encodeLegendProject(project: SerializableProject): Uint8Array {
  try {
    const prefix = createPrefix()
    const payload = encodeProject(project as any)
    const buffer = new Uint8Array(prefix.byteLength + payload.byteLength)

    buffer.set(prefix, 0)
    buffer.set(payload, prefix.byteLength)

    return buffer
  } catch (error) {
    throw new Error(
      `Failed to encode project: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Save the current Legend State project to IndexedDB
 * @returns Promise that resolves when save is complete
 */
export async function saveLegendProject(): Promise<boolean> {
  try {
    const project = serializeProject()
    const encodedData = encodeLegendProject(project)

    await db.projects.put({
      id: project.id,
      data: encodedData,
      name: project.name,
      lastModified: Date.now(),
    })

    console.log(`[Persistence] Saved project: ${project.name}`)
    return true
  } catch (error) {
    console.error('[Persistence] Failed to save project:', error)
    return false
  }
}

/**
 * Save all Legend State projects to IndexedDB
 * Uses the workspace store to get all project IDs
 * @returns Promise that resolves when save is complete
 */
export async function saveLegendWorkspace(): Promise<boolean> {
  try {
    const activeId = getActiveId()
    const projectIds = getNamedList().map((p) => p.id)

    // NOTE: Only the active project is serialized here. Non-active projects are assumed
    // to have been saved when switching away (via switchLegendProject).
    // Risk: If the browser crashes without triggering beforeunload, non-active projects
    // may lose unsaved changes. Consider saving all modified projects in a future iteration.
    const currentProject = serializeProject()

    const projectsToSave: ProjectData[] = [
      {
        id: currentProject.id,
        data: encodeLegendProject(currentProject),
        name: currentProject.name,
        lastModified: Date.now(),
      },
    ]

    // Save everything in a single transaction
    await db.transaction('rw', db.workspaceMeta, db.projects, async () => {
      // Save workspace metadata with all project IDs
      await db.workspaceMeta.put({
        id: 'current',
        activeId,
        projectIds,
        lastSaved: Date.now(),
      })

      // Save active project (non-active projects are already persisted
      // in IndexedDB from previous switchLegendProject calls)
      await db.projects.bulkPut(projectsToSave)

      // Clean up orphaned projects no longer in the workspace
      const existingIds = await db.projects.toCollection().primaryKeys()
      const orphanedIds = existingIds.filter(
        (id) => !projectIds.includes(id as number),
      )
      if (orphanedIds.length > 0) {
        await db.projects.bulkDelete(orphanedIds)
      }
    })

    console.log(
      `[Persistence] Saved workspace with ${projectIds.length} project(s)`,
    )
    return true
  } catch (error) {
    console.error('[Persistence] Failed to save workspace:', error)
    return false
  }
}

/**
 * Load workspace data from IndexedDB and initialize Legend State stores
 * @returns Promise that resolves when load is complete
 */
export async function loadWorkspaceToLegendState(): Promise<boolean> {
  try {
    // Check if IndexedDB is available
    if (!window.indexedDB) {
      console.warn('[Persistence] IndexedDB not available')
      return false
    }

    // Load all projects from database
    const projectDataList = await db.projects.toArray()

    if (projectDataList.length === 0) {
      console.log('[Persistence] No saved projects found')
      return false
    }

    // Decode projects
    const decodedProjects: DecodedProject[] = []
    for (const projectData of projectDataList) {
      try {
        // Decode protobuf to Project object
        const project = conversion(
          uint8ArrayToArrayBuffer(projectData.data),
        ) as DecodedProject
        decodedProjects.push(project)
      } catch (error) {
        console.error(
          `[Persistence] Failed to decode project ${projectData.id}:`,
          error,
        )
      }
    }

    if (decodedProjects.length === 0) {
      console.warn('[Persistence] No valid projects found')
      return false
    }

    // Load workspace metadata for activeId and saved order
    const meta = await db.workspaceMeta.get('current')
    let activeId = meta?.activeId ?? decodedProjects[0].id ?? Date.now()

    // Check if activeId exists in loaded projects
    const activeProjectExists = decodedProjects.some((p) => p.id === activeId)
    if (!activeProjectExists) {
      activeId = decodedProjects[0].id ?? Date.now()
      console.warn(
        `[Persistence] Active project ${meta?.activeId} not found, fallback to project ${activeId}`,
      )
    }

    // Restore project order from saved metadata
    const savedOrder = meta?.projectIds ?? []
    const decodedIds = new Set(decodedProjects.map((p) => p.id))
    const orderedProjects = [
      // Projects in saved order (filter out any that no longer exist)
      ...savedOrder
        .filter((id) => decodedIds.has(id))
        .map((id) => decodedProjects.find((p) => p.id === id)!),
      // Append any decoded projects not in saved order (e.g. data recovery)
      ...decodedProjects.filter((p) => !savedOrder.includes(p.id!)),
    ]

    // Find and deserialize the active project
    const activeProject = orderedProjects.find((p) => p.id === activeId)
    if (activeProject) {
      await deserializeProject(activeProject)
      await initializeImageGlyphSources()
    }

    // Initialize workspace with project list (order preserved)
    initializeWorkspaceFromData({
      activeId,
      projects: orderedProjects.map((p) => ({
        id: p.id ?? Date.now(),
        name: p.name ?? 'Unnamed',
      })),
    })

    console.log(
      `[Persistence] Loaded workspace with ${decodedProjects.length} project(s)`,
    )

    return true
  } catch (error) {
    console.error('[Persistence] Failed to load workspace:', error)
    return false
  }
}

// Global mutex to prevent concurrent project operations
let isSwitchingProject = false

/**
 * Switch to a different project in Legend State.
 * Full lifecycle: cleanup listeners -> cancel operations -> save current ->
 * load target from IndexedDB -> deserialize -> init packing engine ->
 * packStyle -> setup listeners.
 *
 * @param projectId - The ID of the project to switch to
 */
export async function switchLegendProject(projectId: number): Promise<boolean> {
  // Skip if switching to the same project
  if (projectId === getActiveId()) return true

  // Prevent concurrent switches
  if (isSwitchingProject) {
    console.warn('[Persistence] Project switch already in progress, skipping')
    return false
  }
  isSwitchingProject = true
  setInitializing(true)

  // Save previous activeId for error recovery
  const previousActiveId = getActiveId()

  try {
    // 1. Cleanup listeners to prevent stale observers from firing during store writes
    cleanupListeners()

    // 2. Cancel any pending packing operations
    cancelAllOperations()

    // 2.5. Clear stale pack data immediately so PackView shows blank (background color)
    // instead of the previous project's textures while the new project packs
    setPackCanvases([])
    setSourceCanvas(null)

    // 3. Save current project to IndexedDB
    await saveLegendProject()

    // 4. Load target project from database
    const projectData = await db.projects.get(projectId)
    if (!projectData) {
      console.error(`[Persistence] Project ${projectId} not found`)
      // Recovery: restore listeners so the current project remains functional
      setupAutoRunListeners()
      return false
    }

    // 5. Decode and deserialize into stores
    const decodedProject = conversion(
      uint8ArrayToArrayBuffer(projectData.data),
    ) as DecodedProject
    await deserializeProject(decodedProject)
    await initializeImageGlyphSources()

    // 6. Update workspace active project (before packStyle for immediate UI feedback)
    selectProject(projectId)

    // 7. Init packing engine (no-op if already created)
    initPackingEngine()

    // 8. Run initial pack before setting up listeners (same order as initializeProject)
    await packStyle()

    // 9. Setup new auto-run listeners
    setupAutoRunListeners()

    console.log(`[Persistence] Switched to project: ${projectData.name}`)
    return true
  } catch (error) {
    console.error(
      `[Persistence] Failed to switch to project ${projectId}:`,
      error,
    )
    // Recovery: restore activeId and listeners so the previous project remains functional
    selectProject(previousActiveId)
    setupAutoRunListeners()
    return false
  } finally {
    setInitializing(false)
    isSwitchingProject = false
  }
}

/**
 * Create a new blank project.
 * Full lifecycle: cleanup listeners -> cancel operations -> save current ->
 * add metadata -> reset stores -> initialize glyphs -> packStyle -> setup listeners ->
 * save to IndexedDB.
 */
export async function createNewLegendProject(): Promise<{
  status: number
  id: number
}> {
  if (isSwitchingProject) {
    console.warn('[Persistence] Project operation already in progress, skipping')
    return { status: -1, id: 0 }
  }
  isSwitchingProject = true
  setInitializing(true)

  try {
    // 1. Cleanup listeners
    cleanupListeners()

    // 2. Cancel pending operations
    cancelAllOperations()

    // 3. Save current project
    await saveLegendProject()

    // 4. Add project metadata to workspace (generates id + name)
    const result = addProject()
    const newId = result.id

    // 5. Reset all stores to defaults
    resetStyleStore()
    resetLayoutStore()
    resetUiStore()
    clearAllImageGlyphs()
    resetGlyphStore()

    // Calculate baselines for default CSS font (no OpenType font uploaded yet)
    updateBaselines()

    // 6. Set new project info
    setCurrentProject({
      id: newId,
      name: getNamedList().find((p) => p.id === newId)?.name ?? 'Unnamed',
      text: DEFAULT_PROJECT_TEXT,
    })

    // 7. Initialize glyphs from default text
    initializeGlyphsFromText(DEFAULT_PROJECT_TEXT)
    ensureSpaceGlyph()

    // 8. Init packing engine
    initPackingEngine()

    // 9. Run initial pack
    await packStyle()

    // 10. Setup listeners
    setupAutoRunListeners()

    // 11. Save new project to IndexedDB
    await saveLegendProject()

    console.log(`[Persistence] Created new project: ${newId}`)
    return result
  } catch (error) {
    console.error('[Persistence] Failed to create new project:', error)
    // Recovery: restore listeners so the application remains functional
    setupAutoRunListeners()
    return { status: -1, id: 0 }
  } finally {
    setInitializing(false)
    isSwitchingProject = false
  }
}

/**
 * Open a decoded project (from file import).
 * If the project already exists in workspace, switches to it.
 * Otherwise: cleanup listeners -> cancel -> save current -> add metadata ->
 * deserialize -> init image sources -> packStyle -> setup listeners -> save to IndexedDB.
 *
 * @returns { status: 0 } for new project, { status: 1 } for existing project
 */
export async function openLegendProject(
  decodedProject: DecodedProject,
): Promise<{ status: number; id: number }> {
  const projectId = decodedProject.id ?? Date.now()

  // If project already exists in workspace, just switch to it
  if (hasProject(projectId)) {
    await switchLegendProject(projectId)
    return { status: 1, id: projectId }
  }

  if (isSwitchingProject) {
    console.warn('[Persistence] Project operation already in progress, skipping')
    return { status: -1, id: 0 }
  }
  isSwitchingProject = true
  setInitializing(true)

  try {
    // 1. Cleanup listeners
    cleanupListeners()

    // 2. Cancel pending operations
    cancelAllOperations()

    // 3. Save current project
    await saveLegendProject()

    // 4. Add project metadata to workspace
    const result = addProject({
      id: projectId,
      name: decodedProject.name ?? 'Unnamed',
    })

    // 5. Deserialize project data into stores
    await deserializeProject(decodedProject)
    await initializeImageGlyphSources()

    // 6. Init packing engine
    initPackingEngine()

    // 7. Run initial pack
    await packStyle()

    // 8. Setup listeners
    setupAutoRunListeners()

    // 9. Save to IndexedDB
    await saveLegendProject()

    console.log(
      `[Persistence] Opened project: ${decodedProject.name ?? 'Unnamed'}`,
    )
    return { status: result.status, id: result.id }
  } catch (error) {
    console.error('[Persistence] Failed to open project:', error)
    // Recovery: restore listeners so the application remains functional
    setupAutoRunListeners()
    return { status: -1, id: 0 }
  } finally {
    setInitializing(false)
    isSwitchingProject = false
  }
}

/**
 * Remove a project from workspace and IndexedDB.
 * If removing the active project, switches to another project first,
 * then removes the metadata and data.
 * Cannot remove the last remaining project.
 */
export async function removeLegendProject(
  projectId: number,
): Promise<boolean> {
  const namedList = getNamedList()
  const remaining = namedList.filter((item) => item.id !== projectId)

  // Cannot remove the last project
  if (remaining.length === 0) {
    console.warn('[Persistence] Cannot remove the last project')
    return false
  }

  if (isSwitchingProject) {
    console.warn('[Persistence] Project operation already in progress, skipping')
    return false
  }

  try {
    const isActive = projectId === getActiveId()

    // If removing the active project, switch to another first
    // (this saves current data and loads the new project)
    if (isActive) {
      await switchLegendProject(remaining[0].id)
    }

    // Remove from workspace metadata (direct store access to avoid
    // workspaceStore.removeProject's side effects — it also changes
    // activeId and calls deleteProjectFromDB, both already handled)
    workspaceStore$.workspace.projectList[projectId].delete()

    // Delete from IndexedDB
    await deleteProject(projectId)

    console.log(`[Persistence] Removed project: ${projectId}`)
    return true
  } catch (error) {
    console.error(
      `[Persistence] Failed to remove project ${projectId}:`,
      error,
    )
    return false
  }
}

// ============================================================================
// Common Utility Functions
// ============================================================================

/**
 * Delete a single project from IndexedDB
 * @param projectId - The ID of the project to delete
 */
export async function deleteProject(projectId: number): Promise<void> {
  try {
    await db.projects.delete(projectId)
    console.log(`[Persistence] Deleted project ${projectId}`)
  } catch (error) {
    console.error(`[Persistence] Failed to delete project ${projectId}:`, error)
  }
}

/**
 * Clear all saved data from IndexedDB
 * Useful for debugging or reset functionality
 */
export async function clearAllData(): Promise<void> {
  try {
    await db.transaction('rw', db.workspaceMeta, db.projects, async () => {
      await db.workspaceMeta.clear()
      await db.projects.clear()
    })
    console.log('[Persistence] All data cleared')
  } catch (error) {
    console.error('[Persistence] Failed to clear data:', error)
  }
}

/**
 * Get storage usage information
 * @returns Object with storage usage details
 */
export async function getStorageInfo(): Promise<{
  workspaceCount: number
  projectCount: number
  hasData: boolean
}> {
  try {
    const workspaceCount = await db.workspaceMeta.count()
    const projectCount = await db.projects.count()

    return {
      workspaceCount,
      projectCount,
      hasData: workspaceCount > 0 || projectCount > 0,
    }
  } catch (error) {
    console.error('[Persistence] Failed to get storage info:', error)
    return {
      workspaceCount: 0,
      projectCount: 0,
      hasData: false,
    }
  }
}

// Export database instance for advanced usage
export { db }
