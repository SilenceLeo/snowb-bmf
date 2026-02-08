// cspell:words Dexie
import Dexie, { type Table } from 'dexie'
import conversion from 'src/file/conversion'
import encodeProject from 'src/file/conversion/fileTypes/sbf/proto/encodeProject'
import { createPrefix } from 'src/file/conversion/fileTypes/sbf/utils'
import {
  getActiveId,
  getNamedList,
  initializeWorkspaceFromData,
  selectProject,
} from 'src/store/legend'
import {
  type DecodedProject,
  type SerializableProject,
  deserializeProject,
  initializeImageGlyphSources,
  serializeProject,
} from 'src/store/legend/persistence'

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
export async function saveLegendProject(): Promise<void> {
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
  } catch (error) {
    console.error('[Persistence] Failed to save project:', error)
  }
}

/**
 * Save all Legend State projects to IndexedDB
 * Uses the workspace store to get all project IDs
 * @returns Promise that resolves when save is complete
 */
export async function saveLegendWorkspace(): Promise<void> {
  try {
    const activeId = getActiveId()
    const allProjects = getNamedList()
    const projectIds = allProjects.map((p) => p.id)

    // Serialize the current (active) project from Legend State stores
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
  } catch (error) {
    console.error('[Persistence] Failed to save workspace:', error)
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
        const project = conversion(projectData.data.buffer) as DecodedProject
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

    // Load workspace metadata for activeId
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

    // Find and deserialize the active project
    const activeProject = decodedProjects.find((p) => p.id === activeId)
    if (activeProject) {
      await deserializeProject(activeProject)
      await initializeImageGlyphSources()
    }

    // Initialize workspace with project list
    initializeWorkspaceFromData({
      activeId,
      projects: decodedProjects.map((p) => ({
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

/**
 * Switch to a different project in Legend State
 * Saves current project, loads target project
 * @param projectId - The ID of the project to switch to
 */
export async function switchLegendProject(projectId: number): Promise<boolean> {
  try {
    // Save current project first
    await saveLegendProject()

    // Load target project from database
    const projectData = await db.projects.get(projectId)
    if (!projectData) {
      console.error(`[Persistence] Project ${projectId} not found`)
      return false
    }

    // Decode and deserialize
    const decodedProject = conversion(projectData.data.buffer) as DecodedProject
    await deserializeProject(decodedProject)
    await initializeImageGlyphSources()

    // Update workspace active project
    selectProject(projectId)

    console.log(`[Persistence] Switched to project: ${projectData.name}`)
    return true
  } catch (error) {
    console.error(
      `[Persistence] Failed to switch to project ${projectId}:`,
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
