import Box from '@mui/material/Box'
import Input from '@mui/material/Input'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import FormColor from 'src/app/layout/common/FormColor'
import {
  setInnerShadowBlur,
  setInnerShadowColor,
  setInnerShadowOffsetX,
  setInnerShadowOffsetY,
  setUseInnerShadow,
  useInnerShadow,
  useInnerShadowEnabled,
} from 'src/store/legend'

import ConfigSection from '../../../components/ConfigSection'

const InnerShadowConfig: FunctionComponent = () => {
  const innerShadowEnabled = useInnerShadowEnabled()
  const innerShadow = useInnerShadow()

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
            Inner Shadow
          </Typography>
          Off
          <Switch
            size='small'
            checked={innerShadowEnabled}
            onChange={(e) => setUseInnerShadow(e.target.checked)}
          />
          On
        </Box>
      }
    >
      <Box
        sx={
          innerShadowEnabled
            ? {}
            : {
                opacity: 0.3,
                pointerEvents: 'none',
              }
        }
      >
        <Box sx={{ px: 2, my: 4 }}>
          <GridInput before='Offset X:' beforeWidth={4} after='px'>
            <Input
              value={innerShadow?.offsetX ?? 0}
              fullWidth
              type='number'
              disabled={!innerShadowEnabled}
              onChange={(e) => setInnerShadowOffsetX(Number(e.target.value))}
            />
          </GridInput>
        </Box>
        <Box sx={{ px: 2, my: 4 }}>
          <GridInput before='Offset Y:' beforeWidth={4} after='px'>
            <Input
              value={innerShadow?.offsetY ?? 0}
              fullWidth
              type='number'
              disabled={!innerShadowEnabled}
              onChange={(e) => setInnerShadowOffsetY(Number(e.target.value))}
            />
          </GridInput>
        </Box>
        <Box sx={{ px: 2, my: 4 }}>
          <GridInput before='Blur:' beforeWidth={4} after='px'>
            <Input
              value={innerShadow?.blur ?? 0}
              fullWidth
              type='number'
              disabled={!innerShadowEnabled}
              slotProps={{ input: { min: 0 } }}
              onChange={(e) => setInnerShadowBlur(Number(e.target.value))}
            />
          </GridInput>
        </Box>
        <Box sx={{ px: 2, my: 4 }}>
          <FormColor
            color={innerShadow?.color || ''}
            beforeWidth={4}
            onChange={setInnerShadowColor}
          />
        </Box>
      </Box>
    </ConfigSection>
  )
}

export default InnerShadowConfig
