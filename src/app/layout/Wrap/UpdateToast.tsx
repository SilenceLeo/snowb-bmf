import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    close: {
      padding: theme.spacing(0.5),
    },
  }),
)

export interface SnackbarMessage {
  message: string
  key: number
}

export interface State {
  open: boolean
  snackPack: SnackbarMessage[]
  messageInfo?: SnackbarMessage
}

export default function ConsecutiveSnackbars() {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [worker, setWorker] = React.useState<ServiceWorker | null>(null)

  const handleClose = (
    event: React.SyntheticEvent | MouseEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const updateVersion = React.useCallback((event) => {
    const { detail } = event
    setWorker(detail || null)
    setOpen(!!detail)
  }, [])

  const handleReload = () => {
    if (!worker || !worker.postMessage) return

    const channel = new MessageChannel()

    channel.port1.onmessage = (event) => {
      window.location.reload()
    }

    worker.postMessage({ type: 'SKIP_WAITING' }, [channel.port2])
  }

  React.useEffect(() => {
    window.addEventListener('updateVerion', updateVersion, false)
    return () =>
      window.removeEventListener('updateVerion', updateVersion, false)
  }, [updateVersion])

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      onClose={handleClose}
      message='New version is available.'
      action={
        <React.Fragment>
          <Button color='secondary' size='small' onClick={handleReload}>
            Reload
          </Button>
          <IconButton
            aria-label='close'
            color='inherit'
            className={classes.close}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </React.Fragment>
      }
    />
  )
}
