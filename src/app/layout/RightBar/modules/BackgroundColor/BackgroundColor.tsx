import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { observer } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import { useStyle } from 'src/store/hooks'

import FormColor from '../../../common/FormColor'

const BackgroundColor: FunctionComponent<unknown> = () => {
  const { bgColor, setBgColor } = useStyle()

  return (
    <>
      <Box
        component='label'
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          my: 4,
        }}
      >
        <Typography>Background Color</Typography>
      </Box>
      <Box
        sx={{
          px: 2,
          my: 4,
        }}
      >
        <FormColor color={bgColor || ''} onChange={setBgColor} />
      </Box>
    </>
  )
}

export default observer(BackgroundColor)
