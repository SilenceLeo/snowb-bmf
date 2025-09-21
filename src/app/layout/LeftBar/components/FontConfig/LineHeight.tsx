import Input from '@mui/material/Input'
import { observer } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput/GridInput'
import { useFont } from 'src/store/hooks'

const LineHeight: FunctionComponent<unknown> = () => {
  const { size, lineHeight, setLineHeight } = useFont()

  const handleInput = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setLineHeight(Number(event.target.value) / size)
  }

  return (
    <GridInput before='Line Height:' after='px'>
      <Input
        value={Math.round(lineHeight * size)}
        fullWidth
        type='number'
        slotProps={{ input: { min: 1 } }}
        onChange={handleInput}
      />
    </GridInput>
  )
}

export default observer(LineHeight)
