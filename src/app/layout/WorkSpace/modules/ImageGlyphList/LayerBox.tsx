import React, { FunctionComponent, useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import clsx from 'clsx'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit'
import IconButton from '@material-ui/core/IconButton'
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary'

import { FileInfo } from 'src/store'
import { useProject } from 'src/store/hooks'

import readFile from 'src/utils/readFile'

import ImageGlyphList from './ImageGlyphList'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      position: 'relative',
    },
    fixed: {
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 999999,
      width: '100%',
      height: '100%',
      '& $panel': {
        maxHeight: 'none',
      },
    },
    panel: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '305px',
    },
    continer: {
      flex: 1,
      overflow: 'hidden',
      overflowY: 'auto',
    },
    listWrap: {
      minHeight: '224px',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      overflowY: 'auto',
    },
  }),
)

const LayerBox: FunctionComponent<unknown> = () => {
  const classes = useStyles()
  const { addImages } = useProject()
  const [isFullscreen, setFullscreen] = useState(false)
  const [open, setOpen] = useState(false)
  // const [isDroping, setIsDroping] = useState(false)

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
      className={clsx(classes.root, {
        [classes.fixed]: isFullscreen,
      })}
    >
      <Accordion
        className={classes.panel}
        expanded={isFullscreen || open}
        onChange={handleToggleOpen}
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
            <Grid item xs container justify='center'>
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
        <AccordionDetails className={classes.continer}>
          <Box className={classes.listWrap}>
            <ImageGlyphList />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
export default observer(LayerBox)
