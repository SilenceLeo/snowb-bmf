import React, { FunctionComponent } from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Link from '@mui/material/Link'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import GitHubIcon from '@mui/icons-material/GitHub'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import ButtonNew from './ButtonNew'
import ButtonOpen from './ButtonOpen'
import ButtonSave from './ButtonSave'
import ButtonExport from './ButtonExport'

import styles from './TitleBar.module.css'

const TitleBar: FunctionComponent<unknown> = () => {
  const { zIndex } = useTheme()

  return (
    <Box
      className={styles.root}
      sx={{
        zIndex: zIndex.appBar,
        px: 4,
        bgcolor: 'background.titleBar',
      }}
    >
      <Typography variant='h1' className={styles.appName}>
        SnowB Bitmap Font
        {/* <sup className={classes.appNameSup}>BETA</sup> */}
      </Typography>
      <Box sx={{ flex: 'auto', px: 4 }}>
        <ButtonNew className={styles.btn} />
        <ButtonOpen className={styles.btn} />
        <ButtonSave className={styles.btn} />
        <ButtonExport className={styles.btn} />
      </Box>
      <Link
        href='https://github.com/SilenceLeo/snowb-bmf'
        target='_blank'
        title='GitHub'
        color='inherit'
        underline='hover'
        sx={{ display: 'inline-flex', alignItems: 'center' }}
      >
        Give it a star to encourage the author!
        <ArrowForwardIcon fontSize='inherit' />
        <IconButton size='small'>
          <GitHubIcon />
        </IconButton>
      </Link>
    </Box>
  )
}
export default TitleBar
