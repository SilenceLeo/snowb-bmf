import { useContext } from 'react'
import { MobXProviderContext } from 'mobx-react'
import {
  TStore,
  Workspace,
  Layout,
  Project,
  Style,
  Font,
  ProjectUi,
  FontStyleConfig,
} from '.'

export default function useStores(): TStore {
  return useContext(MobXProviderContext) as TStore
}

export function useWorkspace(): Workspace {
  const store = useStores()
  return store.workspace
}

export function useLayout(): Layout {
  const store = useStores()
  return store.workspace.currentProject.layout
}

export function useProject(): Project {
  const store = useStores()
  return store.workspace.currentProject
}

export function useStyle(): Style {
  const { style } = useProject()
  return style
}

export function useFont(): Font {
  const { font } = useStyle()
  return font
}

export function useFill(): FontStyleConfig {
  const { fill } = useStyle()
  return fill
}

export function useProjectUi(): ProjectUi {
  const { ui } = useProject()
  return ui
}
