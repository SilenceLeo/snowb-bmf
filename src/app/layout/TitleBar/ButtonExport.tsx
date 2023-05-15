import React, {
  useState,
  useEffect,
  useCallback,
  FunctionComponent,
} from 'react'
import hotkeys from 'hotkeys-js'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'

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

  const handleChange = (
    e: React.ChangeEvent<{
      name?: string | undefined
      value: unknown
    }>,
  ) => {
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
          <Box paddingX={2} marginY={4}>
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
          <Box paddingX={2} marginY={4}>
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
          <Box paddingX={2} marginY={4}>
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
          <Button autoFocus onClick={handleSave} color='default'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default observer(ButtonExport)
