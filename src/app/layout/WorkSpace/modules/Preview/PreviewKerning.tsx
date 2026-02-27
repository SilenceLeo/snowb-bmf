import Box from '@mui/material/Box'
import Input from '@mui/material/Input'
import Typography from '@mui/material/Typography'
import React, { FunctionComponent, useEffect, useState } from 'react'
import GridInput from 'src/app/components/GridInput'
import {
  getOpentype,
  setKerning,
  useFontSize,
  useGlyphForLetter,
  useGlyphKerning,
  useSelectLetter,
} from 'src/store/legend'

const PreviewKerning: FunctionComponent = () => {
  const { selectLetter, selectNextLetter } = useSelectLetter()
  const glyph = useGlyphForLetter(selectLetter)
  const fontSize = useFontSize()
  const [offset, setOffset] = useState(0)

  const currentKerning = useGlyphKerning(glyph?.letter, selectNextLetter)

  // Calculate the opentype kerning offset between the two letters
  useEffect(() => {
    if (glyph && selectNextLetter) {
      const opentype = getOpentype()
      if (opentype) {
        const fontScale = (1 / opentype.unitsPerEm) * fontSize
        const kerningValue = opentype.getKerningValue(
          opentype.charToGlyphIndex(glyph.letter),
          opentype.charToGlyphIndex(selectNextLetter),
        )
        setOffset(Math.round(kerningValue * fontScale))
      } else {
        setOffset(0)
      }
    } else {
      setOffset(0)
    }
  }, [glyph, selectNextLetter, fontSize])

  // Handle kerning value change
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    if (glyph) {
      const newKerningValue = Number(e.target.value) - offset
      setKerning(glyph.letter, selectNextLetter, newKerningValue)
    }
  }

  if (!glyph || !selectNextLetter) {
    return null
  }

  return (
    <>
      <Box paddingX={2} marginY={4}>
        <Typography>{`"${glyph.letter}" - "${selectNextLetter}" Kerning`}</Typography>
      </Box>
      <Box paddingX={2} marginY={4}>
        <GridInput before='Amount:' after='px'>
          <Input
            value={currentKerning + offset}
            fullWidth
            type='number'
            onChange={handleChange}
          />
        </GridInput>
      </Box>
    </>
  )
}

export default PreviewKerning
