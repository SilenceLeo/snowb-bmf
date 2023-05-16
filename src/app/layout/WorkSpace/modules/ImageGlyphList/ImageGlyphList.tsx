import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Box from '@mui/material/Box'

import { useProject } from 'src/store/hooks'

import ImageGlyph from './ImageGlyph'

import styles from './ImageGlyphList.module.scss'

const ImageGlyphList: FunctionComponent<unknown> = () => {
  const { glyphImages } = useProject()

  return (
    <Box className={styles.root}>
      {glyphImages.map((glyph) => {
        return <ImageGlyph glyph={glyph} key={glyph.src} />
      })}
    </Box>
  )
}

export default observer(ImageGlyphList)
