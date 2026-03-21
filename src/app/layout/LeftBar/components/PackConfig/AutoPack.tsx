import Checkbox from '@mui/material/Checkbox'
import { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import { setAuto, useAutoLayout } from 'src/store/legend'

const AutoPack: FunctionComponent = () => {
  const auto = useAutoLayout()

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

export default AutoPack
