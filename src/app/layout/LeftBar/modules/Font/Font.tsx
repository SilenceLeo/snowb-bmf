import React, { FunctionComponent } from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import FontFamily from './FontFamily'
import FontSize from './FontSize'
import LineHeight from './LineHeight'

const Font: FunctionComponent<unknown> = () => {
  return (
    <>
      <Box paddingX={2} marginY={4}>
        <Typography>Font</Typography>
      </Box>
      <Box paddingX={2} marginY={4}>
        <FontFamily />
      </Box>
      <Box paddingX={2} marginY={4}>
        <FontSize />
      </Box>
      <Box paddingX={2} marginY={4}>
        <LineHeight />
      </Box>
    </>
  )
}

export default Font
