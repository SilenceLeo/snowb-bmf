import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import ErrorIcon from '@mui/icons-material/Error'
import RefreshIcon from '@mui/icons-material/Refresh'
import UpdateIcon from '@mui/icons-material/Update'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import React from 'react'
import {
  useErrorHandler,
  useLoading,
  useSimpleState,
} from 'src/app/hooks/useUpdateToast'

import {
  checkForUpdatesManually,
  forceUpdate,
} from '../../../serviceWorkerRegistration'

interface UpdateState {
  isVisible: boolean
  isUpdateReady: boolean
  isOfflineReady: boolean
  lastUpdateCheck: number
}

export default function UpdateToast() {
  const { value: state, setValue: setState } = useSimpleState<UpdateState>({
    isVisible: false,
    isUpdateReady: false,
    isOfflineReady: false,
    lastUpdateCheck: 0,
  })

  const { loading: isUpdating, withLoading } = useLoading()
  const { error: updateError, handleError, clearError } = useErrorHandler()

  const handleClose = React.useCallback(
    (_event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return
      }
      setState((prev) => ({ ...prev, isVisible: false }))
      clearError()
    },
    [setState, clearError],
  )

  const handleUpdate = React.useCallback(async () => {
    clearError()

    const success = await withLoading(forceUpdate())
    if (!success) {
      handleError('Update failed, please try again later')
    }
    // If successful, the page will reload automatically
  }, [withLoading, handleError, clearError])

  const handleCheckForUpdates = React.useCallback(async () => {
    clearError()

    const success = await withLoading(checkForUpdatesManually())
    if (success) {
      setState((prev) => ({
        ...prev,
        lastUpdateCheck: Date.now(),
      }))
      // Show brief feedback that check was completed
      setTimeout(() => {
        if (!state.isUpdateReady) {
          setState((prev) => ({ ...prev, isVisible: false }))
        }
      }, 2000)
    } else {
      handleError('Failed to check for updates')
    }
  }, [withLoading, handleError, clearError, setState, state.isUpdateReady])

  React.useEffect(() => {
    // Handle legacy updateVersion event (for backward compatibility)
    const handleUpdateVersion = (event: Event & { detail?: any }) => {
      if (event.detail) {
        setState((prev) => ({
          ...prev,
          isVisible: true,
          isUpdateReady: true,
        }))
        clearError()
      }
    }

    // Handle new enhanced service worker events
    const handleUpdateFound = () => {
      setState((prev) => ({
        ...prev,
        isVisible: true,
        isUpdateReady: false,
      }))
      clearError()
    }

    const handleUpdateReady = () => {
      setState((prev) => ({
        ...prev,
        isVisible: true,
        isUpdateReady: true,
      }))
      clearError()
    }

    const handleOfflineReady = () => {
      setState((prev) => ({
        ...prev,
        isVisible: true,
        isOfflineReady: true,
      }))
      clearError()
      // Auto-hide offline ready message after 5 seconds
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isVisible: false,
          isOfflineReady: false,
        }))
      }, 5000)
    }

    const handleServiceWorkerError = (event: Event & { detail?: any }) => {
      const error = event.detail?.error
      setState((prev) => ({
        ...prev,
        isVisible: true,
      }))
      handleError(error?.message || 'Service Worker error occurred')
    }

    // Register event listeners
    window.addEventListener('updateVersion', handleUpdateVersion)
    window.addEventListener('sw-update-found', handleUpdateFound)
    window.addEventListener('sw-update-ready', handleUpdateReady)
    window.addEventListener('sw-ready', handleOfflineReady)
    window.addEventListener('sw-error', handleServiceWorkerError)

    return () => {
      window.removeEventListener('updateVersion', handleUpdateVersion)
      window.removeEventListener('sw-update-found', handleUpdateFound)
      window.removeEventListener('sw-update-ready', handleUpdateReady)
      window.removeEventListener('sw-ready', handleOfflineReady)
      window.removeEventListener('sw-error', handleServiceWorkerError)
    }
  }, [setState, clearError, handleError])

  const getAlertSeverity = () => {
    if (updateError) return 'error'
    if (state.isOfflineReady) return 'success'
    if (state.isUpdateReady) return 'warning'
    return 'info'
  }

  const getAlertIcon = () => {
    if (isUpdating) return <CircularProgress size={20} />
    if (updateError) return <ErrorIcon />
    if (state.isOfflineReady) return <CheckCircleIcon />
    if (state.isUpdateReady) return <UpdateIcon />
    return <RefreshIcon />
  }

  const getMessage = () => {
    if (updateError) return updateError.message
    if (state.isOfflineReady) return 'App is ready for offline use'
    if (state.isUpdateReady)
      return 'New version available, click update to experience now'
    if (isUpdating) return 'Checking for updates...'
    return 'Check for app updates'
  }

  const getActionButtons = () => {
    if (updateError) {
      return (
        <>
          <Button
            color='inherit'
            size='small'
            onClick={handleCheckForUpdates}
            disabled={isUpdating}
            startIcon={
              isUpdating ? <CircularProgress size={16} /> : <RefreshIcon />
            }
          >
            Retry
          </Button>
          <IconButton
            aria-label='close'
            color='inherit'
            sx={{ p: 0.5 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </>
      )
    }

    if (state.isOfflineReady) {
      return (
        <IconButton
          aria-label='close'
          color='inherit'
          sx={{ p: 0.5 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      )
    }

    if (state.isUpdateReady) {
      return (
        <>
          <Button
            color='inherit'
            size='small'
            onClick={handleUpdate}
            disabled={isUpdating}
            startIcon={
              isUpdating ? <CircularProgress size={16} /> : <UpdateIcon />
            }
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </Button>
          <IconButton
            aria-label='close'
            color='inherit'
            sx={{ p: 0.5 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </>
      )
    }

    return (
      <>
        <Button
          color='inherit'
          size='small'
          onClick={handleCheckForUpdates}
          disabled={isUpdating}
          startIcon={
            isUpdating ? <CircularProgress size={16} /> : <RefreshIcon />
          }
        >
          Check for Updates
        </Button>
        <IconButton
          aria-label='close'
          color='inherit'
          sx={{ p: 0.5 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </>
    )
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={state.isVisible}
      onClose={handleClose}
      autoHideDuration={state.isOfflineReady ? 5000 : undefined}
    >
      <Alert
        severity={getAlertSeverity()}
        icon={getAlertIcon()}
        sx={{
          minWidth: '300px',
          alignItems: 'center',
          '& .MuiAlert-message': {
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
          },
        }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getActionButtons()}
          </Box>
        }
      >
        <Typography variant='body2' component='div'>
          {getMessage()}
        </Typography>
        {state.lastUpdateCheck > 0 && !state.isUpdateReady && !updateError && (
          <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5 }}>
            Last checked: {new Date(state.lastUpdateCheck).toLocaleTimeString()}
          </Typography>
        )}
      </Alert>
    </Snackbar>
  )
}
