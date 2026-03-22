import Input from '@mui/material/Input'
import { FunctionComponent } from 'react'
import AnglePicker, { AnglePickerProps } from 'src/app/components/AnglePicker'
import GridInput, { type GridColumnSize } from 'src/app/components/GridInput'

interface FormAngleProps extends AnglePickerProps {
  beforeWidth?: GridColumnSize
}

const FormAngle: FunctionComponent<FormAngleProps> = (
  props: FormAngleProps,
) => {
  const { angle, onChange, beforeWidth } = props

  return (
    <GridInput
      before='Angle:'
      beforeWidth={beforeWidth}
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
