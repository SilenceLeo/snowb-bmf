import Box from '@mui/material/Box'
import { FunctionComponent } from 'react'
import ConfigSection from 'src/app/components/ConfigSection'

// Continue using existing child components, although they are in deep directories, they are simple functional components
import AutoPack from './AutoPack'
import Columns from './Columns'
import FixedSize from './FixedSize'
import OrderedGrid from './OrderedGrid'
import PackHeight from './PackHeight'
import PackWidth from './PackWidth'

const PackConfig: FunctionComponent = () => {
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
      <Box sx={{ px: 2, my: 4 }}>
        <OrderedGrid />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <Columns />
      </Box>
    </ConfigSection>
  )
}

export default PackConfig
