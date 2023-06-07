import React, { FunctionComponent } from 'react'
import Box from '@material-ui/core/Box'
import GitHubIcon from '@material-ui/icons/GitHub'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import ButtonNew from './ButtonNew'
import ButtonOpen from './ButtonOpen'
import ButtonSave from './ButtonSave'
import ButtonExport from './ButtonExport'

const useStyles = makeStyles(({ zIndex, spacing }) =>
  createStyles({
    root: {
      position: 'relative',
      zIndex: zIndex.appBar,
    },
    appName: {
      fontSize: '1.25rem',
      fontWeight: 'bolder',
      marginRight: spacing(4),
    },
    appNameSup: {
      fontWeight: 'lighter',
      fontSize: '0.5em',
      marginLeft: '0.5rem',
    },
    btn: {
      textTransform: 'none',
    },
  }),
)

const TitleBar: FunctionComponent<unknown> = () => {
  const classes = useStyles()

  return (
    <Box
      className={classes.root}
      bgcolor='background.titleBar'
      paddingX={4}
      display='flex'
      alignItems='center'
    >
      <Typography variant='h1' className={classes.appName}>
        SnowB Bitmap Font
        {/* <sup className={classes.appNameSup}>BETA</sup> */}
      </Typography>
      <Box flex='auto' paddingX={4}>
        <ButtonNew className={classes.btn} />
        <ButtonOpen className={classes.btn} />
        <ButtonSave className={classes.btn} />
        <ButtonExport className={classes.btn} />
      </Box>
      <IconButton
        size='small'
        component='a'
        href='https://github.com/SilenceLeo/snowb-bmf'
        target='_blank'
        title='GitHub'
      >
        <GitHubIcon />
      </IconButton>
    </Box>
  )
}
export default TitleBar
