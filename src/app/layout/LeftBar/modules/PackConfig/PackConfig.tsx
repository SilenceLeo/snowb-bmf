import React, { FunctionComponent } from 'react'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import Padding from './Padding'
import Spacing from './Spacing'
import AutoPack from './AutoPack'
import FixedSize from './FixedSize'
import PackWidth from './PackWidth'
import PackHeight from './PackHeight'

const PackConfig: FunctionComponent<unknown> = () => {
  return (
    <>
      <Box paddingX={2} marginY={4}>
        <Typography>Layout</Typography>
      </Box>
      <Box paddingX={2} marginY={4}>
        <Padding />
      </Box>
      <Box paddingX={2} marginY={4}>
        <Spacing />
      </Box>
      <Box paddingX={2} marginY={4}>
        <AutoPack />
      </Box>
      <Box paddingX={2} marginY={4}>
        <FixedSize />
      </Box>
      <Box paddingX={2} marginY={4}>
        <PackWidth />
      </Box>
      <Box paddingX={2} marginY={4}>
        <PackHeight />
      </Box>
    </>
  )
}

export default PackConfig
