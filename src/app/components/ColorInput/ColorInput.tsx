import React, { FunctionComponent, useRef, useState } from 'react'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { useTheme } from '@mui/material/styles'

import WrappedSketchPicker from '../WrappedSketchPicker'

import styles from './ColorInput.module.css'

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
      <div
        aria-hidden
        className={styles.swatch}
        style={{
          ...bgPixel,
        }}
        ref={anchorEl}
      >
        <div
          aria-hidden
          className={styles.color}
          style={{
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
      </div>
    </ClickAwayListener>
  )
}

export default ColorInput
