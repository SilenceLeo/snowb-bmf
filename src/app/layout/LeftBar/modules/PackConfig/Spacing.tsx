import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Input from '@material-ui/core/Input'

import { useLayout } from 'src/store/hooks'

import GridInput from 'src/app/components/GridInput'

const Spacing: FunctionComponent<unknown> = () => {
  const { spacing, setSpacing } = useLayout()

  return (
    <GridInput before='Spacing:' after='px'>
      <Input
        value={spacing}
        fullWidth
        type='number'
        inputProps={{ min: 0 }}
        onChange={(e) => setSpacing(Number(e.target.value))}
      />
    </GridInput>
  )
}

export default observer(Spacing)
