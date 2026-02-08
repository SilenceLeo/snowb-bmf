import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { FunctionComponent } from 'react'
import FormAdjustMetric from 'src/app/layout/common/FormAdjustMetric'
import {
  findImageGlyphIndex,
  setGlyphAdjustMetric,
  setImageGlyphAdjustMetric,
  useGlyphForLetter,
  useSelectLetter,
} from 'src/store/legend'

const PreviewMetric: FunctionComponent = () => {
  const { selectLetter } = useSelectLetter()
  const glyph = useGlyphForLetter(selectLetter)

  if (!glyph) {
    return null
  }

  const { adjustMetric, letter, type } = glyph

  // Create setter functions based on glyph type
  const handleSetXAdvance = (value: number): void => {
    if (type === 'image') {
      const index = findImageGlyphIndex(letter)
      if (index >= 0) {
        setImageGlyphAdjustMetric(index, { xAdvance: value })
      }
    } else {
      setGlyphAdjustMetric(letter, { xAdvance: value })
    }
  }

  const handleSetXOffset = (value: number): void => {
    if (type === 'image') {
      const index = findImageGlyphIndex(letter)
      if (index >= 0) {
        setImageGlyphAdjustMetric(index, { xOffset: value })
      }
    } else {
      setGlyphAdjustMetric(letter, { xOffset: value })
    }
  }

  const handleSetYOffset = (value: number): void => {
    if (type === 'image') {
      const index = findImageGlyphIndex(letter)
      if (index >= 0) {
        setImageGlyphAdjustMetric(index, { yOffset: value })
      }
    } else {
      setGlyphAdjustMetric(letter, { yOffset: value })
    }
  }

  return (
    <>
      <Box paddingX={2} marginY={4}>
        <Typography>{`"${letter}" Adjustment`}</Typography>
      </Box>
      <FormAdjustMetric
        xAdvance={adjustMetric.xAdvance}
        xOffset={adjustMetric.xOffset}
        yOffset={adjustMetric.yOffset}
        setXAdvance={handleSetXAdvance}
        setXOffset={handleSetXOffset}
        setYOffset={handleSetYOffset}
      />
    </>
  )
}

export default PreviewMetric
