import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Input from '@mui/material/Input'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import FormFill from 'src/app/layout/common/FormFill'
import {
  addStrokeGradientColor,
  setStrokeColor,
  setStrokeFillType,
  setStrokeGradientAngle,
  setStrokeGradientType,
  setStrokeLineCap,
  setStrokeLineJoin,
  setStrokePatternImage,
  setStrokePatternRepetition,
  setStrokePatternScale,
  setStrokeType,
  setStrokeWidth,
  setUseStroke,
  updateStrokeGradientPalette,
  useStroke,
  useStrokeEnabled,
} from 'src/store/legend'

import ConfigSection from '../../../components/ConfigSection'

const StrokeConfig: FunctionComponent = () => {
  const stroke = useStroke()
  const useStrokeValue = useStrokeEnabled()

  const {
    width,
    lineJoin,
    lineCap,
    strokeType,
    type,
    color,
    gradient,
    patternTexture,
  } = stroke

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
          <Typography
            component='div'
            sx={{
              flex: 1,
            }}
          >
            Stroke
          </Typography>
          Off
          <Switch
            size='small'
            checked={useStrokeValue}
            onChange={(e) => setUseStroke(e.target.checked)}
          />
          On
        </Box>
      }
    >
      <Box
        sx={
          useStrokeValue
            ? {}
            : {
                opacity: 0.3,
                pointerEvents: 'none',
              }
        }
      >
        <Box sx={{ px: 2, my: 4 }}>
          <GridInput before='Width:' after='px'>
            <Input
              value={width ?? 0}
              fullWidth
              type='number'
              slotProps={{ input: { min: 0 } }}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
            />
          </GridInput>
        </Box>

        <Box sx={{ px: 2, my: 4 }}>
          <GridInput before='Type:' component='div' childrenWidth={8}>
            <ButtonGroup size='small' color='primary'>
              <Button
                onClick={() => setStrokeType(0)}
                variant={strokeType === 0 ? 'contained' : 'outlined'}
              >
                Outer
              </Button>
              <Button
                onClick={() => setStrokeType(1)}
                variant={strokeType === 1 ? 'contained' : 'outlined'}
              >
                Middle
              </Button>
              <Button
                onClick={() => setStrokeType(2)}
                variant={strokeType === 2 ? 'contained' : 'outlined'}
              >
                Inner
              </Button>
            </ButtonGroup>
          </GridInput>
        </Box>

        <Box sx={{ px: 2, my: 4 }}>
          <GridInput before='Line Cap:' component='div' childrenWidth={8}>
            <ButtonGroup size='small' color='primary'>
              <Button
                onClick={() => setStrokeLineCap('butt')}
                variant={lineCap === 'butt' ? 'contained' : 'outlined'}
              >
                Butt
              </Button>
              <Button
                onClick={() => setStrokeLineCap('round')}
                variant={lineCap === 'round' ? 'contained' : 'outlined'}
              >
                Round
              </Button>
              <Button
                onClick={() => setStrokeLineCap('square')}
                variant={lineCap === 'square' ? 'contained' : 'outlined'}
              >
                Square
              </Button>
            </ButtonGroup>
          </GridInput>
        </Box>

        <Box sx={{ px: 2, my: 4 }}>
          <GridInput before='Line Join:' component='div' childrenWidth={8}>
            <ButtonGroup size='small' color='primary'>
              <Button
                onClick={() => setStrokeLineJoin('miter')}
                variant={lineJoin === 'miter' ? 'contained' : 'outlined'}
              >
                Miter
              </Button>
              <Button
                onClick={() => setStrokeLineJoin('round')}
                variant={lineJoin === 'round' ? 'contained' : 'outlined'}
              >
                Round
              </Button>
              <Button
                onClick={() => setStrokeLineJoin('bevel')}
                variant={lineJoin === 'bevel' ? 'contained' : 'outlined'}
              >
                Bevel
              </Button>
            </ButtonGroup>
          </GridInput>
        </Box>
        <FormFill
          type={type}
          color={color}
          gradient={gradient}
          patternTexture={patternTexture}
          onTypeChange={setStrokeFillType}
          onColorChange={setStrokeColor}
          onGradientTypeChange={setStrokeGradientType}
          onGradientAngleChange={setStrokeGradientAngle}
          onGradientColorAdd={addStrokeGradientColor}
          onGradientPaletteUpdate={updateStrokeGradientPalette}
          onPatternImageChange={setStrokePatternImage}
          onPatternRepetitionChange={setStrokePatternRepetition}
          onPatternScaleChange={setStrokePatternScale}
        />
      </Box>
    </ConfigSection>
  )
}

export default StrokeConfig
