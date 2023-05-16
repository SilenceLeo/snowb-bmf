import React, { FunctionComponent } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import Fill from './modules/Fill'
import Stroke from './modules/Stroke'
import Shadow from './modules/Shadow'
import BackgroundColor from './modules/BackgroundColor'

const RightBar: FunctionComponent<unknown> = () => {
  return (
    <Box
      sx={{
        overflow: 'hidden',
        width: '300px',
        bgcolor: 'background.sidebar',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ bgcolor: 'background.sidebar', boxShadow: 2, p: 2 }}>
        <Typography variant='subtitle2'>Style Config</Typography>
      </Box>
      <Box flex={1} height={0} overflow='hidden auto'>
        <Fill />
        <Divider />
        <Stroke />
        <Divider />
        <Shadow />
        <Divider />
        <BackgroundColor />
      </Box>
    </Box>
  )
}

export default RightBar
