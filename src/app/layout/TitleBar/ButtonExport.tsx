import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Input from '@mui/material/Input'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { SxProps, Theme } from '@mui/material/styles'
import hotkeys from 'hotkeys-js'
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import GridInput from 'src/app/components/GridInput/GridInput'
import { configList, exportFile } from 'src/file/export'
import {
  getExportProjectData,
  setShowPreview,
  useMainFontFamily,
  useProjectName,
} from 'src/store/legend'

interface ButtonExportProps {
  sx?: SxProps<Theme>
}

const ButtonExport: FunctionComponent<ButtonExportProps> = (
  props: ButtonExportProps,
) => {
  const { sx } = props
  const projectName = useProjectName()
  const mainFontFamily = useMainFontFamily()

  const [open, setOpen] = useState(false)
  const [val, setVal] = useState(0)
  const [fontName, setFontName] = useState(mainFontFamily)
  const [fileName, setFileName] = useState(projectName)

  const handleOpen = useCallback(() => {
    setFontName(mainFontFamily)
    setFileName(projectName)
    setShowPreview(false)
    setOpen(true)
  }, [projectName, mainFontFamily])

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
    const projectData = getExportProjectData()
    exportFile(projectData, configList[val], fontName, fileName).catch(
      (error) => {
        console.error('[Export] Failed:', error)
      },
    )
    handleClose()
  }, [fileName, fontName, val])

  useEffect(() => {
    hotkeys('ctrl+shift+s,command+shift+s', handleOpen)
    return () => {
      hotkeys.unbind('ctrl+shift+s,command+shift+s', handleOpen)
    }
  }, [handleOpen])

  return (
    <>
      <Button sx={sx} title='Export BitmapFont (⌘⇧ + S)' onClick={handleOpen}>
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
                placeholder={mainFontFamily}
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
                placeholder={projectName}
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
                {configList.map((item, idx) => (
                  <MenuItem value={idx} key={item.id}>
                    {`${fileName || projectName}.${
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

export default ButtonExport
