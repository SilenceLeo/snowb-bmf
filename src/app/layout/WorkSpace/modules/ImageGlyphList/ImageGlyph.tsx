import React, { useState, FunctionComponent } from 'react'
import { observer } from 'mobx-react'

import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

import { GlyphImage } from 'src/store'
import { useProject } from 'src/store/hooks'

import styles from './ImageGlyph.module.scss'

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
    <Paper variant='outlined' className={styles.root}>
      <img className={styles.image} src={glyph.src} alt={glyph.fileName} />
      <Grid container sx={{ direction: 'column' }} className={styles.actions}>
        <Grid
          item
          container
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Checkbox
            checked={selected}
            size='small'
            color='default'
            onChange={(e) => changeSelect(e.target.checked)}
          />
          <IconButton
            color='primary'
            size='small'
            onClick={() => removeImage(glyph)}
          >
            <DeleteIcon fontSize='small' />
          </IconButton>
        </Grid>
        <Grid item xs component='label' className={styles.inputLabel} container>
          <InputBase
            fullWidth
            value={isIME ? inputValue : glyph.letter}
            onFocus={(e) => e.target.select()}
            onInput={handleChangeGlyph}
            onCompositionEnd={handleCompositionEnd}
            onCompositionStart={() => setIsIME(true)}
          />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default observer(ImageGlyph)
