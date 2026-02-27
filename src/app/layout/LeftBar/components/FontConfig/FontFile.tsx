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

// Component handles font family selection - file name is FontFile for historical reasons
const FontFamily: FunctionComponent = () => {
  const [loading, setLoading] = useState(false)
  const fonts = useFontResources()
  const { enqueueSnackbar } = useSnackbar()

  const handleUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event || !event.target || !event.target.files?.[0]) {
      return
    }

    const file = event.target.files[0]
    const ext = file.name.match(/\.([A-Z0-9]+)$/i)
    if (!ext) {
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

      try {
        await addFont(arrBuf)
      } catch (e) {
        enqueueSnackbar((e as Error).message, { variant: 'error' })
        Sentry.captureException(e)
      }
    } catch (e) {
      Sentry.captureException(e)
      enqueueSnackbar((e as Error).message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
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
          accept='.ttf,.otf,.woff'
        />
      </Button>
    </>
  )
}

export default FontFamily
