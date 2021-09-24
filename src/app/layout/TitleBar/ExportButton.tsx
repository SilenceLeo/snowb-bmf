import React, {
  useState,
  useEffect,
  useCallback,
  FunctionComponent,
} from 'react'
import hotkeys from 'hotkeys-js'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import { useProject } from 'src/store/hooks'
import GridInput from 'src/app/components/GridInput/GridInput'

interface ExportButtonProps {
  className?: string
  onSave?: (config: { ext: string; type: string }) => void
}

const ExportButton: FunctionComponent<ExportButtonProps> = (
  props: ExportButtonProps,
) => {
  const { className, onSave } = props
  const project = useProject()
  const { setShowPreview } = project.ui
  const { name } = project
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState(0)
  const [list] = useState([
    { id: 0, ext: 'fnt', type: 'xml' },
    { id: 1, ext: 'xml', type: 'xml' },
    { id: 2, ext: 'fnt', type: 'text' },
    { id: 3, ext: 'text', type: 'text' },
  ])

  const handleClickOpen = useCallback(() => {
    setShowPreview(false)
    setOpen(true)
  }, [setShowPreview])

  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (
    e: React.ChangeEvent<{
      name?: string | undefined
      value: unknown
    }>,
  ) => {
    setVal(e.target.value as number)
  }
  const handleSave = () => {
    if (onSave)
      onSave({
        ext: list[val].ext,
        type: list[val].type,
      })
    handleClose()
  }

  useEffect(() => {
    hotkeys.unbind('ctrl+shift+s,command+shift+s')
    hotkeys('ctrl+shift+s,command+shift+s', handleClickOpen)
    return () => {
      hotkeys.unbind('ctrl+shift+s,command+shift+s')
    }
  }, [handleClickOpen])

  return (
    <>
      <Button
        className={className}
        title='Export BitmapFont (⌘⇧ + S)'
        onClick={handleClickOpen}
      >
        Export
      </Button>
      <Dialog onClose={handleClose} open={open} fullWidth maxWidth='xs'>
        <DialogTitle>Export Config</DialogTitle>
        <DialogContent dividers>
          <GridInput before='Export Type:' childrenWidth={8}>
            <Select displayEmpty value={val} onChange={handleChange}>
              {list.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {`${name}.${item.ext} (BMFont ${item.type.toUpperCase()})`}
                </MenuItem>
              ))}
            </Select>
          </GridInput>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSave} color='default'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ExportButton
