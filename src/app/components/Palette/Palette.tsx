import React, { FunctionComponent, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

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

const useStyles = makeStyles(({ bgPixel }) => ({
  root: {
    ...bgPixel,
    width: (props: PaletteProps) => props.width || '100%',
    height: (props: PaletteProps) => props.height || '100%',
    border: '1px solid #ccc',
  },
  svg: {
    width: '100%',
    height: '100%',
    verticalAlign: 'top',
  },
}))

const Palette: FunctionComponent<PaletteProps> = (
  props: PaletteProps,
): JSX.Element => {
  const classes = useStyles(props)
  const { palette } = props
  const [id] = useState(`palette_${Math.random().toString().substr(2, 9)}`)
  const sortedPalette = [...palette].sort(
    ({ offset: offset1 }, { offset: offset2 }) => offset1 - offset2,
  )

  return (
    <div className={classes.root}>
      <svg className={classes.svg}>
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
    </div>
  )
}

export default Palette
