import Button from '@mui/material/Button'
import { SxProps, Theme } from '@mui/material/styles'
import * as Sentry from '@sentry/react'
import { saveAs } from 'file-saver'
import hotkeys from 'hotkeys-js'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useSnackbar } from 'notistack'
import { FunctionComponent, useCallback, useEffect } from 'react'
import { encode } from 'src/file/conversion'
import { useWorkspace } from 'src/store/hooks'

interface ButtonSaveProps {
  sx?: SxProps<Theme>
}

const ButtonSave: FunctionComponent<ButtonSaveProps> = (
  props: ButtonSaveProps,
) => {
  const { sx } = props

  const { enqueueSnackbar } = useSnackbar()
  const workSpace = useWorkspace()
  const { currentProject: project } = workSpace

  const handleSaveProject = useCallback(
    (e: { preventDefault(): void }) => {
      e.preventDefault()
      try {
        const buffer = encode(toJS(project))
        saveAs(new Blob([buffer as BlobPart]), `${project.name}.sbf`)
      } catch (e) {
        Sentry.captureException(e)
        enqueueSnackbar((e as Error).message)
      }
    },
    [enqueueSnackbar, project],
  )

  useEffect(() => {
    hotkeys.unbind('ctrl+s')
    hotkeys('ctrl+s', handleSaveProject)
    return () => {
      hotkeys.unbind('ctrl+s')
    }
  }, [handleSaveProject])

  return (
    <Button sx={sx} title='Save Project (⌘ + S)' onClick={handleSaveProject}>
      Save
    </Button>
  )
}

export default observer(ButtonSave)
