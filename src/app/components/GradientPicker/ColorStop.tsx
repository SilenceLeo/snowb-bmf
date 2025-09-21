import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { SxProps, Theme } from '@mui/material/styles'
import React, { FunctionComponent } from 'react'

interface ColorStopProps {
  sx?: SxProps<Theme>
  left?: string | number
  color: string
  isActive: boolean
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const ColorStop: FunctionComponent<ColorStopProps> = (
  props: ColorStopProps,
) => {
  const { left, color, isActive, sx, ...divProps } = props
  const { bgPixel, palette } = useTheme()

  return (
    <Box
      sx={{
        width: '12px',
        height: '12px',
        borderStyle: 'solid',
        borderWidth: '0 1px 1px',
        position: 'absolute',
        cursor: 'pointer',
        marginLeft: '-6px',
        zIndex: isActive ? 2 : 1,
        ...bgPixel,
        borderColor: palette.primary.main,
        left: left || 0,
        '&:before, &:after': {
          position: 'absolute',
          content: '""',
          width: 0,
          height: 0,
          borderStyle: 'solid',
          left: 0,
        },
        '&:before': {
          top: '-6px',
          left: '-1px',
          borderWidth: '0 6px 6px 6px',
          borderColor: `transparent transparent ${palette.primary.dark} transparent`,
        },
        '&:after': {
          top: '-5px',
          borderWidth: '0 5px 5px 5px',
          borderColor: `transparent transparent ${
            isActive
              ? palette.mode === 'dark'
                ? palette.common.white
                : palette.common.black
              : palette.grey[600]
          } transparent`,
        },
        ...sx,
      }}
      {...divProps}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          backgroundColor: color || 'transparent',
        }}
      />
    </Box>
  )
}

export default ColorStop
