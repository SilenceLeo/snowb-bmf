import Tabs from '@mui/material/Tabs'
import { useTheme } from '@mui/material/styles'
import React, { FunctionComponent } from 'react'
import {
  addProject,
  removeProject,
  selectProject,
  setWorkspaceProjectName,
  useActiveProjectId,
  useProjectList,
} from 'src/store/legend'

import ProjectTab from './ProjectTab'

const ProjectTabs: FunctionComponent = () => {
  const { palette, shadows } = useTheme()
  const namedList = useProjectList()
  const activeId = useActiveProjectId()

  const handleChange = (_e: unknown, value: number): void => {
    selectProject(value)
  }

  const handleRemove = (
    _e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    value?: number,
  ): void => {
    if (typeof value !== 'undefined') {
      removeProject(value)
    }
  }

  const handleDoubleClick = (): void => {
    addProject()
  }

  const handleRename = (name: string, id: number): void => {
    setWorkspaceProjectName(id, name)
  }

  return (
    <Tabs
      sx={{
        minHeight: 'auto',
        width: '100%',
        boxShadow: shadows[2],
        background: palette.background.sidebar,
        position: 'relative',
        zIndex: 1,
      }}
      value={activeId}
      onChange={handleChange}
      indicatorColor='primary'
      textColor='primary'
      variant='scrollable'
      scrollButtons={false}
      selectionFollowsFocus
      onDoubleClick={handleDoubleClick}
      slotProps={{
        indicator: { hidden: true },
      }}
    >
      {namedList.map((item) => {
        return (
          <ProjectTab
            useRemove={namedList.length > 1}
            name={item.name}
            value={item.id}
            key={item.id}
            onRename={handleRename}
            onRemove={handleRemove}
          />
        )
      })}
    </Tabs>
  )
}

export default ProjectTabs
