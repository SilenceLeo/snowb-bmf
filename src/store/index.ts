import { configure, runInAction } from 'mobx'
import { createContext } from 'react'
import { loadWorkspace } from 'src/utils/persistence'

import Workspace from './workspace'

configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
})

export interface Store {
  workspace: Workspace
}

let store: Store

export default async function createStore(): Promise<Store> {
  if (!store) {
    // Try to restore from IndexedDB
    const savedData = await loadWorkspace()

    if (savedData && savedData.projects.length > 0) {
      // Create workspace without default project
      const workspace = new Workspace(false)

      // Restore all projects
      runInAction(() => {
        savedData.projects.forEach((projectData) => {
          workspace.addProject(projectData)
        })

        // Restore active project ID
        if (workspace.projectList.has(savedData.activeId)) {
          workspace.activeId = savedData.activeId
        } else {
          // Fallback to first project if saved activeId doesn't exist
          const firstId = savedData.projects[0].id
          if (firstId) {
            workspace.activeId = firstId
          }
        }
      })

      store = { workspace }
      console.log('[Store] Restored workspace from IndexedDB')
    } else {
      // No saved data, create default workspace
      store = { workspace: new Workspace() }
      console.log('[Store] Created new workspace')
    }
  }
  return store
}

export const StoreContext = createContext<Store | null>(null)

export { default as Project } from './project'

export { default as Workspace } from './workspace'

export * from './base'
