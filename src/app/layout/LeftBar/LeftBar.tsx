import React, { FunctionComponent } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import Font from './modules/Font'
import Glyphs from './modules/Glyphs'
import PackConfig from './modules/PackConfig'
import GlobalMetric from './modules/GlobalMetric'

const LeftBar: FunctionComponent<unknown> = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.sidebar',
        overflow: 'hidden',
        width: '256px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ bgcolor: 'background.sidebar', boxShadow: 2, p: 2 }}>
        <Typography variant='subtitle2'>Font Config</Typography>
      </Box>
      <Box flex={1} height={0} overflow='hidden auto'>
        <Glyphs />
        <Divider />
        <Font />
        <Divider />
        <PackConfig />
        <Divider />
        <GlobalMetric />
      </Box>
    </Box>
  )
}

export default LeftBar
