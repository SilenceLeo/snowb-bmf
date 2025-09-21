import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import GradientPicker from 'src/app/components/GradientPicker'
import GridInput from 'src/app/components/GridInput'
import WrappedSketchPicker from 'src/app/components/WrappedSketchPicker'
import { Gradient, GradientType } from 'src/store'

import FormAngle from '../FormAngle'

interface FormGradientProps {
  gradient: Gradient
}

const FormGradient: FunctionComponent<FormGradientProps> = (
  props: FormGradientProps,
) => {
  const {
    gradient: {
      type,
      angle,
      palette,
      addColor,
      updatePalette,
      setAngle,
      setType,
    },
  } = props

  return (
    <>
      <Box paddingX={2} marginY={4}>
        <FormAngle angle={angle} onChange={setAngle} />
      </Box>

      <Box paddingX={2} marginY={4}>
        <GridInput before='Type:' component='div' childrenWidth={8}>
          <RadioGroup
            row
            name='type'
            value={type}
            onChange={(e) => setType(Number(e.target.value))}
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
          onAdd={(e) => addColor(e.offset, e.color)}
          onUpdate={updatePalette}
        >
          <WrappedSketchPicker />
        </GradientPicker>
      </Box>
    </>
  )
}

export default observer(FormGradient)
