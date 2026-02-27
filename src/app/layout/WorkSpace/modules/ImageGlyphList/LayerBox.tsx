import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary, {
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { type ImageFileInfo, addImages } from 'src/store/legend'
import readFile from 'src/utils/readFile'

import ImageGlyphList from './ImageGlyphList'

const FULLSCREEN_Z_INDEX = 999999
// Max height for the accordion in non-fullscreen mode (header + content area)
const ACCORDION_MAX_HEIGHT = '305px'
// Min height for the image glyph list content area
const GLYPH_LIST_MIN_HEIGHT = '224px'

const LayerBox: FunctionComponent = () => {
  const [isFullscreen, setFullscreen] = useState(false)
  const [open, setOpen] = useState(false)

  const handleLoadFile = (files: FileList) => {
    const list = Array.from(files).filter((file) => /^image\//.test(file.type))
    if (!list.length) {
      return
    }
    Promise.all(
      list.map((file) =>
        readFile(file).then((buffer) => {
          if (!buffer || typeof buffer === 'string') {
            return null
          }

          const matched = file.name.match(/(\S)\.[a-zA-Z0-9]+$/i)
          return {
            letter: matched ? matched[1] : '',
            fileName: file.name,
            fileType: file.type,
            buffer,
          }
        }),
      ),
    )
      .then((fileList) => {
        addImages(fileList.filter((f) => f) as ImageFileInfo[])
      })
      .catch((error) => {
        console.error('Failed to load image files:', error)
      })
  }

  const handleDrop = (e: React.DragEvent<HTMLElement>): void => {
    e.preventDefault()
    handleLoadFile(e.dataTransfer.files)
  }

  const handleToggleFullScreen = (
    e?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (e) {
      e.stopPropagation()
    }
    setFullscreen((f) => !f)
  }

  const handleToggleOpen = () => {
    setOpen((o) => isFullscreen || !o)
  }
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) {
      return
    }
    const { files } = e.target
    handleLoadFile(files)
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement
    if (e.key === 'Escape') {
      if (!target || target.tagName !== 'INPUT') {
        setFullscreen(false)
      } else if (target) {
        target.blur()
      }
    }
  }, [])

  useEffect(() => {
    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyDown)
    } else {
      window.removeEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, handleKeyDown])

  return (
    <Box
      onDragEnter={(e) => e.preventDefault()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      sx={{
        display: 'flex',
        position: 'relative',
        ...(isFullscreen
          ? {
              position: 'fixed',
              left: 0,
              top: 0,
              zIndex: FULLSCREEN_Z_INDEX,
              width: '100%',
              height: '100%',
            }
          : {}),
      }}
    >
      <Accordion
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: ACCORDION_MAX_HEIGHT,
          ...(isFullscreen
            ? {
                maxHeight: 'none',
              }
            : {}),
        }}
        expanded={isFullscreen || open}
        onChange={handleToggleOpen}
        elevation={0}
        slotProps={{
          transition: {
            style:
              isFullscreen || open
                ? { flex: 1, overflow: 'hidden', overflowY: 'auto' }
                : {},
          },
        }}
      >
        <AccordionSummary
          expandIcon={isFullscreen ? undefined : <ExpandMoreIcon />}
          sx={{
            [`& .${accordionSummaryClasses.content}`]: {
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          }}
        >
          <Typography>Image Glyph List</Typography>
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
          <IconButton component='div' onClick={handleToggleFullScreen}>
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            flex: 1,
            overflow: 'hidden',
            overflowY: 'auto',
          }}
        >
          <Box sx={{ minHeight: GLYPH_LIST_MIN_HEIGHT, height: '100%', width: '100%' }}>
            <ImageGlyphList />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
export default LayerBox
