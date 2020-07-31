import React, { FunctionComponent } from 'react'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import Padding from './Padding'
import Spacing from './Spacing'
// import Power from './Power'

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
      {/* <Box paddingX={2} marginY={4}>
        <Power />
      </Box> */}
    </>
  )
}

export default PackConfig
