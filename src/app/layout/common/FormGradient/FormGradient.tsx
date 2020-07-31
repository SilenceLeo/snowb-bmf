import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import GradientPicker from 'src/app/components/GradientPicker'
import WrappedSketchPicker from 'src/app/components/WrappedSketchPicker'
import { Gradient, GradientType } from 'src/store'
import GridInput from 'src/app/components/GridInput'

import FormAngle from '../FormAngle'

interface FormGradient {
  gradient: Gradient
}

const FormGradient: FunctionComponent<FormGradient> = (props: FormGradient) => {
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
