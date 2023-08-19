import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Input from '@mui/material/Input'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import hotkeys from 'hotkeys-js'
import { observer } from 'mobx-react-lite'
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import GridInput from 'src/app/components/GridInput/GridInput'
import { configList, exportFile } from 'src/file/export'
import { useProject } from 'src/store/hooks'

interface ButtonExportProps {
  className?: string
}

const ButtonExport: FunctionComponent<ButtonExportProps> = (
  props: ButtonExportProps,
) => {
  const { className } = props
  const project = useProject()
  const { setShowPreview } = project.ui
  const [open, setOpen] = useState(false)
  const [list] = useState(configList)
  const [val, setVal] = useState(0)
  const [fontName, setFontName] = useState(project.style.font.mainFamily)
  const [fileName, setFileName] = useState(project.name)

  const handleOpen = useCallback(() => {
    setFontName(project.style.font.mainFamily)
    setFileName(project.name)
    setShowPreview(false)
    setOpen(true)
  }, [project.name, project.style.font.mainFamily, setShowPreview])

  const handleClose = () => {
    setOpen(false)
  }

  const handleChangeFontName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontName(e.target.value)
  }

  const handleChangeFileName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value)
  }

  const handleChange = (e: SelectChangeEvent<number>) => {
    setVal(e.target.value as number)
  }

  const handleSave = useCallback(() => {
    exportFile(project, list[val], fontName, fileName)
    handleClose()
  }, [fileName, fontName, list, project, val])

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
          <Box sx={{ px: 2, my: 4 }}>
            <GridInput before='Font Name:' childrenWidth={6}>
              <Input
                fullWidth
                type='text'
                value={fontName}
                placeholder={project.style.font.mainFamily}
                onChange={handleChangeFontName}
              />
            </GridInput>
          </Box>
          <Box sx={{ px: 2, my: 4 }}>
            <GridInput before='File Name:' after='.zip' childrenWidth={6}>
              <Input
                fullWidth
                type='text'
                value={fileName}
                placeholder={project.name}
                onChange={handleChangeFileName}
              />
            </GridInput>
          </Box>
          <Box sx={{ px: 2, my: 4 }}>
            <GridInput before='Export Type:' childrenWidth={6}>
              <Select
                displayEmpty
                value={val}
                onChange={handleChange}
                fullWidth
              >
                {list.map((item, idx) => (
                  <MenuItem value={idx} key={item.id}>
                    {`${fileName || project.name}.${
                      item.ext
                    } (BMFont ${item.type.toUpperCase()})`}
                  </MenuItem>
                ))}
              </Select>
            </GridInput>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSave} color='inherit'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default observer(ButtonExport)
