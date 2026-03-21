import Input from '@mui/material/Input'
import React, { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import {
  setWidth,
  useAutoLayout,
  useFixedSize,
  useLayoutWidth,
} from 'src/store/legend'

const PackWidth: FunctionComponent = () => {
  const width = useLayoutWidth()
  const auto = useAutoLayout()
  const fixedSize = useFixedSize()

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setWidth(Number(event.target.value))
  }

  return (
    <GridInput before={fixedSize ? 'Width:' : 'Max Width:'} after='px'>
      <Input
        value={width}
        fullWidth
        type='number'
        slotProps={{ input: { min: 0 } }}
        onChange={handleInput}
        disabled={auto}
      />
    </GridInput>
  )
}

export default PackWidth
