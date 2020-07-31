import React, { FunctionComponent } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'

import Fill from './modules/Fill'
import Stroke from './modules/Stroke'
import Shadow from './modules/Shadow'
import BackgroundColor from './modules/BackgroundColor'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      overflow: 'hidden',
      width: '256px',
    },
  }),
)

const RightBar: FunctionComponent<unknown> = () => {
  const classes = useStyles()

  return (
    <Box
      bgcolor='background.sidebar'
      display='flex'
      flexDirection='column'
      overflow='hidden'
      className={classes.root}
    >
      <Box bgcolor='background.sidebar' boxShadow={2} padding={2}>
        <Typography variant='subtitle2'>Style Config</Typography>
      </Box>
      <Box flex={1} height={0} overflow='hidden auto'>
        <Fill />
        <Divider />
        <Stroke />
        <Divider />
        <Shadow />
        <Divider />
        <BackgroundColor />
      </Box>
    </Box>
  )
}

export default RightBar
