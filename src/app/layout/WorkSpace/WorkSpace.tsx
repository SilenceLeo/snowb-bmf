import Box from '@mui/material/Box'
import { FunctionComponent } from 'react'

import ControllerBar from './modules/ControllerBar'
import ImageGlyphList from './modules/ImageGlyphList'
import MainView from './modules/MainView'
import ProjectTabs from './modules/ProjectTabs'

const WorkSpace: FunctionComponent<unknown> = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: 0,
      }}
    >
      <ProjectTabs />
      <MainView />
      <ControllerBar />
      <ImageGlyphList />
    </Box>
  )
}

export default WorkSpace
