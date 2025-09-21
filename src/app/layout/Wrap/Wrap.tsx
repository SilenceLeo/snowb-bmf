import Box from '@mui/material/Box'
import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'

import LeftBar from '../LeftBar'
import RightBar from '../RightBar'
import TitleBar from '../TitleBar'
import WorkSpace from '../WorkSpace'
import UpdateToast from './UpdateToast'

const Wrap: FunctionComponent<unknown> = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TitleBar />
      <UpdateToast />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          position: 'relative',
          height: 0,
          overflow: 'hidden',
        }}
      >
        <LeftBar />
        <WorkSpace />
        <RightBar />
      </Box>
    </Box>
  )
}

export default observer(Wrap)
