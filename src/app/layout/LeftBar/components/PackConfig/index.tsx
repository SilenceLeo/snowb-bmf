import Box from '@mui/material/Box'
import { FunctionComponent } from 'react'
import ConfigSection from 'src/app/components/ConfigSection'

// Continue using existing child components, although they are in deep directories, they are simple functional components
import AutoPack from './AutoPack'
import FixedSize from './FixedSize'
import PackHeight from './PackHeight'
import PackWidth from './PackWidth'

const PackConfig: FunctionComponent<unknown> = () => {
  return (
    <ConfigSection title='Texture Packing'>
      <Box sx={{ px: 2, my: 4 }}>
        <AutoPack />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <FixedSize />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <PackWidth />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <PackHeight />
      </Box>
    </ConfigSection>
  )
}

export default PackConfig
