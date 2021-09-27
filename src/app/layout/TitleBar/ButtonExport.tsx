import React, {
  useState,
  useEffect,
  useCallback,
  FunctionComponent,
} from 'react'
import hotkeys from 'hotkeys-js'
import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import { useProject } from 'src/store/hooks'
import { configList, exportFile } from 'src/file/export'
import GridInput from 'src/app/components/GridInput/GridInput'

interface ButtonExportProps {
  className?: string
}

const ButtonExport: FunctionComponent<ButtonExportProps> = (
  props: ButtonExportProps,
) => {
  const { className } = props
  const project = useProject()
  const { name, ui } = project
  const { setShowPreview } = ui
  const [open, setOpen] = useState(false)
  const [list] = useState(configList)
  const [val, setVal] = useState(0)

  const handleOpen = useCallback(() => {
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

  const handleSave = useCallback(() => {
    exportFile(project, list[val])
    handleClose()
  }, [list, project, val])

  useEffect(() => {
    hotkeys.unbind('ctrl+shift+s,command+shift+s')
    hotkeys('ctrl+shift+s,command+shift+s', handleOpen)
    return () => {
      hotkeys.unbind('ctrl+shift+s,command+shift+s')
    }
  }, [handleOpen])

  return (
    <>
      <Button
        className={className}
        title='Export BitmapFont (⌘⇧ + S)'
        onClick={handleOpen}
      >
        Export
      </Button>
      <Dialog onClose={handleClose} open={open} fullWidth maxWidth='xs'>
        <DialogTitle>Export Config</DialogTitle>
        <DialogContent dividers>
          <GridInput before='Export Type:' childrenWidth={8}>
            <Select displayEmpty value={val} onChange={handleChange}>
              {list.map((item, idx) => (
                <MenuItem value={idx} key={item.id}>
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

export default observer(ButtonExport)
