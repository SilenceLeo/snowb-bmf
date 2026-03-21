import Checkbox from '@mui/material/Checkbox'
import { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import { setFixedSize, useAutoLayout, useFixedSize } from 'src/store/legend'

const FixedSize: FunctionComponent = () => {
  const auto = useAutoLayout()
  const fixedSize = useFixedSize()

  return (
    <GridInput before='Fixed Size:'>
      <Checkbox
        checked={fixedSize}
        size='small'
        color='default'
        onChange={(e) => setFixedSize(e.target.checked)}
        disabled={auto}
      />
    </GridInput>
  )
}

export default FixedSize
