import Tabs from '@mui/material/Tabs'
import { useTheme } from '@mui/material/styles'
import { observer } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import { useWorkspace } from 'src/store/hooks'

import ProjectTab from './ProjectTab'

const ProjectTabs: FunctionComponent<unknown> = () => {
  const { palette, shadows } = useTheme()
  const workSpace = useWorkspace()
  const {
    addProject,
    selectProject,
    removeProject,
    setProjectName,
    namedList,
    activeId,
  } = workSpace

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
            onRename={setProjectName}
            onRemove={handleRemove}
          />
        )
      })}
    </Tabs>
  )
}

export default observer(ProjectTabs)
