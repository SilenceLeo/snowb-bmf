import Button from '@mui/material/Button'
import { SxProps, Theme } from '@mui/material/styles'
import hotkeys from 'hotkeys-js'
import { FunctionComponent, useCallback, useEffect } from 'react'
import { createNewLegendProject } from 'src/utils/persistence'

interface ButtonNewProps {
  sx?: SxProps<Theme>
}

const ButtonNew: FunctionComponent<ButtonNewProps> = (
  props: ButtonNewProps,
) => {
  const { sx } = props

  const handleNewProject = useCallback((e: { preventDefault(): void }) => {
    e.preventDefault()
    createNewLegendProject()
  }, [])

  useEffect(() => {
    hotkeys('alt+n,control+n', handleNewProject)
    return () => {
      hotkeys.unbind('alt+n,control+n', handleNewProject)
    }
  }, [handleNewProject])

  return (
    <Button sx={sx} title='New Project (ALT + N)' onClick={handleNewProject}>
      New
    </Button>
  )
}

export default ButtonNew
