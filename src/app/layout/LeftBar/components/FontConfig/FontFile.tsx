import FontDownload from '@mui/icons-material/FontDownload'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import * as Sentry from '@sentry/react'
import { useSnackbar } from 'notistack'
import React, { FunctionComponent, useState } from 'react'
import { addFont, removeFont, useFontResources } from 'src/store/legend'
import readFile from 'src/utils/readFile'
import {
  extractTtfFromTtc,
  isTtcFile,
  parseTtcHeader,
  TtcFontEntry,
} from 'src/utils/ttcParser'

import TtcFontSelectDialog from './TtcFontSelectDialog'

// Component handles font family selection - file name is FontFile for historical reasons
const FontFamily: FunctionComponent = () => {
  const [loading, setLoading] = useState(false)
  const [ttcDialogOpen, setTtcDialogOpen] = useState(false)
  const [ttcEntries, setTtcEntries] = useState<TtcFontEntry[]>([])
  const [ttcBuffer, setTtcBuffer] = useState<ArrayBuffer | null>(null)
  const fonts = useFontResources()
  const { enqueueSnackbar } = useSnackbar()

  const reportError = (e: unknown) => {
    enqueueSnackbar((e as Error).message, { variant: 'error' })
    Sentry.captureException(e)
  }

  const handleUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event || !event.target || !event.target.files?.[0]) {
      return
    }

    const file = event.target.files[0]
    if (!file.name.match(/\.([A-Z0-9]+)$/i)) {
      return
    }

    setLoading(true)

    try {
      const arrBuf = await readFile(file)
      if (!(arrBuf instanceof ArrayBuffer)) {
        setLoading(false)
        return
      }

      event.target.value = ''

      if (isTtcFile(arrBuf)) {
        const entries = parseTtcHeader(arrBuf)
        if (entries.length === 1) {
          // Single font in TTC — load directly, skip dialog
          const ttf = extractTtfFromTtc(arrBuf, 0)
          await addFont(ttf)
        } else {
          setTtcBuffer(arrBuf)
          setTtcEntries(entries)
          setTtcDialogOpen(true)
        }
      } else {
        await addFont(arrBuf)
      }
    } catch (e) {
      reportError(e)
    } finally {
      setLoading(false)
    }
  }

  const handleTtcSelect = async (selectedIndices: number[]) => {
    if (!ttcBuffer) return

    setTtcDialogOpen(false)
    setLoading(true)

    for (const idx of selectedIndices) {
      try {
        const ttf = extractTtfFromTtc(ttcBuffer, idx)
        await addFont(ttf)
      } catch (e) {
        const entry = ttcEntries.find((en) => en.index === idx)
        const name = entry?.fullName ?? `Font #${idx}`
        enqueueSnackbar(`Failed to load ${name}: ${(e as Error).message}`, {
          variant: 'error',
        })
        Sentry.captureException(e)
      }
    }

    setTtcBuffer(null)
    setTtcEntries([])
    setLoading(false)
  }

  const handleTtcDialogClose = () => {
    setTtcDialogOpen(false)
    setTtcBuffer(null)
    setTtcEntries([])
  }

  return (
    <>
      <List dense={true} disablePadding={true}>
        {fonts.map((fontResource) => (
          <ListItem
            key={fontResource.family}
            disableGutters={true}
            divider={true}
            dense={true}
            secondaryAction={
              <IconButton
                edge='end'
                aria-label='delete'
                onClick={() => removeFont(fontResource)}
              >
                <HighlightOffIcon />
              </IconButton>
            }
          >
            <ListItemText primary={fontResource.family} />
          </ListItem>
        ))}
      </List>
      <Button
        component='label'
        variant='contained'
        color='primary'
        fullWidth
        size='large'
        startIcon={
          loading ? (
            <CircularProgress size={22} color='inherit' />
          ) : (
            <FontDownload />
          )
        }
        disabled={loading}
      >
        Add Font File
        <input
          hidden
          type='file'
          onChange={handleUploadFile}
          accept='.ttf,.otf,.woff,.ttc'
        />
      </Button>
      <TtcFontSelectDialog
        open={ttcDialogOpen}
        entries={ttcEntries}
        onSelect={handleTtcSelect}
        onClose={handleTtcDialogClose}
      />
    </>
  )
}

export default FontFamily
