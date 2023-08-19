import Button from '@mui/material/Button'
import hotkeys from 'hotkeys-js'
import { observer } from 'mobx-react-lite'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { useWorkspace } from 'src/store/hooks'

interface ButtonNewProps {
  className?: string
}

const ButtonNew: FunctionComponent<ButtonNewProps> = (
  props: ButtonNewProps,
) => {
  const { className } = props

  const worckSpace = useWorkspace()
  const { addProject } = worckSpace

  const handleNewProject = useCallback(
    (e: { preventDefault(): void }) => {
      e.preventDefault()
      addProject()
      return false
    },
    [addProject],
  )

  useEffect(() => {
    hotkeys.unbind('alt+n,control+n')
    hotkeys('alt+n,control+n', handleNewProject)
    return () => {
      hotkeys.unbind('alt+n,control+n')
    }
  }, [handleNewProject])

  return (
    <Button
      className={className}
      title='New Project (ALT + N)'
      onClick={handleNewProject}
    >
      New
    </Button>
  )
}

export default observer(ButtonNew)
