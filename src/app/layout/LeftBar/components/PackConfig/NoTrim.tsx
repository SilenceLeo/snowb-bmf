import Switch from '@mui/material/Switch'
import { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import { setNoTrim, useNoTrim } from 'src/store/legend'

const NoTrim: FunctionComponent = () => {
  const noTrim = useNoTrim()

  return (
    <GridInput before='Trim:'>
      <Switch
        checked={!noTrim}
        size='small'
        color='default'
        onChange={(e) => setNoTrim(!e.target.checked)}
      />
    </GridInput>
  )
}

export default NoTrim
