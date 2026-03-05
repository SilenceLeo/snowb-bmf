import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Input from '@mui/material/Input'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import { FunctionComponent, memo } from 'react'
import GridInput from 'src/app/components/GridInput'
import type { RenderMode } from 'src/store/legend'
import {
  setAngleThreshold,
  setColoringStrategy,
  setDistanceRange,
  setEdgeColoringSeed,
  setErrorCorrection,
  setFillRule,
  setOverlapSupport,
  setRenderMode,
  setScanlinePass,
  setSdfChannel,
  useAngleThreshold,
  useColoringStrategy,
  useDistanceRange,
  useEdgeColoringSeed,
  useErrorCorrection,
  useFillRule,
  useMainFont,
  useOverlapSupport,
  useRenderMode,
  useScanlinePass,
  useSdfChannel,
} from 'src/store/legend'

import ConfigSection from '../../../components/ConfigSection'

/**
 * WASM-specific parameters (overlap, scanline, fill rule).
 * Extracted as a sub-component to avoid subscribing to these observables
 * when not in a WASM-enabled mode.
 */
const WasmParams: FunctionComponent = memo(() => {
  const overlapSupport = useOverlapSupport()
  const scanlinePass = useScanlinePass()
  const fillRule = useFillRule()

  return (
    <>
      {/* Overlap Support — valid for all WASM modes (GeneratorConfig) */}
      <Box sx={{ px: 2, my: 4 }}>
        <GridInput before='Overlap Support:'>
          <Switch
            size='small'
            checked={overlapSupport}
            onChange={(e) => setOverlapSupport(e.target.checked)}
          />
        </GridInput>
      </Box>

      {/* Scanline Pass — valid for all WASM modes */}
      <Box sx={{ px: 2, my: 4 }}>
        <GridInput before='Scanline Pass:'>
          <Switch
            size='small'
            checked={scanlinePass}
            onChange={(e) => setScanlinePass(e.target.checked)}
          />
        </GridInput>
      </Box>

      {/* Fill Rule — effective only when scanlinePass is enabled */}
      <Box sx={{ px: 2, my: 4 }}>
        <GridInput before='Fill Rule:' component='div' childrenWidth={8}>
          <ButtonGroup size='small' color='primary'>
            <Button
              onClick={() => setFillRule('nonzero')}
              variant={fillRule === 'nonzero' ? 'contained' : 'outlined'}
              disabled={!scanlinePass}
            >
              Non-Zero
            </Button>
            <Button
              onClick={() => setFillRule('evenodd')}
              variant={fillRule === 'evenodd' ? 'contained' : 'outlined'}
              disabled={!scanlinePass}
            >
              Even-Odd
            </Button>
          </ButtonGroup>
        </GridInput>
      </Box>
    </>
  )
})
WasmParams.displayName = 'WasmParams'

/**
 * MSDF-specific parameters (angle threshold, coloring, error correction).
 * Extracted as a sub-component to avoid subscribing to these observables
 * when not in MSDF/MTSDF mode.
 */
const MsdfParams: FunctionComponent = memo(() => {
  const angleThreshold = useAngleThreshold()
  const edgeColoringSeed = useEdgeColoringSeed()
  const coloringStrategy = useColoringStrategy()
  const errorCorrection = useErrorCorrection()

  return (
    <>
      {/* Angle Threshold — edge coloring param, only for MSDF/MTSDF */}
      <Box sx={{ px: 2, my: 4 }}>
        <GridInput before='Angle Threshold:'>
          <Input
            fullWidth
            type='number'
            value={angleThreshold}
            slotProps={{ input: { min: 0.5, max: 3.1416, step: 0.1 } }}
            onChange={(e) => {
              const v = Number(e.target.value)
              if (!Number.isNaN(v)) setAngleThreshold(v)
            }}
          />
        </GridInput>
      </Box>

      {/* Edge Coloring Seed — only for MSDF/MTSDF */}
      <Box sx={{ px: 2, my: 4 }}>
        <GridInput before='Coloring Seed:'>
          <Input
            fullWidth
            type='number'
            value={edgeColoringSeed}
            slotProps={{ input: { min: 0, step: 1 } }}
            onChange={(e) => {
              const v = Number(e.target.value)
              if (!Number.isNaN(v)) setEdgeColoringSeed(v)
            }}
          />
        </GridInput>
      </Box>

      {/* Coloring Strategy — only for MSDF/MTSDF */}
      <Box sx={{ px: 2, my: 4 }}>
        <GridInput before='Coloring:' component='div' childrenWidth={8}>
          <ButtonGroup size='small' color='primary'>
            <Button
              onClick={() => setColoringStrategy('simple')}
              variant={coloringStrategy === 'simple' ? 'contained' : 'outlined'}
            >
              Simple
            </Button>
            <Button
              onClick={() => setColoringStrategy('inktrap')}
              variant={coloringStrategy === 'inktrap' ? 'contained' : 'outlined'}
            >
              Ink Trap
            </Button>
            <Tooltip title='Experimental: distance-based optimal coloring'>
              <Button
                onClick={() => setColoringStrategy('distance')}
                variant={coloringStrategy === 'distance' ? 'contained' : 'outlined'}
              >
                Distance
              </Button>
            </Tooltip>
          </ButtonGroup>
        </GridInput>
      </Box>

      {/* Error Correction — only for MSDF/MTSDF (MSDFGeneratorConfig) */}
      <Box sx={{ px: 2, my: 4 }}>
        <GridInput before='Error Fix:' component='div' childrenWidth={8}>
          <ButtonGroup size='small' color='primary'>
            <Button
              onClick={() => setErrorCorrection('disabled')}
              variant={errorCorrection === 'disabled' ? 'contained' : 'outlined'}
            >
              Off
            </Button>
            <Button
              onClick={() => setErrorCorrection('edge-priority')}
              variant={errorCorrection === 'edge-priority' ? 'contained' : 'outlined'}
            >
              Edge Priority
            </Button>
            <Button
              onClick={() => setErrorCorrection('indiscriminate')}
              variant={errorCorrection === 'indiscriminate' ? 'contained' : 'outlined'}
            >
              Indiscriminate
            </Button>
          </ButtonGroup>
        </GridInput>
      </Box>
    </>
  )
})
MsdfParams.displayName = 'MsdfParams'

