import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Input from '@material-ui/core/Input'

import GridInput from 'src/app/components/GridInput/GridInput'

import { useFont } from 'src/store/hooks'

const LineHeight: FunctionComponent<unknown> = () => {
  const { lineHeight, setLineHeight } = useFont()

  const handleInput = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setLineHeight(Number(event.target.value))
  }

  return (
    <GridInput before='Line Height:' after='multiple'>
      <Input
        value={lineHeight}
        fullWidth
        type='number'
        inputProps={{ min: 0.5, step: 0.1 }}
        onChange={handleInput}
      />
    </GridInput>
  )
}

export default observer(LineHeight)
