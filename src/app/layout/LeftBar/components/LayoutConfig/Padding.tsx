import Input from '@mui/material/Input'
import React, { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import { setPadding, usePadding } from 'src/store/legend'

const Padding: FunctionComponent = () => {
  const padding = usePadding()

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPadding(Number(event.target.value))
  }

  return (
    <GridInput before='Padding:' after='px'>
      <Input
        value={padding}
        fullWidth
        type='number'
        slotProps={{ input: { min: 0 } }}
        onChange={handleInput}
      />
    </GridInput>
  )
}

export default Padding
