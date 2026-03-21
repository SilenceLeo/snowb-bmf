import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Box from '@mui/material/Box'
import { FunctionComponent } from 'react'
import { usePackFailed, useShowPreview } from 'src/store/legend'

import PackView from '../PackView'
import Preview from '../Preview'

const MainView: FunctionComponent = () => {
  const showPreview = useShowPreview()
  const packFailed = usePackFailed()

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {packFailed ? (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            zIndex: 10,
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '12px',
            padding: '2px',
            animationName: 'slideDown',
            animationDuration: '300ms',
            bgcolor: 'error.main',
            '@keyframes slideDown': {
              from: {
                opacity: 0,
                transform: 'translate(0, -100%)',
              },
              to: {
                opacity: 1,
                transform: 'translate(0, 0)',
              },
            },
          }}
        >
          <ErrorOutlineIcon sx={{ mr: '5px' }} fontSize='inherit' />
          Packaging failed, try to increase the size of the package please.
        </Box>
      ) : null}
      {showPreview ? <Preview /> : <PackView />}
    </Box>
  )
}

export default MainView
