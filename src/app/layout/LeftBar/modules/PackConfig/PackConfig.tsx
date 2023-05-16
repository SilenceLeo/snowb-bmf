import React, { FunctionComponent } from 'react'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import Padding from './Padding'
import Spacing from './Spacing'
import AutoPack from './AutoPack'
import FixedSize from './FixedSize'
import PackWidth from './PackWidth'
import PackHeight from './PackHeight'

const PackConfig: FunctionComponent<unknown> = () => {
  return (
    <>
      <Box sx={{ px: 2, my: 4 }}>
        <Typography>Layout</Typography>
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <Padding />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <Spacing />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <AutoPack />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <FixedSize />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <PackWidth />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <PackHeight />
      </Box>
    </>
  )
}

export default PackConfig
