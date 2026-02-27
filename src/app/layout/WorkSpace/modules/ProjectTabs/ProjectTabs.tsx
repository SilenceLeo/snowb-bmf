import Tabs from '@mui/material/Tabs'
import { useTheme } from '@mui/material/styles'
import React, { FunctionComponent, useCallback, useState } from 'react'
import {
  setWorkspaceProjectName,
  useActiveProjectId,
  useProjectList,
} from 'src/store/legend'
import {
  createNewLegendProject,
  removeLegendProject,
  switchLegendProject,
} from 'src/utils/persistence'

import ProjectTab from './ProjectTab'

const ProjectTabs: FunctionComponent = () => {
  const { palette, shadows } = useTheme()
  const namedList = useProjectList()
  const activeId = useActiveProjectId()
  const [isSwitching, setIsSwitching] = useState(false)

  const handleChange = useCallback(async (_e: unknown, value: number) => {
    setIsSwitching(true)
    try {
      await switchLegendProject(value)
    } finally {
      setIsSwitching(false)
    }
  }, [])

  const handleRemove = useCallback(
    async (
      _e: React.MouseEvent<SVGSVGElement, MouseEvent>,
      value?: number,
    ) => {
      if (typeof value !== 'undefined') {
        setIsSwitching(true)
        try {
          await removeLegendProject(value)
        } finally {
          setIsSwitching(false)
        }
      }
    },
    [],
  )

  const handleDoubleClick = useCallback(async () => {
    setIsSwitching(true)
    try {
      await createNewLegendProject()
    } finally {
      setIsSwitching(false)
    }
  }, [])

  const handleRename = useCallback((name: string, id: number): void => {
    setWorkspaceProjectName(id, name)
  }, [])

  return (
    <Tabs
      sx={{
        minHeight: 'auto',
        width: '100%',
        boxShadow: shadows[2],
        background: palette.background.sidebar,
        position: 'relative',
        zIndex: 1,
        ...(isSwitching && { pointerEvents: 'none', opacity: 0.6 }),
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
