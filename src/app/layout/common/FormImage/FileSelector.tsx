import React, { FunctionComponent } from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

import readFile from 'src/utils/readFile'

interface FileSelectorProps {
  src: string
  onChange(image: ArrayBuffer): void
}

const FileSelector: FunctionComponent<FileSelectorProps> = (
  props: FileSelectorProps,
) => {
  const { src, onChange } = props
  const theme = useTheme()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return
    if (e.target.files.length > 0) {
      readFile(e.target.files[0]).then((buffer) => {
        if (buffer instanceof ArrayBuffer) onChange(buffer)
      })
    }
  }

  return (
    <Box
      component='label'
      sx={{
        width: theme.spacing(12),
        height: theme.spacing(12),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        border: `1px solid ${theme.palette.primary.main}`,
        cursor: 'pointer',
        ...theme.bgPixel,
      }}
    >
      <input
        hidden
        type='file'
        multiple
        accept='image/*'
        onChange={handleChange}
      />
      <img
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          pointerEvents: 'none',
        }}
        src={src}
        alt=''
      />
    </Box>
  )
}

export default FileSelector
