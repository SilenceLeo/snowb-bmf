import React, { useState, FunctionComponent, useRef } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import ErrorIcon from '@material-ui/icons/Error'
import Snackbar from '@material-ui/core/Snackbar'

import { useWorkspace } from 'src/store/hooks'

import readFile from 'src/utils/readFile'
import decodeProject from 'src/file/decodeProject'

interface ButtonOpenProps {
  className?: string
}

const ButtonOpen: FunctionComponent<ButtonOpenProps> = (
  props: ButtonOpenProps,
) => {
  const { className } = props
  const [toast, setToast] = useState<{
    open: boolean
    component: React.ReactNode | null
  }>({ open: false, component: null })
  const worckSpace = useWorkspace()
  const labelRef = useRef<HTMLLabelElement>(null)
  const { addProject } = worckSpace

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target?.files || !e.target.files[0]) return
    const file = e.target.files[0]
    const isText = /\.ltr$/.test(file.name)
    console.log(isText)
    readFile(file, isText).then((buffer) => {
      try {
        if (typeof buffer === 'string') console.log(JSON.parse(buffer))
        else if (buffer) addProject(decodeProject(buffer))
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

  const handleToastClose = () => {
    setToast((t) => {
      return {
        ...t,
        open: false,
      }
    })
  }

  return (
    <>
      <Button
        className={className}
        title='Open Project (⌘ + O)'
        component='label'
        ref={labelRef}
      >
        Open
        <input type='file' onChange={handleLoad} accept='.sbf,.ltr' hidden />
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={toast.open}
        onClose={handleToastClose}
        message={toast.component}
      />
    </>
  )
}

export default observer(ButtonOpen)
