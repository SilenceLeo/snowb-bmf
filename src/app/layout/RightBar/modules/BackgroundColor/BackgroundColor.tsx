import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { useStyle } from 'src/store/hooks'
import FormColor from '../../../common/FormColor'

const BackgroundColor: FunctionComponent<unknown> = () => {
  const { bgColor, setBgColor } = useStyle()

  return (
    <>
      <Box
        component='label'
        display='flex'
        alignItems='center'
        paddingX={2}
        marginY={4}
      >
        <Typography>Background Color</Typography>
      </Box>
      <Box paddingX={2} marginY={4}>
        <FormColor color={bgColor || ''} onChange={setBgColor} />
      </Box>
    </>
  )
}

export default observer(BackgroundColor)
