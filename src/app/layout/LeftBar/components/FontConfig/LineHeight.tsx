import Input from '@mui/material/Input'
import React, { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput/GridInput'
import { setLineHeight, useFontLineHeight, useFontSize } from 'src/store/legend'

const LineHeight: FunctionComponent = () => {
  const size = useFontSize()
  const lineHeight = useFontLineHeight()

  const handleInput = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    if (size > 0) {
      setLineHeight(Number(event.target.value) / size)
    }
  }

  return (
    <GridInput before='Line Height:' after='px'>
      <Input
        value={Math.round(lineHeight * size)}
        fullWidth
        type='number'
        slotProps={{ input: { min: 1 } }}
        onChange={handleInput}
      />
    </GridInput>
  )
}

export default LineHeight
