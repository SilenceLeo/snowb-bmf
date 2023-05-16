import React, { FunctionComponent } from 'react'
import clsx from 'clsx'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'

import styles from './ColorStop.module.scss'

// interface ColorStopPorps
//   extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
interface ColorStopPorps {
  className?: string
  left?: string | number
  top?: string | number
  color: string
  isActive: boolean
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

// const useStyles = makeStyles(({ bgPixel, palette }: Theme) =>
//   createStyles({
//     root: {
//       ...bgPixel,
//       width: '12px',
//       height: '12px',
//       border: `solid ${palette.primary.main}`,
//       borderWidth: '0 1px 1px',
//       position: 'absolute',
//       cursor: 'pointer',
//       marginLeft: '-6px',
//       left: (props) => props.left || 0,
//       zIndex: (props) => (props.isActive ? 2 : 1),
//       '&:before,&:after': {
//         position: 'absolute',
//         content: '""',
//         width: 0,
//         height: 0,
//         borderStyle: 'solid',
//         left: '0',
//       },
//       '&:before': {
//         top: '-6px',
//         left: '-1px',
//         borderWidth: '0 6px 6px 6px',
//         borderColor: `transparent transparent ${palette.primary.dark} transparent`,
//       },
//       '&:after': {
//         top: '-5px',
//         borderWidth: '0 5px 5px 5px',
//         borderColor: (props) => {
//           const activeColor =
//             palette.type === 'dark'
//               ? palette.common.white
//               : palette.common.black

//           return `transparent transparent ${
//             props.isActive ? activeColor : palette.grey[600]
//           } transparent`
//         },
//       },
//     },
//     color: {
//       width: '100%',
//       height: '100%',
//       pointerEvents: 'none',
//       backgroundColor: ({ color }: ColorStopPorps) => color || 'transparent',
//     },
//   }),
// )

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
