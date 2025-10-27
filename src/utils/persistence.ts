// cspell:words Dexie
import Dexie, { type Table } from 'dexie'
import { toJS } from 'mobx'
import { encode } from 'src/file/conversion'
import conversion from 'src/file/conversion'
import type Project from 'src/store/project'
import type Workspace from 'src/store/workspace'

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

/**
 * Save the entire workspace to IndexedDB
 * @param workspace - The workspace to save
 * @returns Promise that resolves when save is complete
 */
export async function saveWorkspace(workspace: Workspace): Promise<void> {
  try {
    const projectIds: number[] = []
    const projectsToSave: ProjectData[] = []

    // Serialize each project
    workspace.projectList.forEach((project, id) => {
      projectIds.push(id)

      // Convert MobX observables to plain objects, then encode to protobuf
      const plainProject = toJS(project)
      const encodedData = encode(plainProject as Project)

      projectsToSave.push({
        id,
        data: encodedData,
        name: project.name,
        lastModified: Date.now(),
      })
    })

    // Save everything in a single transaction
    await db.transaction('rw', db.workspaceMeta, db.projects, async () => {
      // Save workspace metadata
      await db.workspaceMeta.put({
        id: 'current',
        activeId: workspace.activeId,
        projectIds,
        lastSaved: Date.now(),
      })

      // Save all projects (bulk put for better performance)
      await db.projects.bulkPut(projectsToSave)
    })

    console.log(
      `[Persistence] Saved workspace with ${projectIds.length} project(s)`,
    )
  } catch (error) {
    console.error('[Persistence] Failed to save workspace:', error)
    // Don't throw - allow app to continue even if save fails
  }
}

/**
 * Load workspace data from IndexedDB
 * @returns The loaded workspace data or null if no data exists
 */
export async function loadWorkspace(): Promise<{
  activeId: number
  projects: Partial<Project>[]
} | null> {
  try {
    // Check if IndexedDB is available
    if (!window.indexedDB) {
      console.warn('[Persistence] IndexedDB not available')
      return null
    }

    // Load workspace metadata
    const meta = await db.workspaceMeta.get('current')
    if (!meta) {
      console.log('[Persistence] No saved workspace found')
      return null
    }

    // Load all projects
    const projectDataList = await db.projects.bulkGet(meta.projectIds)

    // Decode projects
    const projects: Partial<Project>[] = []
    for (const projectData of projectDataList) {
      if (!projectData) continue

      try {
        // Decode protobuf to Project object
        const project = conversion(projectData.data.buffer)
        projects.push(project)
      } catch (error) {
        console.error(
          `[Persistence] Failed to decode project ${projectData.id}:`,
          error,
        )
        // Continue with other projects even if one fails
      }
    }

    if (projects.length === 0) {
      console.warn('[Persistence] No valid projects found')
      return null
    }

    console.log(
      `[Persistence] Loaded workspace with ${projects.length} project(s)`,
    )

    return {
      activeId: meta.activeId,
      projects,
    }
  } catch (error) {
    console.error('[Persistence] Failed to load workspace:', error)
    return null
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
