import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Input from '@mui/material/Input'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import { SxProps, Theme } from '@mui/material/styles'
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
  sx?: SxProps<Theme>
}

const ButtonExport: FunctionComponent<ButtonExportProps> = (
  props: ButtonExportProps,
) => {
  const { sx } = props
  const project = useProject()
  const { setShowPreview } = project.ui
  const [open, setOpen] = useState(false)
  const [list] = useState(configList)
  const [val, setVal] = useState(0)
  const [fontName, setFontName] = useState(project.style.font.mainFamily)
  const [fileName, setFileName] = useState(project.name)
  const [pixelFormat, setPixelFormat] = useState('GRAY8')
  const [blur, setBlur] = useState(false)
  const [includeTextures, setIncludeTextures] = useState(false)
  const [extended, setExtended] = useState(false)

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
    setVal(e.target.value)
  }

  const handleChangePixelFormat = (e: SelectChangeEvent<string>) => {
    setPixelFormat(e.target.value)
  }

  const handleSave = useCallback(() => {
    const config = list[val]
    const options =
      config.supportsPixelFormat ||
      config.supportsBlur ||
      config.supportsTextures ||
      config.supportsExtended
        ? { pixelFormat, blur, includeTextures, extended }
        : undefined
    exportFile(project, config, fontName, fileName, options)
    handleClose()
  }, [
    blur,
    fileName,
    fontName,
    extended,
    includeTextures,
    list,
    pixelFormat,
    project,
    val,
  ])

  useEffect(() => {
    hotkeys.unbind('ctrl+shift+s,command+shift+s')
    hotkeys('ctrl+shift+s,command+shift+s', handleOpen)
    return () => {
      hotkeys.unbind('ctrl+shift+s,command+shift+s')
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
          {list[val]?.supportsPixelFormat ? (
            <Box sx={{ px: 2, my: 4 }}>
              <GridInput before='Pixel Format:' childrenWidth={6}>
                <Select
                  displayEmpty
                  value={pixelFormat}
                  onChange={handleChangePixelFormat}
                  fullWidth
                >
                  <MenuItem value='GRAY8'>8-bit Grayscale</MenuItem>
                  <MenuItem value='RGB'>RGB</MenuItem>
                  <MenuItem value='RGBA'>RGBA</MenuItem>
                  <MenuItem value='ARGB'>ARGB</MenuItem>
                  <MenuItem value='BGR'>BGR</MenuItem>
                  <MenuItem value='ABGR'>ABGR</MenuItem>
                  <MenuItem value='BGRA'>BGRA</MenuItem>
                  <MenuItem value='RGB565'>RGB565</MenuItem>
                </Select>
              </GridInput>
            </Box>
          ) : null}
          {list[val]?.supportsBlur ? (
            <Box sx={{ px: 2, my: 4 }}>
              <GridInput
                before='Reconstruction Filter:'
                component='div'
                childrenWidth={6}
              >
                <Box
                  component='label'
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 1,
                  }}
                >
                  Off
                  <Switch
                    size='small'
                    checked={blur}
                    onChange={(e) => setBlur(e.target.checked)}
                  />
                  On
                </Box>
              </GridInput>
            </Box>
          ) : null}
          {list[val]?.supportsTextures ? (
            <Box sx={{ px: 2, my: 4 }}>
              <GridInput
                before='Include Textures:'
                component='div'
                childrenWidth={6}
              >
                <Box
                  component='label'
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 1,
                  }}
                >
                  Off
                  <Switch
                    size='small'
                    checked={includeTextures}
                    onChange={(e) => setIncludeTextures(e.target.checked)}
                  />
                  On
                </Box>
              </GridInput>
            </Box>
          ) : null}
          {list[val]?.supportsExtended ? (
            <Box sx={{ px: 2, my: 4 }}>
              <GridInput
                before='Extended Data Fields:'
                component='div'
                childrenWidth={6}
              >
                <Box
                  component='label'
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 1,
                  }}
                >
                  Off
                  <Switch
                    size='small'
                    checked={extended}
                    onChange={(e) => setExtended(e.target.checked)}
                  />
                  On
                </Box>
              </GridInput>
            </Box>
          ) : null}
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
