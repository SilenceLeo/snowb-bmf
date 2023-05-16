import React, { FunctionComponent } from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import GitHubIcon from '@mui/icons-material/GitHub'

import ButtonNew from './ButtonNew'
import ButtonOpen from './ButtonOpen'
import ButtonSave from './ButtonSave'
import ButtonExport from './ButtonExport'

import styles from './TitleBar.module.css'

const TitleBar: FunctionComponent<unknown> = () => {
  const { zIndex, breakpoints } = useTheme()

  return (
    <Box
      className={styles.root}
      sx={{
        zIndex: zIndex.appBar,
        px: 4,
        bgcolor: 'background.titleBar',
      }}
    >
      <Typography
        variant='h1'
        sx={{
          mr: 4,
          fontSize: '1.25rem',
          fontWeight: 'bolder',
          [breakpoints.down('md')]: {
            fontSize: '1.25rem',
          },
          [breakpoints.up('md')]: {
            fontSize: '1.25rem',
          },
          [breakpoints.up('lg')]: {
            fontSize: '1.25rem',
          },
        }}
      >
        SnowB BMF
        <sup className={styles.appNameSup}>BETA</sup>
      </Typography>
      <Box sx={{ flex: 'auto', px: 4 }}>
        <ButtonNew className={styles.btn} />
        <ButtonOpen className={styles.btn} />
        <ButtonSave className={styles.btn} />
        <ButtonExport className={styles.btn} />
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
