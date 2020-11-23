import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import { makeStyles, createStyles } from '@material-ui/core'
import Box from '@material-ui/core/Box'

import { useProject } from 'src/store/hooks'

import ImageGlyph from './ImageGlyph'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
    },
  }),
)

const ImageGlyphList: FunctionComponent<unknown> = () => {
  const { glyphImages } = useProject()
  const classes = useStyles()
  return (
    <Box className={classes.root}>
      {glyphImages.map((glyph) => {
        return <ImageGlyph glyph={glyph} key={glyph.src} />
      })}
    </Box>
  )
}

export default observer(ImageGlyphList)
