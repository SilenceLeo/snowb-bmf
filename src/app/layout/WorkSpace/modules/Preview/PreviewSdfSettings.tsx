import Box from '@mui/material/Box'
import Input from '@mui/material/Input'
import Typography from '@mui/material/Typography'
import { ChangeEvent, FunctionComponent } from 'react'
import ColorInput from 'src/app/components/ColorInput'
import GridInput from 'src/app/components/GridInput'
import {
  setSdfPreviewColor,
  setSdfPreviewFontSize,
  setSdfPreviewLineHeight,
  useFontLineHeight,
  useFontSize,
  useSdfPreviewColor,
  useSdfPreviewFontSize,
  useSdfPreviewLineHeight,
} from 'src/store/legend'

const PreviewSdfSettings: FunctionComponent = () => {
  const color = useSdfPreviewColor()
  const storedFontSize = useSdfPreviewFontSize()
  const storedLineHeight = useSdfPreviewLineHeight()
  const actualFontSize = useFontSize()
  const actualLineHeight = useFontLineHeight()

  const displayFontSize = storedFontSize ?? actualFontSize
  const displayLineHeight = storedLineHeight ?? actualLineHeight

  const handleFontSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setSdfPreviewFontSize(v === '' ? null : Number(v))
  }

  const handleLineHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setSdfPreviewLineHeight(v === '' ? null : Number(v))
  }

  return (
    <>
      <Box paddingX={2} marginY={4}>
        <Typography>SDF Preview</Typography>
      </Box>
      <Box paddingX={2} marginY={4}>
        <GridInput before='Color:' beforeWidth={4}>
          <ColorInput color={color} onChange={setSdfPreviewColor} />
        </GridInput>
      </Box>
      <Box paddingX={2} marginY={4}>
        <GridInput before='Size:' beforeWidth={4} after='px'>
          <Input
            value={displayFontSize}
            fullWidth
            type='number'
            slotProps={{ input: { min: 1, step: 1 } }}
            onChange={handleFontSizeChange}
          />
        </GridInput>
      </Box>
      <Box paddingX={2} marginY={4}>
        <GridInput before='Line H:' beforeWidth={4}>
          <Input
            value={displayLineHeight}
            fullWidth
            type='number'
            slotProps={{ input: { min: 0.1, step: 0.1 } }}
            onChange={handleLineHeightChange}
          />
        </GridInput>
      </Box>
    </>
  )
}

export default PreviewSdfSettings
