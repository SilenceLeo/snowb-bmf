import Popper, { PopperPlacementType } from '@mui/material/Popper'
import { type Theme, useTheme } from '@mui/material/styles'
import { FunctionComponent } from 'react'
import { ColorResult, SketchPicker } from 'react-color'

export interface ChildrenProps {
  open: boolean
  color: string
  placement: PopperPlacementType
  anchorEl: HTMLDivElement | null
  onChange(color: string): void
}

// High z-index to ensure picker appears above all other UI elements
const PICKER_Z_INDEX = 999999

const usePickerStyle = (theme: Theme) => {
  const { palette } = theme

  if (palette.mode === 'light') return {}

  return {
    default: {
      picker: {
        background: palette.background.titleBar,
        shadow: theme.shadows[24],
      },
      alpha: {
        background: '#fff',
      },
      color: {
        background: '#fff',
      },
    },
  }
}

const WrappedSketchPicker: FunctionComponent<Partial<ChildrenProps>> = (
  props: Partial<ChildrenProps>,
) => {
  const { open, anchorEl, color, onChange, placement } = props
  const theme = useTheme()
  const pickerStyle = usePickerStyle(theme)
  const { palette } = theme

  return (
    <Popper
      open={!!open}
      anchorEl={anchorEl}
      placement={placement || 'bottom'}
      style={{ zIndex: PICKER_Z_INDEX }}
      sx={{
        '& *': {
          color: `${palette.text.primary} !important`,
          borderColor: `${palette.divider} !important`,
        },
        '& input': {
          background: 'none',
          color: `${palette.text.primary} !important`,
          boxShadow: `none !important`,
          border: `1px solid ${palette.divider} !important`,
        },
      }}
    >
      <SketchPicker
        color={color}
        styles={pickerStyle}
        onChange={({ rgb }: ColorResult) => {
          if (onChange)
            onChange(
              `rgba(${rgb.r},${rgb.g},${rgb.b},${
                typeof rgb.a === 'undefined' ? 1 : rgb.a
              })`,
            )
        }}
      />
    </Popper>
  )
}

export default WrappedSketchPicker
