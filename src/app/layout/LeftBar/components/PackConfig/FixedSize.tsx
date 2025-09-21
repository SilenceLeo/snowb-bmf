import Checkbox from '@mui/material/Checkbox'
import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import { useLayout } from 'src/store/hooks'

const FixedSize: FunctionComponent<unknown> = () => {
  const { auto, fixedSize, setFixedSize } = useLayout()

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

export default observer(FixedSize)
