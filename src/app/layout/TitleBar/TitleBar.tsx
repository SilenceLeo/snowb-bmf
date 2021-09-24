import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { toJS } from 'mobx'
import hotkeys from 'hotkeys-js'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import GitHubIcon from '@material-ui/icons/GitHub'
import ErrorIcon from '@material-ui/icons/Error'
import Snackbar from '@material-ui/core/Snackbar'

import { useWorkspace } from 'src/store/hooks'

import readFile from 'src/utils/readFile'

import outputFile from 'src/file/outputFile'
import saveProject from 'src/file/saveProject'
import decodeProject from 'src/file/decodeProject'

import ExportButton from './ExportButton'

const useStyles = makeStyles(({ zIndex, spacing }) =>
  createStyles({
    root: {
      position: 'relative',
      zIndex: zIndex.appBar,
    },
    appName: {
      fontSize: '1.25rem',
      fontWeight: 'bolder',
      marginRight: spacing(4),
    },
    appNameSup: {
      fontWeight: 'lighter',
      fontSize: '0.5em',
      marginLeft: '0.5rem',
    },
    btn: {
      textTransform: 'none',
    },
  }),
)

const TitleBar: FunctionComponent<unknown> = () => {
  const classes = useStyles()
  const [toast, setToast] = useState<{
    open: boolean
    component: React.ReactNode | null
  }>({ open: false, component: null })
  const worckSpace = useWorkspace()
  const labelRef = useRef<HTMLLabelElement>(null)
  const { addProject } = worckSpace
  const project = worckSpace.currentProject
  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target?.files && e.target.files[0]) {
      readFile(e.target.files[0]).then((buffer) => {
        try {
          if (buffer instanceof ArrayBuffer) addProject(decodeProject(buffer))
        } catch (err) {
          setToast({
            open: true,
            component: (
              <Box display='flex' alignItems='center'>
                <ErrorIcon />
                {`${(err as Error).toString()}`}
              </Box>
            ),
          })
        }
      })
    }
  }

  const handleNewProject = useCallback(
    (e: { preventDefault(): void }) => {
      e.preventDefault()
      addProject()
      return false
    },
    [addProject],
  )

  const handleSaveProject = useCallback(
    (e: { preventDefault(): void }) => {
      e.preventDefault()
      saveProject(toJS(project))
      return false
    },
    [project],
  )

  const handleSaveBitmapFont = useCallback(
    (config) => {
      outputFile(project, config)
    },
    [project],
  )

  const handleOpenProject = useCallback((e: { preventDefault(): void }) => {
    e.preventDefault()
    if (labelRef.current) labelRef.current.click()
    return false
  }, [])

  const handleToastClose = () => {
    setToast((t) => {
      return {
        ...t,
        open: false,
      }
    })
  }

  useEffect(() => {
    hotkeys.unbind('alt+n,control+n')
    hotkeys.unbind('ctrl+s')
    hotkeys.unbind('ctrl+o,command+o')
    hotkeys('alt+n,control+n', handleNewProject)
    hotkeys('ctrl+s', handleSaveProject)
    hotkeys('ctrl+o,command+o', handleOpenProject)
    return () => {
      hotkeys.unbind('alt+n,control+n')
      hotkeys.unbind('ctrl+s')
      hotkeys.unbind('ctrl+o,command+o')
    }
  }, [handleNewProject, handleOpenProject, handleSaveProject])

  return (
    <Box
      className={classes.root}
      bgcolor='background.titleBar'
      paddingX={4}
      display='flex'
      alignItems='center'
    >
      {/* lowing modifiers: ⇧, shift, option, ⌥, alt, ctrl, control, command, and ⌘. */}
      <Typography variant='h1' className={classes.appName}>
        SnowB BMF
        <sup className={classes.appNameSup}>BETA</sup>
      </Typography>
      <Box flex='auto' paddingX={4}>
        <Button
          className={classes.btn}
          title='New Project (ALT + N)'
          onClick={handleNewProject}
        >
          New
        </Button>
        <Button
          className={classes.btn}
          title='Open Project (⌘ + O)'
          component='label'
          ref={labelRef}
        >
          Open
          <input type='file' onChange={handleLoad} accept='.sbf' hidden />
        </Button>
        <Button
          className={classes.btn}
          title='Save Project (⌘ + S)'
          onClick={handleSaveProject}
        >
          Save
        </Button>
        <ExportButton className={classes.btn} onSave={handleSaveBitmapFont} />
      </Box>
      <IconButton
        size='small'
        component='a'
        href='https://github.com/SilenceLeo/snowb-bmf'
        target='_blank'
        title='GitHub'
      >
        <GitHubIcon />
      </IconButton>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={toast.open}
        onClose={handleToastClose}
        message={toast.component}
      />
    </Box>
  )
}
export default observer(TitleBar)
