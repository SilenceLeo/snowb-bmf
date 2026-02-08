import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { FunctionComponent } from 'react'
import GradientPicker from 'src/app/components/GradientPicker'
import GridInput from 'src/app/components/GridInput'
import WrappedSketchPicker from 'src/app/components/WrappedSketchPicker'
import {
  type GradientData,
  type GradientPaletteItem,
  GradientType,
  addGradientColor,
  setGradientAngle,
  setGradientType,
  updateGradientPalette,
} from 'src/store/legend'

import FormAngle from '../FormAngle'

interface FormGradientProps {
  gradient: GradientData
  // Optional action overrides (for stroke mode)
  onTypeChange?: (type: number) => void
  onAngleChange?: (angle: number) => void
  onColorAdd?: (offset: number, color: string) => void
  onPaletteUpdate?: (palette: GradientPaletteItem[]) => void
}

const FormGradient: FunctionComponent<FormGradientProps> = ({
  gradient,
  onTypeChange,
  onAngleChange,
  onColorAdd,
  onPaletteUpdate,
}) => {
  const { type, angle, palette } = gradient

  // Use provided callbacks or default to fill actions
  const handleTypeChange = onTypeChange || setGradientType
  const handleAngleChange = onAngleChange || setGradientAngle
  const handleColorAdd = onColorAdd || addGradientColor
  const handlePaletteUpdate = onPaletteUpdate || updateGradientPalette

  return (
    <>
      <Box paddingX={2} marginY={4}>
        <FormAngle angle={angle} onChange={handleAngleChange} />
      </Box>

      <Box paddingX={2} marginY={4}>
        <GridInput before='Type:' component='div' childrenWidth={8}>
          <RadioGroup
            row
            name='type'
            value={type}
            onChange={(e) => handleTypeChange(Number(e.target.value))}
            style={{ flexWrap: 'nowrap' }}
          >
            <FormControlLabel
              value={GradientType.LINEAR}
              control={<Radio size='small' color='default' />}
              label='Linear'
            />
            <FormControlLabel
              value={GradientType.RADIAL}
              control={<Radio size='small' color='default' />}
              label='Radial'
            />
          </RadioGroup>
        </GridInput>
      </Box>
      <Box paddingX={2} marginY={4}>
        <GradientPicker
          palette={palette}
          onAdd={(e) => handleColorAdd(e.offset, e.color)}
          onUpdate={(newPalette: GradientPaletteItem[]) =>
            handlePaletteUpdate(newPalette)
          }
        >
          <WrappedSketchPicker />
        </GradientPicker>
      </Box>
    </>
  )
}

export default FormGradient
