import React, { FunctionComponent } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import FontFamily from './FontFamily'
import FontSize from './FontSize'
import Sharp from './Sharp'
import LineHeight from './LineHeight'

const Font: FunctionComponent<unknown> = () => {
  return (
    <>
      <Box sx={{ px: 2, my: 4 }}>
        <Typography>Font</Typography>
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <FontFamily />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <FontSize />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <LineHeight />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <Sharp />
      </Box>
    </>
  )
}

export default Font
