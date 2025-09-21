import Box from '@mui/material/Box'
import { FunctionComponent } from 'react'
import ConfigSection from 'src/app/components/ConfigSection'

// Continue using existing child components, although they are in deep directories, they are simple functional components
import Padding from './Padding'
import Page from './Page'
import Spacing from './Spacing'

const LayoutConfig: FunctionComponent<unknown> = () => {
  return (
    <ConfigSection title='Layout'>
      <Box sx={{ px: 2, my: 4 }}>
        <Padding />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <Spacing />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <Page />
      </Box>
    </ConfigSection>
  )
}

export default LayoutConfig
