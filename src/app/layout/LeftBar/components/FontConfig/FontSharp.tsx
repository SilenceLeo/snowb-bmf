import Slider from '@mui/material/Slider'
import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput/GridInput'
import { useFont } from 'src/store/hooks'

const FontSharp: FunctionComponent<unknown> = () => {
  const { sharp, setSharp, mainFont } = useFont()

  const handleInput = (_event: Event, value: number | number[]): void => {
    setSharp(value as unknown as number)
  }

  return (
    <GridInput
      sx={!mainFont ? { opacity: 0.5 } : {}}
      before='Sharp:'
      after={`${sharp}%`}
    >
      <Slider value={sharp} onChange={handleInput} disabled={!mainFont} />
    </GridInput>
  )
}

export default observer(FontSharp)
