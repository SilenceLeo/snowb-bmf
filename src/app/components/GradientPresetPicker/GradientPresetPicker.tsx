import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { type FunctionComponent, useCallback, useId, useMemo, useState } from 'react'

import type { GradientPreset } from 'src/types/gradientPreset'
import type { GradientColor } from 'src/types/style'

interface GradientPresetPickerProps {
  presets: GradientPreset[]
  onApply: (palette: GradientColor[]) => void
  onSave: (name: string) => void
  onDelete: (id: string) => void
}

/** Small inline gradient swatch for preset thumbnails */
const PresetSwatch: FunctionComponent<{
  palette: GradientColor[]
  gradientId: string
}> = ({ palette, gradientId }) => {
  const sorted = useMemo(
    () => [...palette].sort((a, b) => a.offset - b.offset),
    [palette],
  )
  return (
    <svg width='100%' height='100%' style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradientId} x1='0' y1='0.5' x2='1' y2='0.5'>
          {sorted.map((item, i) => (
            <stop
              key={i}
              offset={item.offset}
              style={{ stopColor: item.color }}
            />
          ))}
        </linearGradient>
      </defs>
      <rect
        x='0'
        y='0'
        width='100%'
        height='100%'
        fill={`url(#${gradientId})`}
      />
    </svg>
  )
}

const GradientPresetPicker: FunctionComponent<GradientPresetPickerProps> = ({
  presets,
  onApply,
  onSave,
  onDelete,
}) => {
  const baseId = useId()
  const [saveAnchor, setSaveAnchor] = useState<HTMLElement | null>(null)
  const [presetName, setPresetName] = useState('')

  const handleSaveOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setSaveAnchor(e.currentTarget)
      setPresetName('')
    },
    [],
  )

  const handleSaveClose = useCallback(() => {
    setSaveAnchor(null)
  }, [])

  const handleSaveConfirm = useCallback(() => {
    const trimmed = presetName.trim()
    if (trimmed) {
      onSave(trimmed)
    }
    setSaveAnchor(null)
  }, [presetName, onSave])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSaveConfirm()
      }
    },
    [handleSaveConfirm],
  )

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          alignItems: 'center',
        }}
      >
        {presets.map((preset) => (
          <Tooltip
            key={preset.id}
            title={preset.name}
            arrow
            disableInteractive
            slotProps={{
              popper: { sx: { pointerEvents: 'none', userSelect: 'none' } },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 20,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 0.5,
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                '&:hover': {
                  borderColor: 'primary.main',
                },
                '&:hover .preset-delete': {
                  opacity: 1,
                },
              }}
              onClick={() => onApply(preset.palette)}
            >
              <PresetSwatch
                palette={preset.palette}
                gradientId={`${baseId}-${preset.id}`}
              />
              {!preset.isBuiltin && (
                <IconButton
                  className='preset-delete'
                  size='small'
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(preset.id)
                  }}
                  sx={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    padding: 0,
                    opacity: 0,
                    transition: 'opacity 0.15s',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'error.main', color: 'white' },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 12 }} />
                </IconButton>
              )}
            </Box>
          </Tooltip>
        ))}
        <Tooltip
          title='Save current gradient'
          arrow
          disableInteractive
          slotProps={{
            popper: { sx: { pointerEvents: 'none', userSelect: 'none' } },
          }}
        >
          <IconButton size='small' onClick={handleSaveOpen}>
            <AddIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </Box>

      <Popover
        open={!!saveAnchor}
        anchorEl={saveAnchor}
        onClose={handleSaveClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 1.5, display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size='small'
            placeholder='Preset name'
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            sx={{ width: 140 }}
          />
          <Button
            size='small'
            variant='contained'
            onClick={handleSaveConfirm}
            disabled={!presetName.trim()}
          >
            Save
          </Button>
        </Box>
      </Popover>
    </Box>
  )
}

export default GradientPresetPicker
