import React, { useState, FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'
import * as Sentry from '@sentry/react'

import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import FontDownload from '@mui/icons-material/FontDownload'
import CircularProgress from '@mui/material/CircularProgress'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

import { useFont } from 'src/store/hooks'
import readFile from 'src/utils/readFile'

const FontFamily: FunctionComponent<unknown> = () => {
  const [loading, setLoading] = useState(false)
  const { fonts, addFont, removeFont } = useFont()
  const { enqueueSnackbar } = useSnackbar()

  const hanleUploadFile = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    if (
      !event ||
      !event.target ||
      !event.target.files ||
      !event.target.files[0]
    )
      return

    const file = event.target.files[0]
    const ext = file.name.match(/\.([A-Z0-9]+)$/i)
    if (!ext) return

    setLoading(true)

    readFile(file).then((arrBuf) => {
      if (!(arrBuf instanceof ArrayBuffer)) {
        setLoading(false)
        return
      }

      event.target.value = ''

      addFont(arrBuf)
        .then(() => setLoading(false))
        .catch((e) => {
          setLoading(false)
          enqueueSnackbar(e.message, { variant: 'error' })
          Sentry.captureException(e)
        })
    })
  }

  // TODO: List add sort.
  return (
    <div>
      <List dense={true} disablePadding={true}>
        {fonts.map((fontResource) => (
          <ListItem
            key={fontResource.family}
            disableGutters={true}
            divider={true}
            dense={true}
          >
            <ListItemText primary={fontResource.family} />
            <ListItemSecondaryAction>
              <IconButton
                edge='end'
                aria-label='delete'
                onClick={() => removeFont(fontResource)}
              >
                <HighlightOffIcon />
              </IconButton>
            </ListItemSecondaryAction>
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
          onChange={hanleUploadFile}
          accept='.ttf,.otf,.woff'
        />
      </Button>
    </div>
  )
}

export default observer(FontFamily)
