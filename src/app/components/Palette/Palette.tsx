import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { FunctionComponent, useState } from 'react'

export interface PaletteItem {
  id: number | string
  offset: number
  color: string
}

interface PaletteProps {
  width?: number | string
  height?: number | string
  palette: PaletteItem[]
}

const Palette: FunctionComponent<PaletteProps> = (props: PaletteProps) => {
  const { palette, width, height } = props
  const { bgPixel } = useTheme()
  const [id] = useState(
    `palette_${Math.random().toString(36).substring(2, 11)}`,
  )
  const sortedPalette = [...palette].sort(
    ({ offset: offset1 }, { offset: offset2 }) => offset1 - offset2,
  )

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        ...bgPixel,
        width: width || '100%',
        height: height || '100%',
      }}
    >
      <svg
        style={{
          width: '100%',
          height: '100%',
          verticalAlign: 'top',
        }}
      >
        <defs>
          <linearGradient id={id} x1='0' y1='0.5' x2='1' y2='0.5'>
            {sortedPalette.map((item) => (
              <stop
                key={item.id}
                offset={item.offset}
                style={{ stopColor: item.color }}
              />
            ))}
          </linearGradient>
        </defs>
        <rect x='0' y='0' width='100%' height='100%' fill={`url(#${id})`} />
      </svg>
    </Box>
  )
}

export default Palette
