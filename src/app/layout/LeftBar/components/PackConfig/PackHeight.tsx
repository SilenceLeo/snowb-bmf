import Input from '@mui/material/Input'
import React, { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import {
  setHeight,
  useAutoLayout,
  useFixedSize,
  useLayoutHeight,
} from 'src/store/legend'

const PackHeight: FunctionComponent = () => {
  const height = useLayoutHeight()
  const auto = useAutoLayout()
  const fixedSize = useFixedSize()

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setHeight(Number(event.target.value))
  }

  return (
    <GridInput before={fixedSize ? 'Height:' : 'Max Height:'} after='px'>
      <Input
        value={height}
        fullWidth
        type='number'
        slotProps={{ input: { min: 0 } }}
        onChange={handleInput}
        disabled={auto}
      />
    </GridInput>
  )
}

export default PackHeight
