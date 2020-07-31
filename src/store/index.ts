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

export default function createStore(): Store {
  console.time('初始化store')
  const store = { ui: new Ui(), workspace: new Workspace() }
  console.timeEnd('初始化store')
  return store
}
export type TStore = ReturnType<typeof createStore>

export { default as Ui } from './ui'
export { default as Project } from './project'
export { default as Workspace } from './workspace'

export * from './base'
