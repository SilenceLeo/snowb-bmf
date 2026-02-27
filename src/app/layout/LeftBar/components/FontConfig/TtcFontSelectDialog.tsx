import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { FunctionComponent, useState } from 'react'

import type { TtcFontEntry } from 'src/utils/ttcParser'

interface TtcFontSelectDialogProps {
  open: boolean
  entries: TtcFontEntry[]
  onSelect: (selectedIndices: number[]) => void
  onClose: () => void
}

const TtcFontSelectDialog: FunctionComponent<TtcFontSelectDialogProps> = ({
  open,
  entries,
  onSelect,
  onClose,
}) => {
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const handleToggle = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const handleLoad = () => {
    onSelect(Array.from(selected).sort((a, b) => a - b))
    setSelected(new Set())
  }

  const handleClose = () => {
    setSelected(new Set())
    onClose()
  }

  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth='xs'>
      <DialogTitle>Select Fonts from TTC</DialogTitle>
      <DialogContent dividers>
        <List dense disablePadding>
          {entries.map((entry) => (
            <ListItemButton
              key={entry.index}
              onClick={() => handleToggle(entry.index)}
              dense
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Checkbox
                  edge='start'
                  checked={selected.has(entry.index)}
                  tabIndex={-1}
                  disableRipple
                  size='small'
                />
              </ListItemIcon>
              <ListItemText
                primary={entry.fullName}
                secondary={`${entry.fontFamily} — ${entry.fontSubfamily}`}
              />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='inherit'>
          Cancel
        </Button>
        <Button
          onClick={handleLoad}
          color='primary'
          disabled={selected.size === 0}
        >
          Load ({selected.size})
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TtcFontSelectDialog
