import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useProject } from 'src/store/hooks'

import FormAdjustMetric from 'src/app/layout/common/FormAdjustMetric'

const GlobalMetric: FunctionComponent<unknown> = () => {
  const { globalAdjustMetric } = useProject()
  const { xAdvance, xOffset, yOffset, setXAdvance, setXOffset, setYOffset } =
    globalAdjustMetric

  return (
    <>
      <Box sx={{ px: 2, my: 4 }}>
        <Typography>Global Metric Adjustments</Typography>
      </Box>
      <FormAdjustMetric
        xAdvance={xAdvance}
        xOffset={xOffset}
        yOffset={yOffset}
        setXAdvance={setXAdvance}
        setXOffset={setXOffset}
        setYOffset={setYOffset}
      />
    </>
  )
}

export default observer(GlobalMetric)
