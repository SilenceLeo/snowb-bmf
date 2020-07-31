import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import { useWorkspace } from 'src/store/hooks'
import ProjectTab from './ProjectTab'

const useStyles = makeStyles(({ palette, shadows }) =>
  createStyles({
    root: {
      minHeight: 'auto',
      width: '100%',
      boxShadow: shadows[2],
      background: palette.background.sidebar,
      position: 'relative',
      zIndex: 1,
    },
  }),
)

const ProjectTabs: FunctionComponent<unknown> = () => {
  const classes = useStyles()
  const workSpace = useWorkspace()
  const {
    addProject,
    selectProject,
    removeProject,
    setProjectName,
    namedList,
    activeId,
  } = workSpace

  const handleChange = (e: unknown, value: number): void => {
    selectProject(value)
  }

  const handleRemove = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    value?: number,
  ): void => {
    if (typeof value !== 'undefined') removeProject(value)
  }

  const handleDoubleClick = (): void => {
    addProject()
  }

  return (
    <Tabs
      classes={classes}
      value={activeId}
      onChange={handleChange}
      indicatorColor='primary'
      textColor='primary'
      variant='scrollable'
      scrollButtons='off'
      selectionFollowsFocus
      TabIndicatorProps={{ hidden: true }}
      onDoubleClick={handleDoubleClick}
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
