import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { observer } from 'mobx-react-lite'
import React, { FunctionComponent, useState } from 'react'
import { GlyphImage } from 'src/store'
import { useProject } from 'src/store/hooks'

interface ImageGlyphProps {
  glyph: GlyphImage
  selected?: boolean
}

const ImageGlyph: FunctionComponent<ImageGlyphProps> = (
  props: ImageGlyphProps,
) => {
  const { removeImage } = useProject()
  const [isIME, setIsIME] = useState(false)
  const { glyph } = props
  const [inputValue, setInputValue] = useState(glyph.letter)
  const { changeSelect, selected, setGlyph } = glyph

  const handleChangeGlyph = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target
    if (!isIME) {
      setGlyph(value)
    } else {
      setInputValue(value.slice(0, 1))
      setGlyph(value.slice(0, 1))
    }
  }

  const handleCompositionEnd = (): void => {
    setIsIME(false)
    setInputValue((iv) => iv.slice(0, 1))
    setGlyph(inputValue.slice(0, 1))
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
            checked={selected}
            size='small'
            color='default'
            onChange={(e) => changeSelect(e.target.checked)}
          />
          <IconButton
            color='info'
            size='small'
            onClick={() => removeImage(glyph)}
          >
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

export default observer(ImageGlyph)
