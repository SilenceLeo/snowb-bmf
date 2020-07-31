import React, { FunctionComponent } from 'react'
import Input from '@material-ui/core/Input'

import GridInput from 'src/app/components/GridInput'
import AnglePicker, { AnglePickerProps } from 'src/app/components/AnglePicker'

const FormAngle: FunctionComponent<AnglePickerProps> = (
  props: AnglePickerProps,
) => {
  const { angle, onChange } = props

  return (
    <GridInput
      before='Angle:'
      after={<AnglePicker width={24} angle={angle} onChange={onChange} />}
    >
      <Input
        value={angle}
        fullWidth
        type='number'
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </GridInput>
  )
}

export default FormAngle
