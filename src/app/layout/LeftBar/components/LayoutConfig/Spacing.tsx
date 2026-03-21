import Input from '@mui/material/Input'
import { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import { setSpacing, useSpacing } from 'src/store/legend'

const Spacing: FunctionComponent = () => {
  const spacing = useSpacing()

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

export default Spacing
