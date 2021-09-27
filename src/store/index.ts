import { configure } from 'mobx'

import Ui from './ui'
import Workspace from './workspace'

configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
})

export interface Store {
  ui: Ui
  workspace: Workspace
}

let store: Store

export default function createStore(): Store {
  if (!store) store = { ui: new Ui(), workspace: new Workspace() }
  return store
}

export type TStore = ReturnType<typeof createStore>

export { default as Ui } from './ui'
export { default as Project } from './project'
export { default as Workspace } from './workspace'

export * from './base'
