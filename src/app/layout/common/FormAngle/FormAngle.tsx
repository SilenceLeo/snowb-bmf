import Input from '@mui/material/Input'
import { FunctionComponent } from 'react'
import AnglePicker, { AnglePickerProps } from 'src/app/components/AnglePicker'
import GridInput from 'src/app/components/GridInput'

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
