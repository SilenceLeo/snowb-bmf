import { FunctionComponent } from 'react'
import Box from '@mui/material/Box'

import MainView from './modules/MainView'
import ProjectTabs from './modules/ProjectTabs'
import ControlerBar from './modules/ControlerBar'
import ImageGlyphList from './modules/ImageGlyphList'

import styles from './WorkSpace.module.css'

const WorkSpace: FunctionComponent<unknown> = () => {
  return (
    <Box className={styles.root}>
      <ProjectTabs />
      <MainView />
      <ControlerBar />
      <ImageGlyphList />
    </Box>
  )
}

export default WorkSpace
