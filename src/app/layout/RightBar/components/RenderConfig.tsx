import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Input from '@mui/material/Input'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import {
  setDistanceRange,
  setRenderMode,
  setSdfChannel,
  useDistanceRange,
  usePadding,
  useRenderMode,
  useSdfChannel,
} from 'src/store/legend'

import ConfigSection from '../../../components/ConfigSection'

const RenderConfig: FunctionComponent = () => {
  const renderMode = useRenderMode()
  const distanceRange = useDistanceRange()
  const sdfChannel = useSdfChannel()
  const padding = usePadding()

  return (
    <ConfigSection title='Render Mode'>
      <Box sx={{ px: 2, my: 4 }}>
        <GridInput before='Mode:' component='div' childrenWidth={8}>
          <ButtonGroup size='small' color='primary'>
            <Button
              onClick={() => setRenderMode('default')}
              variant={renderMode === 'default' ? 'contained' : 'outlined'}
            >
              Default
            </Button>
            <Button
              onClick={() => setRenderMode('sdf')}
              variant={renderMode === 'sdf' ? 'contained' : 'outlined'}
            >
              SDF
            </Button>
            <Tooltip title='Coming Soon'>
              <span>
                <Button disabled variant='outlined'>
                  MSDF
                </Button>
              </span>
            </Tooltip>
          </ButtonGroup>
        </GridInput>
      </Box>
      {renderMode !== 'default' && (
        <>
          <Box sx={{ px: 2, my: 4 }}>
            <GridInput before='Distance Range:'>
              <Input
                fullWidth
                type='number'
                value={distanceRange}
                slotProps={{ input: { min: 1, step: 1 } }}
                onChange={(e) => {
                  const v = Math.max(1, Number(e.target.value) || 1)
                  setDistanceRange(v)
                }}
              />
            </GridInput>
            {padding < distanceRange && (
              <Typography
                sx={{ px: 2, pb: 1 }}
                variant='caption'
                color='warning.main'
              >
                Warning: Padding ({padding}) is less than Distance Range (
                {distanceRange}). Increase padding to avoid clipping artifacts.
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              px: 2,
              my: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <ButtonGroup size='small' color='primary'>
              <Button
                onClick={() => setSdfChannel('rgb')}
                variant={sdfChannel === 'rgb' ? 'contained' : 'outlined'}
              >
                White/Black
              </Button>
              <Button
                onClick={() => setSdfChannel('rgb-inv')}
                variant={sdfChannel === 'rgb-inv' ? 'contained' : 'outlined'}
              >
                Black/White
              </Button>
            </ButtonGroup>
            <ButtonGroup size='small' color='primary'>
              <Button
                onClick={() => setSdfChannel('alpha')}
                variant={sdfChannel === 'alpha' ? 'contained' : 'outlined'}
              >
                White/Alpha
              </Button>
              <Button
                onClick={() => setSdfChannel('alpha-inv')}
                variant={sdfChannel === 'alpha-inv' ? 'contained' : 'outlined'}
              >
                Black/Alpha
              </Button>
            </ButtonGroup>
          </Box>
        </>
      )}
    </ConfigSection>
  )
}

export default RenderConfig
