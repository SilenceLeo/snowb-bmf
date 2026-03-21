import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { FunctionComponent, useMemo } from 'react'
import FormAdjustMetric from 'src/app/layout/common/FormAdjustMetric'
import type { MetricData } from 'src/types/style'
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

  const setters = useMemo(() => {
    if (!glyph) return null
    const { letter, type } = glyph
    const createSetter = (key: keyof MetricData) => (value: number) => {
      if (type === 'image') {
        const idx = findImageGlyphIndex(letter)
        if (idx >= 0) setImageGlyphAdjustMetric(idx, { [key]: value })
      } else {
        setGlyphAdjustMetric(letter, { [key]: value })
      }
    }
    return {
      setXAdvance: createSetter('xAdvance'),
      setXOffset: createSetter('xOffset'),
      setYOffset: createSetter('yOffset'),
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally depend on letter/type only, not the full glyph object
  }, [glyph?.letter, glyph?.type])

  if (!glyph || !setters) {
    return null
  }

  return (
    <>
      <Box paddingX={2} marginY={4}>
        <Typography>{`"${glyph.letter}" Adjustment`}</Typography>
      </Box>
      <FormAdjustMetric
        xAdvance={glyph.adjustMetric.xAdvance}
        xOffset={glyph.adjustMetric.xOffset}
        yOffset={glyph.adjustMetric.yOffset}
        setXAdvance={setters.setXAdvance}
        setXOffset={setters.setXOffset}
        setYOffset={setters.setYOffset}
      />
    </>
  )
}

export default PreviewMetric
