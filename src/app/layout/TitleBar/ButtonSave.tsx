import Button from '@mui/material/Button'
import { SxProps, Theme } from '@mui/material/styles'
import * as Sentry from '@sentry/react'
import { saveAs } from 'file-saver'
import hotkeys from 'hotkeys-js'
import { useSnackbar } from 'notistack'
import { FunctionComponent, useCallback, useEffect } from 'react'
import { encode } from 'src/file/conversion'
import type { Project } from 'src/store'
import { serializeProject } from 'src/store/legend'

interface ButtonSaveProps {
  sx?: SxProps<Theme>
}

const ButtonSave: FunctionComponent<ButtonSaveProps> = (
  props: ButtonSaveProps,
) => {
  const { sx } = props

  const { enqueueSnackbar } = useSnackbar()

  const handleSaveProject = useCallback(
    (e: { preventDefault(): void }) => {
      e.preventDefault()
      try {
        const project = serializeProject()
        // Type assertion needed: serializeProject() returns observable-derived type, encode() expects plain Project interface
        const buffer = encode(project as unknown as Project)
        saveAs(new Blob([buffer as BlobPart]), `${project.name}.sbf`)
      } catch (e) {
        Sentry.captureException(e)
        enqueueSnackbar((e as Error).message)
      }
    },
    [enqueueSnackbar],
  )

  useEffect(() => {
    hotkeys('ctrl+s,command+s', handleSaveProject)
    return () => {
      hotkeys.unbind('ctrl+s,command+s', handleSaveProject)
    }
  }, [handleSaveProject])

  return (
    <Button sx={sx} title='Save Project (⌘ + S)' onClick={handleSaveProject}>
      Save
    </Button>
  )
}

export default ButtonSave
