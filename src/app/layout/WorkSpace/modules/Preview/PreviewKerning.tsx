import Box from '@mui/material/Box'
import Input from '@mui/material/Input'
import Typography from '@mui/material/Typography'
import { observer } from 'mobx-react-lite'
import React, { FunctionComponent, useEffect, useState } from 'react'
import GridInput from 'src/app/components/GridInput'
import { GlyphFont, GlyphImage } from 'src/store'
import { useProject } from 'src/store/hooks'

const GlobalMetric: FunctionComponent<unknown> = () => {
  const {
    glyphList,
    ui,
    style: {
      font: { opentype, size },
    },
  } = useProject()
  const [offset, setOffset] = useState(0)
  const [glyph, setGlyph] = useState<GlyphFont | GlyphImage | undefined>()

  useEffect(() => {
    setGlyph(glyphList.find((gl) => gl.letter === ui.selectLetter))
  }, [glyphList, ui.selectLetter])

  useEffect(() => {
    if (glyph && ui.selectNextLetter && opentype) {
      const fontScale = (1 / opentype.unitsPerEm) * size
      setOffset(
        Math.round(
          opentype.getKerningValue(
            opentype.charToGlyphIndex(glyph.letter),
            opentype.charToGlyphIndex(ui.selectNextLetter),
          ) * fontScale,
        ),
      )
    }
  }, [glyph, opentype, size, ui.selectNextLetter])

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    if (glyph) {
      glyph.steKerning(ui.selectNextLetter, Number(e.target.value) - offset)
    }
  }

  if (!glyph || !ui.selectNextLetter) {
    return null
  }

  return (
    <>
      <Box paddingX={2} marginY={4}>
        <Typography>{`"${glyph.letter}" - "${ui.selectNextLetter}" Kerning`}</Typography>
      </Box>
      <Box paddingX={2} marginY={4}>
        <GridInput before='Amount:' after='px'>
          <Input
            value={(glyph.kerning.get(ui.selectNextLetter) || 0) + offset}
            fullWidth
            type='number'
            onChange={handleChange}
          />
        </GridInput>
      </Box>
    </>
  )
}

export default observer(GlobalMetric)
