import Slider from '@mui/material/Slider'
import { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput/GridInput'
import { setSharp, useFontResources, useFontSharp } from 'src/store/legend'

const FontSharp: FunctionComponent = () => {
  const sharp = useFontSharp()
  const fonts = useFontResources()
  const hasFont = fonts.length > 0

  const handleInput = (_event: Event, value: number | number[]): void => {
    setSharp(value as number)
  }

  return (
    <GridInput
      sx={!hasFont ? { opacity: 0.5 } : {}}
      before='Sharp:'
      after={`${sharp}%`}
    >
      <Slider value={sharp} onChange={handleInput} disabled={!hasFont} />
    </GridInput>
  )
}

export default FontSharp
