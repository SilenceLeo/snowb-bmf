import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'

import styles from './ColorStop.module.scss'

interface ColorStopPorps {
  className?: string
  left?: string | number
  top?: string | number
  color: string
  isActive: boolean
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const ColorStop: FunctionComponent<ColorStopPorps> = (
  props: ColorStopPorps,
) => {
  const { left, top, color, isActive, className, ...divProps } = props
  const { bgPixel, palette } = useTheme()

  return (
    <Box
      className={clsx(styles.root, className)}
      sx={{
        ...bgPixel,
        borderColor: palette.primary.main,
        left: left || 0,
        zIndex: isActive ? 2 : 1,
        '&:before': {
          borderColor: `transparent transparent ${palette.primary.dark} transparent`,
        },
        '&:after': {
          borderColor: `transparent transparent ${
            isActive
              ? palette.mode === 'dark'
                ? palette.common.white
                : palette.common.black
              : palette.grey[600]
          } transparent`,
        },
      }}
      {...divProps}
    >
      <Box
        className={styles.color}
        sx={{
          backgroundColor: color || 'transparent',
        }}
      />
    </Box>
  )
}

export default ColorStop
