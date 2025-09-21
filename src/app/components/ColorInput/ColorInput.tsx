import Box from '@mui/material/Box'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { useTheme } from '@mui/material/styles'
import { FunctionComponent, useRef, useState } from 'react'

import WrappedSketchPicker from '../WrappedSketchPicker'

export interface ColorInputProps {
  color?: string
  onChange?: (color: string) => void
}

const ColorInput: FunctionComponent<ColorInputProps> = (
  props: ColorInputProps,
) => {
  const { color, onChange } = props
  const { palette, bgPixel } = useTheme()
  const anchorEl = useRef(null)
  const [open, setOpen] = useState(false)

  return (
    <ClickAwayListener
      mouseEvent='onMouseDown'
      onClickAway={() => setOpen(false)}
    >
      <Box
        aria-hidden
        sx={{
          display: 'inline-block',
          cursor: 'pointer',
          ...bgPixel,
        }}
        ref={anchorEl}
      >
        <Box
          aria-hidden
          sx={{
            width: '46px',
            height: '24px',
            border: '5px solid',
            borderColor: palette.primary.main,
            backgroundColor: props.color,
          }}
          onClick={() => setOpen(!open)}
        />
        <WrappedSketchPicker
          open={open}
          anchorEl={anchorEl.current}
          color={color || '#000000'}
          onChange={onChange}
        />
      </Box>
    </ClickAwayListener>
  )
}

export default ColorInput
