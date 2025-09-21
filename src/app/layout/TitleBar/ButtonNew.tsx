import Button from '@mui/material/Button'
import { SxProps, Theme } from '@mui/material/styles'
import hotkeys from 'hotkeys-js'
import { observer } from 'mobx-react-lite'
import { FunctionComponent, useCallback, useEffect } from 'react'
import { useWorkspace } from 'src/store/hooks'

interface ButtonNewProps {
  sx?: SxProps<Theme>
}

const ButtonNew: FunctionComponent<ButtonNewProps> = (
  props: ButtonNewProps,
) => {
  const { sx } = props

  const workSpace = useWorkspace()
  const { addProject } = workSpace

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
    <Button sx={sx} title='New Project (ALT + N)' onClick={handleNewProject}>
      New
    </Button>
  )
}

export default observer(ButtonNew)
