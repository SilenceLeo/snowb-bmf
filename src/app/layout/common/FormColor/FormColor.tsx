import { FunctionComponent } from 'react'
import ColorInput from 'src/app/components/ColorInput'
import GridInput, { type GridColumnSize } from 'src/app/components/GridInput'

interface FormColorProps {
  color: string
  beforeWidth?: GridColumnSize
  onChange(color: string): void
}

const FormColor: FunctionComponent<FormColorProps> = (
  props: FormColorProps,
) => {
  const { color, beforeWidth, onChange } = props

  return (
    <GridInput before='Color:' beforeWidth={beforeWidth} childrenWidth={3}>
      <ColorInput color={color} onChange={onChange} />
    </GridInput>
  )
}

export default FormColor
