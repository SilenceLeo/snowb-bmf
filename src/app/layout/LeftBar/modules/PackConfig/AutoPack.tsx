import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Checkbox from '@mui/material/Checkbox'

import { useLayout } from 'src/store/hooks'

import GridInput from 'src/app/components/GridInput'

const AutoPack: FunctionComponent<unknown> = () => {
  const { auto, setAuto } = useLayout()

  return (
    <GridInput before='Auto Pack:'>
      <Checkbox
        checked={auto}
        size='small'
        color='default'
        onChange={(e) => setAuto(e.target.checked)}
      />
    </GridInput>
  )
}

export default observer(AutoPack)
