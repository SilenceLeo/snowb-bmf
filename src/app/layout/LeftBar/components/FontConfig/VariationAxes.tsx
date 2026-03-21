import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import { FunctionComponent, useCallback, useMemo } from 'react'
import GridInput from 'src/app/components/GridInput/GridInput'
import {
  setVariationAxisValue,
  setVariationSettings,
  useFontResources,
  useFontVariationSettings,
} from 'src/store/legend'

const VariationAxes: FunctionComponent = () => {
  const fonts = useFontResources()
  const variationSettings = useFontVariationSettings()

  const mainFont = fonts.length > 0 ? fonts[0] : null
  const axes = mainFont?.variationAxes
  const instances = mainFont?.variationInstances

  const handleAxisChange = useCallback(
    (tag: string) => (_event: Event, value: number | number[]) => {
      setVariationAxisValue(tag, value as number)
    },
    [],
  )

  const handleInstanceSelect = useCallback(
    (event: SelectChangeEvent) => {
      const idx = Number(event.target.value)
      if (instances && instances[idx]) {
        setVariationSettings(instances[idx].coordinates)
      }
    },
    [instances],
  )

  // Find current matching instance index (if any)
  const currentInstanceIdx = useMemo(
    () =>
      instances?.findIndex((inst) =>
        Object.entries(inst.coordinates).every(
          ([tag, val]) => Math.abs((variationSettings[tag] ?? 0) - val) < 0.001,
        ),
      ),
    [instances, variationSettings],
  )

  if (!axes || axes.length === 0) {
    return null
  }

  return (
    <Box>
      {instances && instances.length > 0 && (
        <GridInput before='Instance:'>
          <Select
            size='small'
            value={
              currentInstanceIdx !== undefined && currentInstanceIdx >= 0
                ? String(currentInstanceIdx)
                : ''
            }
            onChange={handleInstanceSelect}
            displayEmpty
            sx={{ minWidth: 120 }}
          >
            <MenuItem value='' disabled>
              <Typography variant='body2' color='text.secondary'>
                Custom
              </Typography>
            </MenuItem>
            {instances.map((inst, idx) => (
              <MenuItem key={idx} value={String(idx)}>
                {inst.name || `Instance ${idx + 1}`}
              </MenuItem>
            ))}
          </Select>
        </GridInput>
      )}
      {axes.map((axis) => (
        <GridInput
          key={axis.tag}
          before={`${axis.name}:`}
          after={`${Math.round(variationSettings[axis.tag] ?? axis.defaultValue)}`}
        >
          <Slider
            value={variationSettings[axis.tag] ?? axis.defaultValue}
            min={axis.minValue}
            max={axis.maxValue}
            step={
              axis.tag === 'ital' ? 1 : (axis.maxValue - axis.minValue) / 100
            }
            onChange={handleAxisChange(axis.tag)}
          />
        </GridInput>
      ))}
    </Box>
  )
}

export default VariationAxes
