import Button from '@mui/material/Button'
import { SxProps, Theme } from '@mui/material/styles'
import * as Sentry from '@sentry/react'
import { useSnackbar } from 'notistack'
import React, { FunctionComponent, useRef, useState } from 'react'
import conversion from 'src/file/conversion'
import { addProject } from 'src/store/legend'
import readFile from 'src/utils/readFile'

interface ButtonOpenProps {
  sx?: SxProps<Theme>
}

const ButtonOpen: FunctionComponent<ButtonOpenProps> = (
  props: ButtonOpenProps,
) => {
  const { sx } = props
  const { enqueueSnackbar } = useSnackbar()

  const labelRef = useRef<HTMLLabelElement>(null)
  const [inputKey, changeInputKey] = useState(Date.now())

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target?.files?.[0]) {
      return
    }
    const file = e.target.files[0]
    const isText = /\.ltr$/.test(file.name)

    readFile(file, isText)
      .then((buffer) => {
        try {
          const project = conversion(buffer)
          if (!project.name) {
            project.name = file.name
          }
          const result = addProject(project)
          if (result.status === 1) {
            enqueueSnackbar(
              'The project already exists and has been switched to the current tab.',
              { variant: 'success' },
            )
          }
        } catch (e) {
          console.log(e)
          Sentry.captureException(e)
          enqueueSnackbar((e as Error).toString(), { variant: 'error' })
        }
        changeInputKey(Date.now())
      })
      .catch((e) => {
        console.log(e)
        Sentry.captureException(e)
        enqueueSnackbar((e as Error).toString(), { variant: 'error' })
        changeInputKey(Date.now())
      })
  }

  return (
    <Button
      sx={sx}
      title='Open Project (⌘ + O)'
      component='label'
      ref={labelRef}
    >
      Open
      <input
        type='file'
        key={inputKey}
        onChange={handleLoad}
        accept='.sbf,.ltr'
        hidden
      />
    </Button>
  )
}

export default ButtonOpen
