import React, { FunctionComponent, useRef } from 'react'
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
  const { addProject } = worckSpace

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target?.files || !e.target.files[0]) return
    const file = e.target.files[0]
    const isText = /\.ltr$/.test(file.name)

    readFile(file, isText).then((buffer) => {
      try {
        addProject(conversion(buffer))
      } catch (e) {
        Sentry.captureException(e)
        enqueueSnackbar((e as Error).toString(), { variant: 'error' })
      }
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
      <input type='file' onChange={handleLoad} accept='.sbf,.ltr' hidden />
    </Button>
  )
}

export default observer(ButtonOpen)
