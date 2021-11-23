import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { useProject } from 'src/store/hooks'

import FormAdjustMetric from 'src/app/layout/common/FormAdjustMetric'

const GlobalMetric: FunctionComponent<unknown> = () => {
  const { globalAdjustMetric } = useProject()
  const { xAdvance, xOffset, yOffset, setXAdvance, setXOffset, setYOffset } =
    globalAdjustMetric

  return (
    <>
      <Box paddingX={2} marginY={4}>
        <Typography>Global Metric Adjustment</Typography>
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
