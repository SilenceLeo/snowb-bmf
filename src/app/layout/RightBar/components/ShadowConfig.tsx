import Box from '@mui/material/Box'
import Input from '@mui/material/Input'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import FormColor from 'src/app/layout/common/FormColor'
import {
  setShadowBlur,
  setShadowColor,
  setShadowOffsetX,
  setShadowOffsetY,
  setUseShadow,
  useShadow,
  useShadowEnabled,
} from 'src/store/legend'

import ConfigSection from '../../../components/ConfigSection'

const ShadowConfig: FunctionComponent = () => {
  const shadowEnabled = useShadowEnabled()
  const shadow = useShadow()

  return (
    <ConfigSection
      title={
        <Box
          component='label'
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component='div' sx={{ flex: 1 }}>
            Shadow
          </Typography>
          Off
          <Switch
            size='small'
            checked={shadowEnabled}
            onChange={(e) => setUseShadow(e.target.checked)}
          />
          On
        </Box>
      }
    >
      <Box
        sx={
          shadowEnabled
            ? {}
            : {
                opacity: 0.3,
                pointerEvents: 'none',
              }
        }
      >
        <Box sx={{ px: 2, my: 4 }}>
          <GridInput before='Offset X:' after='px'>
            <Input
              value={shadow?.offsetX ?? 0}
              fullWidth
              type='number'
              disabled={!shadowEnabled}
              onChange={(e) => setShadowOffsetX(Number(e.target.value))}
            />
          </GridInput>
        </Box>
        <Box sx={{ px: 2, my: 4 }}>
          <GridInput before='Offset Y:' after='px'>
            <Input
              value={shadow?.offsetY ?? 0}
              fullWidth
              type='number'
              disabled={!shadowEnabled}
              onChange={(e) => setShadowOffsetY(Number(e.target.value))}
            />
          </GridInput>
        </Box>
        <Box sx={{ px: 2, my: 4 }}>
          <GridInput before='Blur:' after='px'>
            <Input
              value={shadow?.blur ?? 0}
              fullWidth
              type='number'
              disabled={!shadowEnabled}
              slotProps={{ input: { min: 0 } }}
              onChange={(e) => setShadowBlur(Number(e.target.value))}
            />
          </GridInput>
        </Box>
        <Box sx={{ px: 2, my: 4 }}>
          <FormColor color={shadow?.color || ''} onChange={setShadowColor} />
        </Box>
      </Box>
    </ConfigSection>
  )
}

export default ShadowConfig
