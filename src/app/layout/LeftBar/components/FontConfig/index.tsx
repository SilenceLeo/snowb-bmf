import Box from '@mui/material/Box'
import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import ConfigSection from 'src/app/components/ConfigSection'

import FontFile from './FontFile'
import FontSharp from './FontSharp'
import FontSize from './FontSize'
import LineHeight from './LineHeight'

const FontConfig: FunctionComponent<unknown> = () => {
  return (
    <ConfigSection title='Font'>
      <Box sx={{ px: 2, my: 4 }}>
        <FontFile />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <FontSharp />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <FontSize />
      </Box>
      <Box sx={{ px: 2, my: 4 }}>
        <LineHeight />
      </Box>
    </ConfigSection>
  )
}

export default observer(FontConfig)
