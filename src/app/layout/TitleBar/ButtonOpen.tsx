import React, { FunctionComponent, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'
import * as Sentry from '@sentry/react'
import Button from '@material-ui/core/Button'
import { useWorkspace } from 'src/store/hooks'

import readFile from 'src/utils/readFile'
import conversion from 'src/file/conversion'

interface ButtonOpenProps {
  className?: string
}

const ButtonOpen: FunctionComponent<ButtonOpenProps> = (
  props: ButtonOpenProps,
) => {
  const { className } = props
  const { enqueueSnackbar } = useSnackbar()

  const worckSpace = useWorkspace()
  const labelRef = useRef<HTMLLabelElement>(null)
  const [inputKey, changeInputKey] = useState(Date.now())
  const { addProject } = worckSpace

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target?.files || !e.target.files[0]) return
    const file = e.target.files[0]
    const isText = /\.ltr$/.test(file.name)

    readFile(file, isText).then((buffer) => {
      try {
        const project = conversion(buffer)
        if (!project.name) project.name = file.name
        if (addProject(project)) {
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
  }

  return (
    <Button
      className={className}
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

export default observer(ButtonOpen)
