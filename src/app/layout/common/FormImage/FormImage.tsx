import Box from '@mui/material/Box'
import Input from '@mui/material/Input'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import {
  type PatternTextureData,
  Repetition,
  setPatternImage,
  setPatternRepetition,
  setPatternScale,
} from 'src/store/legend'

import FileSelector from './FileSelector'

interface FormImageProps {
  patternTexture: PatternTextureData
  scale: number
  src: string
  // Optional action overrides (for stroke mode)
  onImageChange?: (buffer: ArrayBuffer) => void
  onRepetitionChange?: (repetition: Repetition) => void
  onScaleChange?: (scale: number) => void
}

const FormImage: FunctionComponent<FormImageProps> = ({
  patternTexture,
  scale,
  src,
  onImageChange,
  onRepetitionChange,
  onScaleChange,
}) => {
  const { repetition } = patternTexture

  // Use provided callbacks or default to fill actions
  const handleImageChange = onImageChange || setPatternImage
  const handleRepetitionChange = onRepetitionChange || setPatternRepetition
  const handleScaleChange = onScaleChange || setPatternScale

  return (
    <>
      <Box paddingX={2} marginY={4}>
        <GridInput
          component='div'
          before='Scale:'
          after={<FileSelector src={src} onChange={handleImageChange} />}
        >
          <Input
            value={scale}
            fullWidth
            type='number'
            slotProps={{ input: { min: 0.01, step: 0.1 } }}
            onChange={(e) => handleScaleChange(Number(e.target.value))}
          />
        </GridInput>
      </Box>
      <Box paddingX={2} marginY={4}>
        <GridInput before='Repeat:' after={repetition}>
          <Select
            value={repetition}
            onChange={(e) =>
              handleRepetitionChange(e.target.value as Repetition)
            }
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

export default FormImage
