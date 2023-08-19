import Checkbox from '@mui/material/Checkbox'
import { observer } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import { useLayout } from 'src/store/hooks'

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
