import React, { FunctionComponent, useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import clsx from 'clsx'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Accordion from '@mui/material/Accordion'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'

import { FileInfo } from 'src/store'
import { useProject } from 'src/store/hooks'

import readFile from 'src/utils/readFile'

import ImageGlyphList from './ImageGlyphList'

import styles from './LayerBox.module.scss'

const LayerBox: FunctionComponent<unknown> = () => {
  const { addImages } = useProject()
  const [isFullscreen, setFullscreen] = useState(false)
  const [open, setOpen] = useState(false)

  const handleLoadFile = (files: FileList) => {
    const list = Array.from(files).filter((file) => /^image\//.test(file.type))
    if (!list.length) return
    Promise.all(
      list.map((file) =>
        readFile(file).then((buffer) => {
          if (!buffer || typeof buffer === 'string') return null

          const matched = file.name.match(/(\S)\.[a-zA-Z0-9]+$/i)
          return {
            letter: matched ? matched[1] : '',
            fileName: file.name,
            fileType: file.type,
            buffer,
          }
        }),
      ),
    ).then((fileList) => {
      addImages(fileList.filter((f) => f) as FileInfo[])
    })
  }

  const handleDrop = (e: React.DragEvent<HTMLElement>): void => {
    e.preventDefault()
    handleLoadFile(e.dataTransfer.files)
  }

  const hanfleToggleFullScreen = (
    e?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (e) e.stopPropagation()
    setFullscreen((f) => !f)
  }

  const handleToggleOpen = () => {
    setOpen((o) => isFullscreen || !o)
  }
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return
    const { files } = e.target
    handleLoadFile(files)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement
    if (e.keyCode === 27) {
      if (!target || target.tagName !== 'INPUT') setFullscreen(false)
      else if (target) target.blur()
    }
  }

  useEffect(() => {
    if (isFullscreen) window.addEventListener('keydown', handleKeyDown)
    else window.removeEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  return (
    <Box
      onDragEnter={(e) => e.preventDefault()}
      onDragOver={(e) => e.preventDefault()}
      // onDragLeave={handleDrop}
      onDrop={handleDrop}
      className={clsx(styles.root, {
        [styles.fixed]: isFullscreen,
      })}
    >
      <Accordion
        className={styles.panel}
        expanded={isFullscreen || open}
        onChange={handleToggleOpen}
        elevation={0}
        TransitionProps={{
          style:
            isFullscreen || open
              ? { flex: 1, overflow: 'hidden', overflowY: 'auto' }
              : {},
        }}
      >
        <AccordionSummary
          expandIcon={isFullscreen ? undefined : <ExpandMoreIcon />}
        >
          <Grid container alignItems='center'>
            <Grid item>
              <Typography>Image Glyph List</Typography>
            </Grid>
            <Grid item xs container justifyContent='center'>
              <Button
                component='label'
                color='primary'
                size='small'
                variant='contained'
                startIcon={<PhotoLibraryIcon />}
              >
                Select Images
                <input
                  hidden
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleFilesChange}
                />
              </Button>
            </Grid>
            <Grid item>
              <IconButton component='div' onClick={hanfleToggleFullScreen}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={styles.continer}>
          <Box className={styles.listWrap}>
            <ImageGlyphList />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
export default observer(LayerBox)
