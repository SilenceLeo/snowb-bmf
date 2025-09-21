import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { FunctionComponent } from 'react'

import ButtonExport from './ButtonExport'
import ButtonNew from './ButtonNew'
import ButtonOpen from './ButtonOpen'
import ButtonSave from './ButtonSave'

const btnSx = {
  textTransform: 'none',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#252525',
  },
}

const TitleBar: FunctionComponent = () => {
  const { zIndex } = useTheme()

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        zIndex: zIndex.appBar,
        px: 4,
        bgcolor: 'background.titleBar',
      }}
    >
      <Typography
        component='h1'
        sx={{
          fontSize: '1.25rem',
          fontWeight: 'bolder',
          marginRight: '1rem',
        }}
      >
        SnowB Bitmap Font
      </Typography>
      <Box sx={{ flex: 'auto', px: 4 }}>
        <ButtonNew sx={btnSx} />
        <ButtonOpen sx={btnSx} />
        <ButtonSave sx={btnSx} />
        <ButtonExport sx={btnSx} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          component={Link}
          href='/en/'
          color='inherit'
          underline='none'
          sx={btnSx}
        >
          Home
        </Button>
        <Button
          component={Link}
          href='/en/docs/'
          color='inherit'
          underline='none'
          sx={btnSx}
        >
          Docs
        </Button>
        <Button
          component={Link}
          href='https://github.com/SilenceLeo/snowb-bmf'
          target='_blank'
          color='inherit'
          underline='none'
          sx={btnSx}
        >
          GitHub
        </Button>
      </Box>
    </Box>
  )
}

export default TitleBar
