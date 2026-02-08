import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { setPreviewText, usePreviewText } from 'src/store/legend'

const Preview: FunctionComponent = () => {
  const previewText = usePreviewText()
  const [isIME, setIsIME] = useState(false)
  const [inputText, setInputText] = useState(previewText)

  // Sync inputText when previewText changes externally (e.g., project switch)
  useEffect(() => {
    setInputText(previewText)
  }, [previewText])

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { value } = event.target
    if (isIME) {
      setInputText(value)
    } else {
      setInputText(value)
      if (value !== previewText) {
        setPreviewText(value)
      }
    }
  }

  const handleCompositionEnd = (): void => {
    setIsIME(false)
    setInputText(inputText)
    if (inputText !== previewText) {
      setPreviewText(inputText)
    }
  }

  return (
    <Box>
      <Box paddingX={2} marginY={4}>
        <Typography>Glyphs</Typography>
      </Box>
      <Box paddingX={2} marginY={4}>
        <TextField
          margin='none'
          value={isIME ? inputText : previewText}
          fullWidth
          multiline
          rows={7}
          variant='outlined'
          onChange={handleInput}
          onCompositionStart={() => setIsIME(true)}
          onCompositionEnd={handleCompositionEnd}
          slotProps={{
            htmlInput: { spellCheck: false },
          }}
        />
      </Box>
    </Box>
  )
}

export default Preview
