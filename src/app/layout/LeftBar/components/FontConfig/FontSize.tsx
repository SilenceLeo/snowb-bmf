import Input from '@mui/material/Input'
import React, { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput/GridInput'
import { setFontSize, useFontSize } from 'src/store/legend'

const FontSize: FunctionComponent = () => {
  const size = useFontSize()

  const handleInput = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setFontSize(Number(event.target.value))
  }

  return (
    <GridInput before='Font Size:' after='px'>
      <Input
        value={size}
        fullWidth
        type='number'
        slotProps={{ input: { min: 1 } }}
        onChange={handleInput}
      />
    </GridInput>
  )
}

export default FontSize
