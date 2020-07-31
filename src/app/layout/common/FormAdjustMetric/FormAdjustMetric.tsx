import React, { FunctionComponent } from 'react'
import Box from '@material-ui/core/Box'
import Input from '@material-ui/core/Input'
import GridInput from 'src/app/components/GridInput'

interface SetHandle {
  (value: number): void
}

interface FormAdjustMetricProps {
  xAdvance: number
  xOffset: number
  yOffset: number
  setXAdvance: SetHandle
  setXOffset: SetHandle
  setYOffset: SetHandle
}

const FormAdjustMetric: FunctionComponent<FormAdjustMetricProps> = (
  props: FormAdjustMetricProps,
) => {
  const {
    xAdvance,
    xOffset,
    yOffset,
    setXAdvance,
    setXOffset,
    setYOffset,
  } = props

  const getHandle = (handleSet: SetHandle) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => handleSet(Number(e.target.value))

  return (
    <>
      <Box paddingX={2} marginY={4}>
        <GridInput before='xAdvance:' after='px'>
          <Input
            value={xAdvance}
            fullWidth
            type='number'
            onChange={getHandle(setXAdvance)}
          />
        </GridInput>
      </Box>
      <Box paddingX={2} marginY={4}>
        <GridInput before='xOffset:' after='px'>
          <Input
            value={xOffset}
            fullWidth
            type='number'
            onChange={getHandle(setXOffset)}
          />
        </GridInput>
      </Box>
      <Box paddingX={2} marginY={4}>
        <GridInput before='yOffset:' after='px'>
          <Input
            value={yOffset}
            fullWidth
            type='number'
            onChange={getHandle(setYOffset)}
          />
        </GridInput>
      </Box>
    </>
  )
}

export default FormAdjustMetric
