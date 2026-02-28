import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import { type FunctionComponent, useCallback } from 'react'
import GradientPicker from 'src/app/components/GradientPicker'
import GradientPresetPicker from 'src/app/components/GradientPresetPicker'
import GridInput from 'src/app/components/GridInput'
import WrappedSketchPicker from 'src/app/components/WrappedSketchPicker'
import {
  type GradientData,
  type GradientPaletteItem,
  GradientType,
  addGradientColor,
  deleteGradientPreset,
  saveGradientPreset,
  setGradientAngle,
  setGradientType,
  updateGradientPalette,
  useGradientPresets,
} from 'src/store/legend'
import type { GradientColor } from 'src/types/style'

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
  const presets = useGradientPresets()

  // Use provided callbacks or default to fill actions
  const handleTypeChange = onTypeChange || setGradientType
  const handleAngleChange = onAngleChange || setGradientAngle
  const handleColorAdd = onColorAdd || addGradientColor
  const handlePaletteUpdate = onPaletteUpdate || updateGradientPalette

  const handleApplyPreset = useCallback(
    (presetPalette: GradientColor[]) => {
      const baseId = Date.now()
      const converted: GradientPaletteItem[] = presetPalette.map(
        (item, index) => ({
          ...item,
          id: baseId + index,
        }),
      )
      handlePaletteUpdate(converted)
    },
    [handlePaletteUpdate],
  )

  const handleSavePreset = useCallback(
    (name: string) => {
      saveGradientPreset(name, palette)
    },
    [palette],
  )

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
      <Box paddingX={2} marginY={4}>
        <Typography variant='subtitle2' sx={{ mb: 1 }}>
          Presets
        </Typography>
        <GradientPresetPicker
          presets={presets}
          onApply={handleApplyPreset}
          onSave={handleSavePreset}
          onDelete={deleteGradientPreset}
        />
      </Box>
    </>
  )
}

export default FormGradient
