/**
 * Workspace Store - Legend State implementation
 *
 * Manages workspace-level state for multi-project support:
 * - Active project ID
 * - Project list with metadata
 * - Project creation, selection, and removal
 *
 * Note: Project data itself is stored in separate stores (styleStore, layoutStore,
 * glyphStore, etc.). This store only manages project metadata and selection.
 */
import { batch, observable, observe } from '@legendapp/state'
import { deleteProject as deleteProjectFromDB } from 'src/utils/persistence'

// ============================================================================
// Type Definitions
// ============================================================================

export interface ProjectMeta {
  id: number
  name: string
}

export interface WorkspaceData {
  activeId: number
  projectList: Record<number, ProjectMeta>
}

export interface WorkspaceStoreState {
  workspace: WorkspaceData
}

// ============================================================================
// Store State
// ============================================================================

export const workspaceStore$ = observable<WorkspaceStoreState>({
  workspace: {
    activeId: 0,
    projectList: {},
  },
})

// ============================================================================
// Computed Values
// ============================================================================

/**
 * Get current active project ID
 */
export function getActiveId(): number {
  return workspaceStore$.workspace.activeId.get()
}

/**
 * Get current active project metadata
 */
export function getCurrentProject(): ProjectMeta | null {
  const activeId = workspaceStore$.workspace.activeId.get()
  const projectList = workspaceStore$.workspace.projectList.get()
  return projectList[activeId] || null
}

/**
 * Get named list of all projects (for UI display)
 */
export function getNamedList(): ProjectMeta[] {
  const projectList = workspaceStore$.workspace.projectList.get()
  return Object.values(projectList)
}

/**
 * Get project count
 */
export function getProjectCount(): number {
  return Object.keys(workspaceStore$.workspace.projectList.get()).length
}

/**
 * Check if a project exists
 */
export function hasProject(id: number): boolean {
  return id in workspaceStore$.workspace.projectList.get()
}

// ============================================================================
// Project Management Actions
// ============================================================================

/**
 * Select a project by ID
 */
export function selectProject(id: number): void {
  if (hasProject(id)) {
    workspaceStore$.workspace.activeId.set(id)
  }
}

/**
 * Add a new project
 * Returns 0 on success (new project created), 1 if project already exists
 */
export function addProject(project: Partial<ProjectMeta> = {}): {
  status: number
  id: number
} {
  const projectList = workspaceStore$.workspace.projectList.get()

  // If project ID exists, just select it
  if (project.id && project.id in projectList) {
    workspaceStore$.workspace.activeId.set(project.id)
    return { status: 1, id: project.id }
  }

  // Generate unique name if not provided
  let name = project.name || 'Unnamed'
  if (!project.name) {
    const namedList: number[] = []
    Object.values(projectList).forEach((item) => {
      const named = item.name.match(/^Unnamed-?(\d+)?$/)
      if (named) {
        namedList.push(Number(named[1]) || 0)
      }
    })
    if (namedList.length > 0) {
      name = `Unnamed-${Math.max(...namedList) + 1}`
    }
  }

  // Generate unique ID
  const id = project.id || Date.now()

  batch(() => {
    workspaceStore$.workspace.projectList[id].set({ id, name })
    workspaceStore$.workspace.activeId.set(id)
  })

  return { status: 0, id }
}

/**
 * Remove a project by ID
 */
export function removeProject(id: number): void {
  const namedList = getNamedList().filter((item) => item.id !== id)

  // Cannot remove the last project
  if (namedList.length === 0) {
    return
  }

  batch(() => {
    // Select another project first
    workspaceStore$.workspace.activeId.set(namedList[0].id)
    // Delete the project from list
    workspaceStore$.workspace.projectList[id].delete()
  })

  // Delete from IndexedDB to prevent accumulation
  deleteProjectFromDB(id).catch((error) => {
    console.error(`Failed to delete project ${id} from database:`, error)
  })
}

/**
 * Set project name
 */
export function setProjectName(id: number, name: string): void {
  const projectList = workspaceStore$.workspace.projectList.get()
  if (id in projectList) {
    workspaceStore$.workspace.projectList[id].name.set(name)
  }
}

/**
 * Update project metadata
 */
export function updateProjectMeta(
  id: number,
  meta: Partial<ProjectMeta>,
): void {
  const projectList = workspaceStore$.workspace.projectList.get()
  if (id in projectList) {
    if (meta.name !== undefined) {
      workspaceStore$.workspace.projectList[id].name.set(meta.name)
    }
  }
}

// ============================================================================
// Observers
// ============================================================================

/**
 * Observe active project changes
 */
export function observeActiveProject(
  callback: (activeId: number) => void,
): () => void {
  return observe(() => {
    callback(workspaceStore$.workspace.activeId.get())
  })
}

/**
 * Observe project list changes
 */
export function observeProjectList(
  callback: (list: ProjectMeta[]) => void,
): () => void {
  return observe(() => {
    callback(getNamedList())
  })
}

// ============================================================================
// Store Initialization / Reset
// ============================================================================

/**
 * Initialize workspace with a default project
 */
export function initializeWorkspace(createDefault = true): number {
  if (createDefault) {
    const id = Date.now()
    batch(() => {
      workspaceStore$.workspace.activeId.set(id)
      workspaceStore$.workspace.projectList[id].set({
        id,
        name: 'Unnamed',
      })
    })
    return id
  }
  return 0
}

/**
 * Initialize workspace from saved data
 */
export function initializeWorkspaceFromData(data: {
  activeId: number
  projects: ProjectMeta[]
}): void {
  batch(() => {
    // Clear existing projects
    workspaceStore$.workspace.projectList.set({})

    // Add projects from data
    data.projects.forEach((project) => {
      workspaceStore$.workspace.projectList[project.id].set(project)
    })

    // Set active ID (ensure it exists in the list)
    if (data.projects.some((p) => p.id === data.activeId)) {
      workspaceStore$.workspace.activeId.set(data.activeId)
    } else if (data.projects.length > 0) {
      workspaceStore$.workspace.activeId.set(data.projects[0].id)
    }
  })
}

/**
 * Reset workspace store
 */
export function resetWorkspaceStore(): void {
  const id = Date.now()
  batch(() => {
    workspaceStore$.workspace.projectList.set({
      [id]: { id, name: 'Unnamed' },
    })
    workspaceStore$.workspace.activeId.set(id)
  })
}

/**
 * Get workspace snapshot for serialization
 */
export function getWorkspaceSnapshot(): {
  activeId: number
  projects: ProjectMeta[]
} {
  return {
    activeId: workspaceStore$.workspace.activeId.get(),
    projects: getNamedList(),
  }
}

/**
 * Get full workspace store state
 */
export function getWorkspaceStoreState(): WorkspaceStoreState {
  return workspaceStore$.get()
}
