import React, { FunctionComponent } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

import readFile from 'src/utils/supports/readFile'

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: theme.spacing(12),
      height: theme.spacing(12),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      border: `1px solid ${theme.palette.primary.main}`,
      cursor: 'pointer',
      ...theme.bgPixel,
    },
    image: {
      maxWidth: '100%',
      maxHeight: '100%',
      pointerEvents: 'none',
    },
  }),
)

interface FileSelectorProps {
  src: string
  onChange(image: ArrayBuffer): void
}

const FileSelector: FunctionComponent<FileSelectorProps> = (
  props: FileSelectorProps,
) => {
  const { src, onChange } = props
  const classes = useStyles()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return
    if (e.target.files.length > 0) {
      readFile(e.target.files[0]).then((buffer) => {
        if (buffer instanceof ArrayBuffer) onChange(buffer)
      })
    }
  }

  return (
    <Box component='label' className={classes.root}>
      <input
        hidden
        type='file'
        multiple
        accept='image/*'
        onChange={handleChange}
      />
      <img className={classes.image} src={src} alt='' />
    </Box>
  )
}

export default FileSelector
