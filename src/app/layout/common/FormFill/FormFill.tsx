import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { FunctionComponent } from 'react'
import {
  FillType,
  type GradientData,
  type GradientPaletteItem,
  type PatternTextureData,
  type Repetition,
} from 'src/store/legend'

import FormColor from '../FormColor'
import FormGradient from '../FormGradient'
import FormImage from '../FormImage'

interface FormFillProps {
  type: FillType
  color: string
  gradient: GradientData
  patternTexture: PatternTextureData
  onTypeChange: (type: FillType) => void
  onColorChange: (color: string) => void
  // Gradient action overrides (for stroke mode)
  onGradientTypeChange?: (type: number) => void
  onGradientAngleChange?: (angle: number) => void
  onGradientColorAdd?: (offset: number, color: string) => void
  onGradientPaletteUpdate?: (palette: GradientPaletteItem[]) => void
  // Pattern texture action overrides (for stroke mode)
  onPatternImageChange?: (buffer: ArrayBuffer) => void
  onPatternRepetitionChange?: (repetition: Repetition) => void
  onPatternScaleChange?: (scale: number) => void
}

const FormFill: FunctionComponent<FormFillProps> = ({
  type,
  color,
  gradient,
  patternTexture,
  onTypeChange,
  onColorChange,
  onGradientTypeChange,
  onGradientAngleChange,
  onGradientColorAdd,
  onGradientPaletteUpdate,
  onPatternImageChange,
  onPatternRepetitionChange,
  onPatternScaleChange,
}) => {
  return (
    <>
      <Box paddingX={2} marginY={4}>
        <RadioGroup
          row
          name='type'
          value={type}
          onChange={(e) => onTypeChange(Number(e.target.value))}
        >
          <FormControlLabel
            value={FillType.SOLID}
            control={<Radio size='small' color='default' />}
            label='Solid'
          />
          <FormControlLabel
            value={FillType.GRADIENT}
            control={<Radio size='small' color='default' />}
            label='Gradient'
          />
          <FormControlLabel
            value={FillType.IMAGE}
            control={<Radio size='small' color='default' />}
            label='Image'
          />
        </RadioGroup>
      </Box>
      {type === FillType.SOLID ? (
        <Box paddingX={2} marginY={4}>
          <FormColor color={color} onChange={onColorChange} />
        </Box>
      ) : null}
      {type === FillType.GRADIENT ? (
        <FormGradient
          gradient={gradient}
          onTypeChange={onGradientTypeChange}
          onAngleChange={onGradientAngleChange}
          onColorAdd={onGradientColorAdd}
          onPaletteUpdate={onGradientPaletteUpdate}
        />
      ) : null}
      {type === FillType.IMAGE ? (
        <FormImage
          patternTexture={patternTexture}
          src={patternTexture.src}
          scale={patternTexture.scale}
          onImageChange={onPatternImageChange}
          onRepetitionChange={onPatternRepetitionChange}
          onScaleChange={onPatternScaleChange}
        />
      ) : null}
    </>
  )
}

export default FormFill
