import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { observer } from 'mobx-react-lite'
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useProject } from 'src/store/hooks'

import ConfigSection from '../../../components/ConfigSection'

const Glyphs: FunctionComponent<unknown> = () => {
  const { text, setText } = useProject()
  const [isIME, setIsIME] = useState(false)
  const [inputText, setInputText] = useState(text)

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { value } = event.target
    const str = Array.from(new Set(Array.from(value))).join('')
    if (isIME) {
      setInputText(value)
    } else {
      setInputText(str)
      if (str !== text) {
        setText(str)
      }
    }
  }

  const handleCompositionStart = useCallback((): void => {
    setInputText(text)
    setIsIME(true)
  }, [text])

  const handleCompositionEnd = (): void => {
    setIsIME(false)
    const str = Array.from(new Set(Array.from(inputText))).join('')
    setInputText(str)
    if (str !== text) {
      setText(str)
    }
  }

  useEffect(() => {
    setInputText(text)
  }, [text])

  return (
    <ConfigSection title='Glyphs'>
      <Box sx={{ px: 2, my: 4 }}>
        <TextField
          margin='none'
          value={isIME ? inputText : text}
          fullWidth
          multiline
          rows={4}
          variant='outlined'
          size='small'
          onChange={handleInput}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          slotProps={{
            htmlInput: { spellCheck: false },
          }}
        />
      </Box>
    </ConfigSection>
  )
}

export default observer(Glyphs)
