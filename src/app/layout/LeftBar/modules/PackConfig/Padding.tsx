import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Input from '@mui/material/Input'

import GridInput from 'src/app/components/GridInput'

import { useLayout } from 'src/store/hooks'

const Padding: FunctionComponent<unknown> = () => {
  const { padding, setPadding } = useLayout()

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPadding(Number(event.target.value))
  }

  return (
    <GridInput before='Padding:' after='px'>
      <Input
        value={padding}
        fullWidth
        type='number'
        inputProps={{ min: 0 }}
        onChange={handleInput}
      />
    </GridInput>
  )
}

export default observer(Padding)
