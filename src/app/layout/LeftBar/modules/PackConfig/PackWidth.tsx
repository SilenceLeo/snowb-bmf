import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Input from '@material-ui/core/Input'

import GridInput from 'src/app/components/GridInput'

import { useLayout } from 'src/store/hooks'

const PackWidth: FunctionComponent<unknown> = () => {
  const { width, autoPack, fixedSize, setWidth } = useLayout()

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setWidth(Number(event.target.value))
  }

  return (
    <GridInput before={fixedSize ? 'Width:' : 'Max Width:'} after='px'>
      <Input
        value={width}
        fullWidth
        type='number'
        inputProps={{ min: 0 }}
        onChange={handleInput}
        disabled={autoPack}
      />
    </GridInput>
  )
}

export default observer(PackWidth)
