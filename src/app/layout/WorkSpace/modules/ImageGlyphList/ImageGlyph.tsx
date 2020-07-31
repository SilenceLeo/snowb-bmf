import React, { useState, FunctionComponent } from 'react'
import { observer } from 'mobx-react'

import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Checkbox from '@material-ui/core/Checkbox'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

import { GlyphImage } from 'src/store'
import { useProject } from 'src/store/hooks'

import { makeStyles, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: theme.spacing(24),
      height: theme.spacing(24),
      margin: theme.spacing(2),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    image: {
      maxWidth: '100%',
      maxHeight: '100%',
      pointerEvents: 'none',
    },
    actions: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0,
    },
    inputLabel: {
      width: '100%',
      height: '100%',
      '& input': {
        textAlign: 'center',
      },
    },
  }),
)

interface ImageGlyphProps {
  glyph: GlyphImage
  selected?: boolean
}

const ImageGlyph: FunctionComponent<ImageGlyphProps> = (
  props: ImageGlyphProps,
) => {
  const classes = useStyles()
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
    <Paper variant='outlined' className={classes.root}>
      <img className={classes.image} src={glyph.src} alt={glyph.fileName} />
      <Grid container direction='column' className={classes.actions}>
        <Grid item container justify='space-between' alignItems='center'>
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
        <Grid
          item
          xs
          component='label'
          className={classes.inputLabel}
          container
          alignItems='flex-end'
        >
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
