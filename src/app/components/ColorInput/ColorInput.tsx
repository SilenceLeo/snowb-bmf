import React, { FunctionComponent, useRef, useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import WrappedSketchPicker from '../WrappedSketchPicker'

export interface ColorInputProps {
  color?: string
  onChange?: (color: string) => void
}

const useStyles = makeStyles(({ palette, bgPixel }: Theme) =>
  createStyles({
    root: {
      overflow: 'hidden',
    },
    swatch: {
      ...bgPixel,
      display: 'inline-block',
      cursor: 'pointer',
    },
    color: {
      width: '46px',
      height: '24px',
      border: `5px solid ${palette.primary.main}`,
      backgroundColor: (props: ColorInputProps) => props.color || '',
    },
  }),
)

const ColorInput: FunctionComponent<ColorInputProps> = (
  props: ColorInputProps,
) => {
  const { color, onChange } = props
  const classes = useStyles(props)
  const anchorEl = useRef(null)
  const [open, setOpen] = useState(false)

  return (
    <ClickAwayListener
      mouseEvent='onMouseDown'
      onClickAway={() => setOpen(false)}
    >
      <div aria-hidden className={classes.swatch} ref={anchorEl}>
        <div
          aria-hidden
          className={classes.color}
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
