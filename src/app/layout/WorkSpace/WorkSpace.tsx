import React, { FunctionComponent } from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import MainView from './modules/MainView'
import ProjectTabs from './modules/ProjectTabs'
import ControlerBar from './modules/ControlerBar'
import ImageGlyphList from './modules/ImageGlyphList'

const useStyles = makeStyles(({ palette, shadows }) =>
  createStyles({
    root: {
      position: 'relative',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: 0,
    },
    tabsRoot: {
      minHeight: 'auto',
      width: '100%',
      boxShadow: shadows[2],
      background: palette.background.sidebar,
      position: 'relative',
      zIndex: 1,
    },
    tabRoot: {
      minHeight: 'auto',
      minWidth: 'auto',
      maxWidth: 'none',
      height: '34px',
      color: 'rgba(255,255,255,0.5)',
      borderRight: `1px solid ${palette.background.default}`,
      textTransform: 'none',
    },
    tabSelected: {
      background: palette.background.default,
    },
    tabWrapper: {
      color: '#FFF',
    },
  }),
)

const WorkSpace: FunctionComponent<unknown> = () => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <ProjectTabs />
      <MainView />
      <ControlerBar />
      <ImageGlyphList />
    </Box>
  )
}

export default WorkSpace
