import React, { useState, FunctionComponent } from 'react'
import { observer } from 'mobx-react'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useProjectUi } from 'src/store/hooks'

const Preview: FunctionComponent<unknown> = () => {
  const { previewText, setPreviewText } = useProjectUi()
  const [isIME, setIsIME] = useState(false)
  const [inputText, setInputText] = useState(previewText)

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { value } = event.target
    if (isIME) {
      setInputText(value)
    } else {
      setInputText(value)
      if (value !== previewText) setPreviewText(value)
    }
  }

  const handleCompositionEnd = (): void => {
    setIsIME(false)
    setInputText(inputText)
    if (inputText !== previewText) setPreviewText(inputText)
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
          inputProps={{ spellCheck: false }}
          onChange={handleInput}
          onCompositionStart={() => setIsIME(true)}
          onCompositionEnd={handleCompositionEnd}
        />
      </Box>
    </Box>
  )
}

export default observer(Preview)
