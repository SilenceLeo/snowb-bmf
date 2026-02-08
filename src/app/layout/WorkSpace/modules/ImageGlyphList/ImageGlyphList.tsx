import Box from '@mui/material/Box'
import { FunctionComponent } from 'react'
import { useImageGlyphs } from 'src/store/legend'

import ImageGlyph from './ImageGlyph'

const ImageGlyphList: FunctionComponent = () => {
  const imageGlyphs = useImageGlyphs()

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      {imageGlyphs.map((glyph, index) => (
        <ImageGlyph index={index} key={glyph.uid} />
      ))}
    </Box>
  )
}

export default ImageGlyphList
