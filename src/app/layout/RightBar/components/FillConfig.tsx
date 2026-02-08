import { FunctionComponent } from 'react'
import FormFill from 'src/app/layout/common/FormFill'
import {
  addGradientColor,
  setFillColor,
  setFillType,
  setGradientAngle,
  setGradientType,
  setPatternImage,
  setPatternRepetition,
  setPatternScale,
  updateGradientPalette,
  useFillColor,
  useFillType,
  useGradient,
  usePatternTexture,
} from 'src/store/legend'

import ConfigSection from '../../../components/ConfigSection'

const FillConfig: FunctionComponent = () => {
  const type = useFillType()
  const color = useFillColor()
  const gradient = useGradient()
  const patternTexture = usePatternTexture()

  return (
    <ConfigSection title='Fill'>
      <FormFill
        type={type}
        color={color}
        gradient={gradient}
        patternTexture={patternTexture}
        onTypeChange={setFillType}
        onColorChange={setFillColor}
        onGradientTypeChange={setGradientType}
        onGradientAngleChange={setGradientAngle}
        onGradientColorAdd={addGradientColor}
        onGradientPaletteUpdate={updateGradientPalette}
        onPatternImageChange={setPatternImage}
        onPatternRepetitionChange={setPatternRepetition}
        onPatternScaleChange={setPatternScale}
      />
    </ConfigSection>
  )
}

export default FillConfig
