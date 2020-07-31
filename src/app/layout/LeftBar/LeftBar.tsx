import React, { FunctionComponent } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'

import Font from './modules/Font'
import Glyphs from './modules/Glyphs'
import PackConfig from './modules/PackConfig'
import GlobalMetric from './modules/GlobalMetric'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      overflow: 'hidden',
      width: '256px',
    },
  }),
)

const LeftBar: FunctionComponent<unknown> = () => {
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
        <Typography variant='subtitle2'>Font Config</Typography>
      </Box>
      <Box flex={1} height={0} overflow='hidden auto'>
        <Glyphs />
        <Divider />
        <Font />
        <Divider />
        <PackConfig />
        <Divider />
        <GlobalMetric />
      </Box>
    </Box>
  )
}

export default LeftBar
