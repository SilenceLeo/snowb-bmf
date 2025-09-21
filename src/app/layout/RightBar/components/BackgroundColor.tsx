import Box from '@mui/material/Box'
import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import FormColor from 'src/app/layout/common/FormColor'
import { useStyle } from 'src/store/hooks'

import ConfigSection from '../../../components/ConfigSection'

const BackgroundColor: FunctionComponent<unknown> = () => {
  const { bgColor, setBgColor } = useStyle()

  return (
    <ConfigSection title='Background Color'>
      <Box
        sx={{
          px: 2,
          my: 4,
        }}
      >
        <FormColor color={bgColor || ''} onChange={setBgColor} />
      </Box>
    </ConfigSection>
  )
}

export default observer(BackgroundColor)
