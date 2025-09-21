import Box from '@mui/material/Box'
import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import { useProject } from 'src/store/hooks'

import ImageGlyph from './ImageGlyph'

const ImageGlyphList: FunctionComponent<unknown> = () => {
  const { glyphImages } = useProject()

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      {glyphImages.map((glyph) => {
        return <ImageGlyph glyph={glyph} key={glyph.src} />
      })}
    </Box>
  )
}

export default observer(ImageGlyphList)
