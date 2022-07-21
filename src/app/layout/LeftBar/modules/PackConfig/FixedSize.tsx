import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Checkbox from '@material-ui/core/Checkbox'

import { useLayout } from 'src/store/hooks'

import GridInput from 'src/app/components/GridInput'

const FixedSize: FunctionComponent<unknown> = () => {
  const { autoPack, fixedSize, setFixedSize } = useLayout()

  return (
    <GridInput before='Fixed Size:'>
      <Checkbox
        checked={fixedSize}
        size='small'
        color='default'
        onChange={(e) => setFixedSize(e.target.checked)}
        disabled={autoPack}
      />
    </GridInput>
  )
}

export default observer(FixedSize)
