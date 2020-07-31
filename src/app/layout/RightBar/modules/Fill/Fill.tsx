import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { useFill } from 'src/store/hooks'
import FormFill from '../../../common/FormFill'

const Fill: FunctionComponent<unknown> = () => {
  const fill = useFill()
  return (
    <>
      <Box paddingX={2} marginY={4}>
        <Typography>Fill</Typography>
      </Box>
      <FormFill config={fill} />
    </>
  )
}

export default observer(Fill)
