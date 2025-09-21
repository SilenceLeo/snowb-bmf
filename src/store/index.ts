import { configure } from 'mobx'
import { createContext } from 'react'

import Workspace from './workspace'

configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
})

export interface Store {
  workspace: Workspace
}

let store: Store

export default function createStore(): Store {
  if (!store) {
    store = { workspace: new Workspace() }
  }
  return store
}

export const StoreContext = createContext<Store>(createStore())

export { default as Project } from './project'

export { default as Workspace } from './workspace'

export * from './base'
