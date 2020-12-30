import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Input from '@material-ui/core/Input'

import GridInput from 'src/app/components/GridInput'

import { useLayout } from 'src/store/hooks'

const PackHeight: FunctionComponent<unknown> = () => {
  const { height, auto, fixedSize, setHeight } = useLayout()

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setHeight(Number(event.target.value))
  }

  return (
    <GridInput before={fixedSize ? 'Height:' : 'Max Height:'} after='px'>
      <Input
        value={height}
        fullWidth
        type='number'
        inputProps={{ min: 0 }}
        onChange={handleInput}
        disabled={auto}
      />
    </GridInput>
  )
}

export default observer(PackHeight)
