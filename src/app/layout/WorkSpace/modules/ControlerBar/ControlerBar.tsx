import React, { FunctionComponent, useState, useRef } from 'react'
import { observer } from 'mobx-react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Popper from '@material-ui/core/Popper'
import Slider from '@material-ui/core/Slider'
import Switch from '@material-ui/core/Switch'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import { useProjectUi } from 'src/store/hooks'

const useStyles = makeStyles(() =>
  createStyles({
    slider: {
      width: '200px',
    },
  }),
)

const ControlerBar: FunctionComponent<unknown> = () => {
  const {
    scale,
    setTransform,
    previewScale,
    setPreviewTransform,
    showPreview,
    setShowPreview,
  } = useProjectUi()
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const [list] = useState([0.25, 0.5, 0.75, 1, 1.25, 1.5, 5, 10])
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  const handleChange = (event: unknown, val: number | number[]) => {
    if (showPreview) {
      setPreviewTransform({ previewScale: val as number })
    } else {
      setTransform({ scale: val as number })
    }
  }

  const handleSelect = (val: number) => {
    // setTransform({ scale: val })
    handleChange(null, val)
    setOpen(false)
  }

  return (
    <Box paddingX={2} display='flex' justifyContent='space-between'>
      <Box component='label' display='flex' alignItems='center'>
        Preview
        <Switch
          size='small'
          color='primary'
          checked={showPreview}
          onChange={(e) => setShowPreview(e.target.checked)}
        />
      </Box>
      <Slider
        className={classes.slider}
        value={showPreview ? previewScale : scale}
        min={0.01}
        max={10}
        step={0.01}
        onChange={handleChange}
      />
      <Button ref={anchorRef} onClick={handleToggle}>
        {`${Math.round((showPreview ? previewScale : scale) * 1000) / 10}%`}
      </Button>
      <Popper open={open} anchorEl={anchorRef.current} placement='top-end'>
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList>
              {list.map((n) => (
                <MenuItem key={n} onClick={() => handleSelect(n)}>
                  {`${n * 100}%`}
                </MenuItem>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </Box>
  )
}

export default observer(ControlerBar)
