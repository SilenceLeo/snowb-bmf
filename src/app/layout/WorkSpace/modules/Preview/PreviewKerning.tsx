import React, { useState, useEffect, FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import { deepObserve } from 'mobx-utils'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import GridInput from 'src/app/components/GridInput'

import { useProject } from 'src/store/hooks'
import { GlyphFont, GlyphImage } from 'src/store'

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
  const [kerning, setKerning] = useState(0)

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
    if (glyph)
      glyph.steKerning(ui.selectNextLetter, Number(e.target.value) - offset)
  }

  useEffect(() => {
    let disposer

    if (glyph) {
      setKerning(glyph.kerning.get(ui.selectNextLetter) || 0)
      disposer = deepObserve(glyph.kerning, () => {
        setKerning(glyph.kerning.get(ui.selectNextLetter) || 0)
      })
    }

    return disposer
  }, [glyph, ui.selectNextLetter])

  if (!glyph || !ui.selectNextLetter) return null

  return (
    <>
      <Box paddingX={2} marginY={4}>
        <Typography>{`"${glyph.letter}" - "${ui.selectNextLetter}" Kerning`}</Typography>
      </Box>
      <Box paddingX={2} marginY={4}>
        <GridInput before='Amount:' after='px'>
          <Input
            value={kerning + offset}
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
