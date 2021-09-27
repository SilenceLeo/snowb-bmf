import React, { useEffect, FunctionComponent, useCallback } from 'react'
import { toJS } from 'mobx'
import hotkeys from 'hotkeys-js'
import { saveAs } from 'file-saver'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'
import Button from '@material-ui/core/Button'

import { encode } from 'src/file/conversion'
import { useWorkspace } from 'src/store/hooks'

interface ButtonSaveProps {
  className?: string
}

const ButtonSave: FunctionComponent<ButtonSaveProps> = (
  props: ButtonSaveProps,
) => {
  const { className } = props

  const { enqueueSnackbar } = useSnackbar()
  const worckSpace = useWorkspace()
  const { currentProject: project } = worckSpace

  const handleSaveProject = useCallback(
    (e: { preventDefault(): void }) => {
      e.preventDefault()
      try {
        const buffer = encode(toJS(project))
        saveAs(new Blob([buffer]), `${project.name}.sbf`)
      } catch (e) {
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
    <Button
      className={className}
      title='Save Project (⌘ + S)'
      onClick={handleSaveProject}
    >
      Save
    </Button>
  )
}

export default observer(ButtonSave)
