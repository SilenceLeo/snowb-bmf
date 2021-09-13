import React, { useEffect, FunctionComponent, useCallback } from 'react'
import { toJS } from 'mobx'
import hotkeys from 'hotkeys-js'
import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button'

import saveProject from 'src/file/saveProject'
import { useWorkspace } from 'src/store/hooks'

interface ButtonSaveProps {
  className?: string
}

const ButtonSave: FunctionComponent<ButtonSaveProps> = (
  props: ButtonSaveProps,
) => {
  const { className } = props

  const worckSpace = useWorkspace()
  const { currentProject: project } = worckSpace

  const handleSaveProject = useCallback(
    (e: { preventDefault(): void }) => {
      e.preventDefault()
      saveProject(toJS(project))
      return false
    },
    [project],
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
