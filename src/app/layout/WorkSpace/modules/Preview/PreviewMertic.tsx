import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { observer } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import FormAdjustMetric from 'src/app/layout/common/FormAdjustMetric'
import { useProject } from 'src/store/hooks'

const GlobalMetric: FunctionComponent<unknown> = () => {
  const project = useProject()
  const { glyphList, ui } = project
  const glyph = glyphList.find((gl) => gl.letter === ui.selectLetter)
  if (!glyph) return null
  const { adjustMetric, letter } = glyph
  const { xAdvance, xOffset, yOffset, setXAdvance, setXOffset, setYOffset } =
    adjustMetric

  return (
    <>
      <Box paddingX={2} marginY={4}>
        <Typography>{`"${letter}" Adjustment`}</Typography>
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
