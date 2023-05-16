import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'

import GridInput from 'src/app/components/GridInput'
import Box from '@mui/material/Box'
import Input from '@mui/material/Input'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { PatternTexture, Repetition } from 'src/store'

import FileSelector from './FileSelector'

interface FormImageProps {
  patternTexture: PatternTexture
  scale: number
  src: string
  // onChangeImage(buffer: ArrayBuffer): void
  // onChangeScale(scale: number): void
}

const FormImage: FunctionComponent<FormImageProps> = (
  props: FormImageProps,
) => {
  const { patternTexture } = props
  const { src, scale, repetition, setRepetition, setScale, setImage } =
    patternTexture

  return (
    <>
      <Box paddingX={2} marginY={4}>
        <GridInput
          component='div'
          before='Scale:'
          after={<FileSelector src={src} onChange={setImage} />}
        >
          <Input
            value={scale}
            fullWidth
            type='number'
            inputProps={{ min: 0.01, step: 0.1 }}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </GridInput>
      </Box>
      <Box paddingX={2} marginY={4}>
        <GridInput before='Repeat:' after={repetition}>
          <Select
            value={repetition}
            onChange={(e) => setRepetition(e.target.value as Repetition)}
            displayEmpty
            fullWidth
            variant='standard'
          >
            <MenuItem value='repeat'>Repeat</MenuItem>
            <MenuItem value='repeat-x'>Repeat-X</MenuItem>
            <MenuItem value='repeat-y'>Repeat-Y</MenuItem>
            <MenuItem value='no-repeat'>No Repeat</MenuItem>
          </Select>
        </GridInput>
      </Box>
    </>
  )
}

export default observer(FormImage)
