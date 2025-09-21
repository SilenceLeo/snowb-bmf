import Input from '@mui/material/Input'
import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import { useLayout } from 'src/store/hooks'

const Spacing: FunctionComponent<unknown> = () => {
  const { spacing, setSpacing } = useLayout()

  return (
    <GridInput before='Spacing:' after='px'>
      <Input
        value={spacing}
        fullWidth
        type='number'
        slotProps={{ input: { min: 0 } }}
        onChange={(e) => setSpacing(Number(e.target.value))}
      />
    </GridInput>
  )
}

export default observer(Spacing)
