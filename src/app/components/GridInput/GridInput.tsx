import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { SxProps, Theme } from '@mui/material/styles'
import React, {
  ElementType,
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
} from 'react'

interface GridInputProps {
  before?: ReactNode | string
  after?: ReactNode
  component?: ElementType
  childrenWidth?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  sx?: SxProps<Theme>
  children?: ReactNode
}

const GridInput: FunctionComponent<GridInputProps> = (
  props: PropsWithChildren<GridInputProps>,
): React.JSX.Element => {
  const { before, children, component, after, childrenWidth, ...other } = props
  return (
    <Grid
      component={component || 'label'}
      container
      spacing={2}
      wrap='nowrap'
      justifyContent='center'
      alignItems='center'
      {...other}
    >
      <Grid size={5}>
        {typeof before === 'object' ? (
          before
        ) : (
          <Typography noWrap align='right'>
            {before}
          </Typography>
        )}
      </Grid>
      <Grid size={childrenWidth || 6}>{children}</Grid>
      <Grid size='grow'>
        {typeof after === 'object' ? (
          after
        ) : (
          <Typography noWrap variant='caption'>
            {after}
          </Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default GridInput
