import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Checkbox from '@material-ui/core/Checkbox'

import { useStyle } from 'src/store/hooks'

import GridInput from 'src/app/components/GridInput'

const FullHeight: FunctionComponent<unknown> = () => {
  const { fullHeight, setFullHeight } = useStyle()

  return (
    <GridInput before='Full Height:'>
      <Checkbox
        checked={fullHeight}
        size='small'
        color='default'
        onChange={(e) => setFullHeight(e.target.checked)}
      />
    </GridInput>
  )
}

export default observer(FullHeight)
