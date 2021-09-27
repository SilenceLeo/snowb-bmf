import React, { useState, FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'

import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import IconButton from '@material-ui/core/IconButton'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import FontDownload from '@material-ui/icons/FontDownload'
import CircularProgress from '@material-ui/core/CircularProgress'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

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
        .catch((err) => {
          setLoading(false)
          enqueueSnackbar(err.message, { variant: 'error' })
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
