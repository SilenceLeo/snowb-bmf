import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Checkbox from '@material-ui/core/Checkbox'

import { useLayout } from 'src/store/hooks'

import GridInput from 'src/app/components/GridInput'

const Power: FunctionComponent<unknown> = () => {
  const { power, setPower } = useLayout()

  return (
    <GridInput before='Power of 2:'>
      <Checkbox
        checked={power}
        size='small'
        color='default'
        onChange={(e) => setPower(e.target.checked)}
      />
    </GridInput>
  )
}

export default observer(Power)