/**
 * Determine if the current render mode uses the WASM pipeline.
 */
function isWasmEnabled(renderMode: RenderMode, hasFontFile: boolean): boolean {
  return (
    (renderMode !== 'default' && renderMode !== 'sdf') ||
    (renderMode === 'sdf' && hasFontFile)
  )
}

const RenderConfig: FunctionComponent = () => {
  const renderMode = useRenderMode()
  const distanceRange = useDistanceRange()
  const sdfChannel = useSdfChannel()
  const mainFont = useMainFont()
  const hasFontFile = !!mainFont

  const isWasmMode = isWasmEnabled(renderMode, hasFontFile)
  const isMsdfMode = renderMode === 'msdf' || renderMode === 'mtsdf'

  return (
    <ConfigSection title='Render Mode'>
      <Box sx={{ px: 2, my: 4, display: 'flex', justifyContent: 'center' }}>
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
          <Tooltip
            title={!hasFontFile ? 'Upload a font file first' : ''}
          >
            <span>
              <Button
                onClick={() => setRenderMode('psdf')}
                variant={renderMode === 'psdf' ? 'contained' : 'outlined'}
                disabled={!hasFontFile}
              >
                PSDF
              </Button>
            </span>
          </Tooltip>
          <Tooltip
            title={!hasFontFile ? 'Upload a font file first' : ''}
          >
            <span>
              <Button
                onClick={() => setRenderMode('msdf')}
                variant={renderMode === 'msdf' ? 'contained' : 'outlined'}
                disabled={!hasFontFile}
              >
                MSDF
              </Button>
            </span>
          </Tooltip>
          <Tooltip
            title={!hasFontFile ? 'Upload a font file first' : ''}
          >
            <span>
              <Button
                onClick={() => setRenderMode('mtsdf')}
                variant={
                  renderMode === 'mtsdf' ? 'contained' : 'outlined'
                }
                disabled={!hasFontFile}
              >
                MTSDF
              </Button>
            </span>
          </Tooltip>
        </ButtonGroup>
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
                  const v = Number(e.target.value)
                  if (!Number.isNaN(v)) setDistanceRange(v)
                }}
              />
            </GridInput>
          </Box>
          {renderMode === 'sdf' && (
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
                  variant={
                    sdfChannel === 'rgb-inv' ? 'contained' : 'outlined'
                  }
                >
                  Black/White
                </Button>
              </ButtonGroup>
              <ButtonGroup size='small' color='primary'>
                <Button
                  onClick={() => setSdfChannel('alpha')}
                  variant={
                    sdfChannel === 'alpha' ? 'contained' : 'outlined'
                  }
                >
                  White/Alpha
                </Button>
                <Button
                  onClick={() => setSdfChannel('alpha-inv')}
                  variant={
                    sdfChannel === 'alpha-inv' ? 'contained' : 'outlined'
                  }
                >
                  Black/Alpha
                </Button>
              </ButtonGroup>
            </Box>
          )}
          {isWasmMode && <WasmParams />}
          {isMsdfMode && <MsdfParams />}
        </>
      )}
    </ConfigSection>
  )
}

export default RenderConfig
