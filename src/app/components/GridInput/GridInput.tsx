import React, {
  ReactNode,
  FunctionComponent,
  PropsWithChildren,
  ElementType,
} from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

interface GridInputProps {
  before?: ReactNode
  after?: ReactNode
  component?: ElementType
  childrenWidth?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
}

const GridInput: FunctionComponent<GridInputProps> = (
  props: PropsWithChildren<GridInputProps>,
): JSX.Element => {
  const { before, children, component, after, childrenWidth } = props
  return (
    <Grid
      component={component || 'label'}
      container
      spacing={2}
      wrap='nowrap'
      justify='center'
      alignItems='center'
    >
      <Grid item xs={4}>
        {typeof before === 'object' ? (
          before
        ) : (
          <Typography noWrap align='right'>
            {before}
          </Typography>
        )}
      </Grid>
      <Grid item xs={childrenWidth || 5}>
        {children}
      </Grid>
      <Grid item xs>
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
