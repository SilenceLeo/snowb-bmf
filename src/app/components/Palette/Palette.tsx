import React, { FunctionComponent, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'

import styles from './Palette.module.css'
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

const Palette: FunctionComponent<PaletteProps> = (
  props: PaletteProps,
): JSX.Element => {
  const { palette, width, height } = props
  const { bgPixel } = useTheme()
  const [id] = useState(`palette_${Math.random().toString().substr(2, 9)}`)
  const sortedPalette = [...palette].sort(
    ({ offset: offset1 }, { offset: offset2 }) => offset1 - offset2,
  )

  return (
    <Box
      className={styles.root}
      sx={{ ...bgPixel, width: width || '100%', height: height || '100%' }}
    >
      <svg className={styles.svg}>
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
