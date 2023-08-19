import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { observer } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import { useFill } from 'src/store/hooks'

import FormFill from '../../../common/FormFill'

const Fill: FunctionComponent<unknown> = () => {
  const fill = useFill()
  return (
    <>
      <Box
        sx={{
          px: 2,
          my: 4,
        }}
      >
        <Typography>Fill</Typography>
      </Box>
      <FormFill config={fill} />
    </>
  )
}

export default observer(Fill)
