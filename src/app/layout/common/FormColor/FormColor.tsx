import { FunctionComponent } from 'react'
import ColorInput from 'src/app/components/ColorInput'
import GridInput from 'src/app/components/GridInput'

interface FormColorProps {
  color: string
  onChange(color: string): void
}

const FormColor: FunctionComponent<FormColorProps> = (
  props: FormColorProps,
) => {
  const { color, onChange } = props

  return (
    <GridInput before='Color:' childrenWidth={3}>
      <ColorInput color={color} onChange={onChange} />
    </GridInput>
  )
}

export default FormColor
