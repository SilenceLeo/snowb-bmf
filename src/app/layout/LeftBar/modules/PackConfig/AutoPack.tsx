import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Checkbox from '@material-ui/core/Checkbox'

import { useLayout } from 'src/store/hooks'

import GridInput from 'src/app/components/GridInput'

const AutoPack: FunctionComponent<unknown> = () => {
  const { autoPack, setAutoPack } = useLayout()

  return (
    <GridInput before='Auto Pack:'>
      <Checkbox
        checked={autoPack}
        size='small'
        color='default'
        onChange={(e) => setAutoPack(e.target.checked)}
      />
    </GridInput>
  )
}

export default observer(AutoPack)
