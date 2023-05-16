import React from 'react'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

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
  const [open, setOpen] = React.useState(false)

  const handleClose = (
    event: React.SyntheticEvent<any> | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const updateVersion = React.useCallback(
    (event: Event & { detail?: boolean }) => {
      const { detail } = event
      setOpen(!!detail)
    },
    [],
  )

  const handleReload = () => {
    window.location.reload()
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
            sx={{ p: 0.5 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </React.Fragment>
      }
    />
  )
}
