import Popper, { PopperPlacementType } from '@mui/material/Popper'
import { useTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import { ColorResult, SketchPicker } from 'react-color'

export interface ChildrenProps {
  open: boolean
  color: string
  placement: PopperPlacementType
  anchorEl: HTMLDivElement | null
  onChange(color: string): void
}

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
      style={{ zIndex: 999999 }}
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
      {/* @ts-ignore */}
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

export default observer(WrappedSketchPicker)
