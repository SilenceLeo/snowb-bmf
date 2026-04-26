import Box from '@mui/material/Box'
import { FunctionComponent } from 'react'
import FormColor from 'src/app/layout/common/FormColor'
import { setBgColor, useBgColor } from 'src/store/legend'

import ConfigSection from '../../../components/ConfigSection'

const BackgroundColor: FunctionComponent = () => {
  const bgColor = useBgColor()

  return (
    <ConfigSection title='Background Color'>
      <Box
        sx={{
          px: 2,
          my: 4,
        }}
      >
        <FormColor
          color={bgColor || ''}
          beforeWidth={4}
          onChange={setBgColor}
        />
      </Box>
    </ConfigSection>
  )
}

export default BackgroundColor
