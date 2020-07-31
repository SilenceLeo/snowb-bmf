import React, { FunctionComponent } from 'react'
import { SketchPicker, ColorResult } from 'react-color'
import { useTheme, makeStyles, createStyles } from '@material-ui/core/styles'
import Popper, { PopperPlacementType } from '@material-ui/core/Popper'

export interface ChildrenProps {
  open: boolean
  color: string
  placement: PopperPlacementType
  anchorEl: HTMLDivElement | null
  onChange(color: string): void
}

const usePickerStyle = () => {
  const theme = useTheme()
  const { palette } = theme

  if (palette.type === 'light') return {}

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

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    picker: {
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
    },
  }),
)

const WrappedSketchPicker: FunctionComponent<Partial<ChildrenProps>> = (
  props: Partial<ChildrenProps>,
) => {
  const { open, anchorEl, color, onChange, placement } = props
  const classes = useStyles()
  const pickerStyle = usePickerStyle()
  return (
    <Popper
      open={!!open}
      anchorEl={anchorEl}
      placement={placement || 'bottom'}
      style={{ zIndex: 999999 }}
    >
      <SketchPicker
        color={color}
        styles={pickerStyle}
        className={classes.picker}
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
