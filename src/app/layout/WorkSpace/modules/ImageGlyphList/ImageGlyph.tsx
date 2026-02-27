import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import {
  removeImage,
  setImageGlyphLetter,
  setImageGlyphSelected,
  useImageGlyph,
} from 'src/store/legend'

interface ImageGlyphProps {
  index: number
}

const ImageGlyph: FunctionComponent<ImageGlyphProps> = ({ index }) => {
  const glyph = useImageGlyph(index)
  const [isIME, setIsIME] = useState(false)
  const [inputValue, setInputValue] = useState(glyph?.letter || '')
  const inputValueRef = useRef(inputValue)
  inputValueRef.current = inputValue

  // Update inputValue when glyph letter changes (e.g., on project load)
  useEffect(() => {
    if (glyph?.letter !== undefined) {
      setInputValue(glyph.letter)
    }
  }, [glyph?.letter])

  if (!glyph) {
    return null
  }

  const handleChangeGlyph = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target
    if (isIME) {
      // During IME composition, only update local state
      setInputValue(value)
    } else {
      setImageGlyphLetter(index, value)
    }
  }

  const handleCompositionEnd = (): void => {
    setIsIME(false)
    const letter = inputValueRef.current.slice(0, 1)
    setInputValue(letter)
    setImageGlyphLetter(index, letter)
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setImageGlyphSelected(index, e.target.checked)
  }

  const handleDelete = (): void => {
    removeImage(index)
  }

  return (
    <Paper
      variant='outlined'
      sx={{
        width: 80,
        height: 80,
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        '& img': {
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
        },
      }}
    >
      <img src={glyph.src} alt={glyph.fileName} />
      <Stack
        direction='column'
        spacing={0}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'stretch',
          width: '100%',
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      >
        <Stack
          direction='row'
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Checkbox
            checked={glyph.selected}
            size='small'
            color='default'
            onChange={handleSelectChange}
          />
          <IconButton color='info' size='small' onClick={handleDelete}>
            <DeleteIcon fontSize='small' />
          </IconButton>
        </Stack>
        <Box
          component='label'
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            background:
              'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.8))',
          }}
        >
          <InputBase
            fullWidth
            value={isIME ? inputValue : glyph.letter}
            onFocus={(e) => e.target.select()}
            onInput={handleChangeGlyph}
            onCompositionEnd={handleCompositionEnd}
            onCompositionStart={() => setIsIME(true)}
            slotProps={{
              input: {
                sx: {
                  textAlign: 'center',
                },
              },
            }}
          />
        </Box>
      </Stack>
    </Paper>
  )
}

export default ImageGlyph
