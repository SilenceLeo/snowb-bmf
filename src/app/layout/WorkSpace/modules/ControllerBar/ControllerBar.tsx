import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Slider from '@mui/material/Slider'
import Switch from '@mui/material/Switch'
import { observer } from 'mobx-react-lite'
import { FunctionComponent, useRef, useState } from 'react'
import { useProjectUi } from 'src/store/hooks'

const ControllerBar: FunctionComponent<unknown> = () => {
  const {
    scale,
    setTransform,
    previewScale,
    setPreviewTransform,
    showPreview,
    setShowPreview,
  } = useProjectUi()
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const [list] = useState([0.25, 0.5, 0.75, 1, 1.25, 1.5, 5, 10])
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  const handleChange = (_event: unknown, val: number | number[]) => {
    if (showPreview) {
      setPreviewTransform({ previewScale: val as number })
    } else {
      setTransform({ scale: val as number })
    }
  }

  const handleSelect = (val: number) => {
    handleChange(null, val)
    setOpen(false)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        px: 2,
      }}
    >
      <Box
        component='label'
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        Preview
        <Switch
          size='small'
          color='primary'
          checked={showPreview}
          onChange={(e) => setShowPreview(e.target.checked)}
        />
      </Box>
      <Slider
        sx={{
          width: '200px',
        }}
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

export default observer(ControllerBar)
