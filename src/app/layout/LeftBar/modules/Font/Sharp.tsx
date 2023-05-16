import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Slider from '@mui/material/Slider'

import GridInput from 'src/app/components/GridInput/GridInput'

import { useFont } from 'src/store/hooks'

const Sharp: FunctionComponent<unknown> = () => {
  const { sharp, setSharp, mainFont } = useFont()

  const handleInput = (event: Event, value: number | number[]): void => {
    setSharp(value as unknown as number)
  }

  return (
    <GridInput
      style={!mainFont ? { opacity: 0.5 } : undefined}
      before='Sharp:'
      after={`${sharp}%`}
    >
      <Slider value={sharp} onChange={handleInput} disabled={!mainFont} />
    </GridInput>
  )
}

export default observer(Sharp)
