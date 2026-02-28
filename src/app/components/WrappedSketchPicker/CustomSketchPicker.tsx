import { ComponentClass, CSSProperties, FunctionComponent, useCallback, useMemo } from 'react'
import { CustomPicker, HSLColor, RGBColor } from 'react-color'
import { ExportedColorProps } from 'react-color/lib/components/common/ColorWrap'
// @types/react-color sub-component types are incomplete: they don't declare
// hsl/hsv/rgb/renderers props that the runtime components actually accept.
// We cast imports to `FunctionComponent<any>` to bypass the incorrect typings.
import _Alpha from 'react-color/lib/components/common/Alpha'
import _Checkboard from 'react-color/lib/components/common/Checkboard'
import _EditableInput from 'react-color/lib/components/common/EditableInput'
import _Hue from 'react-color/lib/components/common/Hue'
import _Saturation from 'react-color/lib/components/common/Saturation'

const SaturationC = _Saturation as unknown as FunctionComponent<any>
const HueC = _Hue as unknown as FunctionComponent<any>
const AlphaC = _Alpha as unknown as FunctionComponent<any>
const CheckboardC = _Checkboard as unknown as FunctionComponent<any>
const EditableInputC = _EditableInput as unknown as FunctionComponent<any>

// Default preset colors matching original SketchPicker
const DEFAULT_PRESETS = [
  '#D0021B',
  '#F5A623',
  '#F8E71C',
  '#8B572A',
  '#7ED321',
  '#417505',
  '#BD10E0',
  '#9013FE',
  '#4A90E2',
  '#50E3C2',
  '#B8E986',
  '#000000',
  '#4A4A4A',
  '#9B9B9B',
  '#FFFFFF',
]

// --- Style definitions (mirroring Sketch.js inline styles) ---

const pickerBaseStyle: CSSProperties = {
  width: 200,
  padding: '10px 10px 0',
  boxSizing: 'initial',
  background: '#fff',
  borderRadius: '4px',
  boxShadow: '0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15)',
}

const saturationWrapStyle: CSSProperties = {
  width: '100%',
  paddingBottom: '75%',
  position: 'relative',
  overflow: 'hidden',
}

const saturationInnerStyle = {
  radius: '3px',
  shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
}

const controlsStyle: CSSProperties = { display: 'flex' }

const slidersStyle: CSSProperties = { padding: '4px 0', flex: '1' }

const hueWrapStyle: CSSProperties = {
  position: 'relative',
  height: '10px',
  overflow: 'hidden',
}

const hueInnerStyle = {
  radius: '2px',
  shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
}

const alphaWrapStyle: CSSProperties = {
  position: 'relative',
  height: '10px',
  marginTop: '4px',
  overflow: 'hidden',
}

const alphaInnerStyle = {
  radius: '2px',
  shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
}

const colorPreviewStyle: CSSProperties = {
  width: '24px',
  height: '24px',
  position: 'relative',
  marginTop: '4px',
  marginLeft: '4px',
  borderRadius: '3px',
}

const fieldsStyle: CSSProperties = { display: 'flex', paddingTop: '4px' }

const fieldDoubleStyle: CSSProperties = { flex: '2' }

const fieldSingleStyle: CSSProperties = { flex: '1', paddingLeft: '6px' }

const fieldInputStyle: CSSProperties = {
  width: '80%',
  padding: '4px 10% 3px',
  border: 'none',
  boxShadow: 'inset 0 0 0 1px #ccc',
  fontSize: '11px',
}

const fieldLabelStyle: CSSProperties = {
  display: 'block',
  textAlign: 'center',
  fontSize: '11px',
  color: '#222',
  paddingTop: '3px',
  paddingBottom: '4px',
  textTransform: 'capitalize',
}

const fieldStyle = { input: fieldInputStyle, label: fieldLabelStyle }

const presetsWrapStyle: CSSProperties = {
  margin: '0 -10px',
  padding: '10px 0 0 10px',
  borderTop: '1px solid #eee',
  display: 'flex',
  flexWrap: 'wrap',
  position: 'relative',
}

const swatchWrapStyle: CSSProperties = {
  width: '16px',
  height: '16px',
  margin: '0 10px 10px 0',
}

const swatchStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  borderRadius: '3px',
  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)',
  cursor: 'pointer',
}

// --- Helpers ---

function isValidHex(hex: string): boolean {
  if (hex === 'transparent') return true
  const stripped = hex.replace('#', '')
  return /^[0-9A-Fa-f]{3,8}$/.test(stripped)
}

// --- Component Props ---

interface CustomSketchPickerOwnProps {
  offset?: number
  onOffsetChange?: (offset: number) => void
  styles?: {
    default?: Record<string, Record<string, string>>
  }
  width?: number | string
  presetColors?: string[]
  disableAlpha?: boolean
}

// ColorWrap (CustomPicker HOC) injects these; @types/react-color InjectedColorProps
// is incomplete (missing hsv, oldHue, and onChange actually accepts 2 args at runtime)
interface InjectedProps {
  hex: string
  hsl: HSLColor
  hsv: { h: number; s: number; v: number; a?: number }
  rgb: RGBColor
  oldHue: number
  onChange: (...args: any[]) => void
}

type InnerProps = CustomSketchPickerOwnProps & InjectedProps

const CustomSketchPickerInner = (props: InnerProps) => {
  const {
    hex,
    hsl,
    hsv,
    rgb,
    onChange,
    offset,
    onOffsetChange,
    styles: passedStyles,
    width = 200,
    presetColors = DEFAULT_PRESETS,
    disableAlpha,
  } = props

  const showPosition =
    typeof offset === 'number' && typeof onOffsetChange === 'function'

  // Merge picker background from passed styles (dark mode)
  const pickerStyle = useMemo<CSSProperties>(() => {
    const base = { ...pickerBaseStyle, width }
    const overrides = passedStyles?.default?.picker
    return overrides ? { ...base, ...overrides } : base
  }, [width, passedStyles])

  // Active color preview with Checkboard background
  const activeColorStyle = useMemo<CSSProperties>(
    () => ({
      position: 'absolute',
      inset: '0px',
      borderRadius: '2px',
      background: `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a ?? 1})`,
      boxShadow:
        'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
    }),
    [rgb],
  )

  // Color preview override from passed styles
  const colorPreviewMerged = useMemo<CSSProperties>(() => {
    const overrides = passedStyles?.default?.color
    return overrides ? { ...colorPreviewStyle, ...overrides } : colorPreviewStyle
  }, [passedStyles])

  // Handle hex/rgba field changes (mirrors SketchFields.js logic)
  const handleColorChange = useCallback(
    (data: any, e: any) => {
      if (data.hex) {
        if (isValidHex(data.hex)) {
          onChange({ hex: data.hex, source: 'hex' }, e)
        }
      } else if (data.r || data.g || data.b) {
        onChange(
          {
            r: data.r || rgb.r,
            g: data.g || rgb.g,
            b: data.b || rgb.b,
            a: rgb.a,
            source: 'rgb',
          },
          e,
        )
      } else if (data.a) {
        let a = data.a < 0 ? 0 : data.a > 100 ? 100 : data.a
        a /= 100
        onChange({ h: hsl.h, s: hsl.s, l: hsl.l, a, source: 'rgb' }, e)
      }
    },
    [onChange, rgb, hsl],
  )

  // Handle "%" position input
  const handlePositionChange = useCallback(
    (data: any) => {
      if (!onOffsetChange) return
      const raw = data['%']
      if (raw === undefined || raw === null) return
      const num = parseInt(raw, 10)
      if (isNaN(num)) return
      const clamped = Math.min(Math.max(num, 0), 100)
      onOffsetChange(clamped / 100)
    },
    [onOffsetChange],
  )

  // Handle preset swatch click
  const handlePresetClick = useCallback(
    (hexValue: string) => {
      onChange({ hex: hexValue, source: 'hex' })
    },
    [onChange],
  )

  return (
    <div style={pickerStyle} className="sketch-picker">
      {/* Saturation panel */}
      <div style={saturationWrapStyle}>
        <SaturationC
          hsl={hsl}
          hsv={hsv}
          onChange={onChange}
          style={saturationInnerStyle}
        />
      </div>

      {/* Controls: Hue + Alpha + Color preview */}
      <div style={controlsStyle} className="flexbox-fix">
        <div style={slidersStyle}>
          <div style={hueWrapStyle}>
            <HueC
              hsl={hsl}
              onChange={onChange}
              style={hueInnerStyle}
            />
          </div>
          {!disableAlpha && (
            <div style={alphaWrapStyle}>
              <AlphaC
                rgb={rgb}
                hsl={hsl}
                onChange={onChange}
                style={alphaInnerStyle}
              />
            </div>
          )}
        </div>
        <div style={colorPreviewMerged}>
          <CheckboardC white="transparent" grey="rgba(0,0,0,.08)" size={8} renderers={{}} />
          <div style={activeColorStyle} />
        </div>
      </div>

      {/* Fields row: hex | r | g | b | a | [%] */}
      <div style={fieldsStyle} className="flexbox-fix">
        <div style={fieldDoubleStyle}>
          <EditableInputC
            style={fieldStyle}
            label="hex"
            value={hex.replace('#', '')}
            onChange={handleColorChange}
          />
        </div>
        <div style={fieldSingleStyle}>
          <EditableInputC
            style={fieldStyle}
            label="r"
            value={rgb.r}
            onChange={handleColorChange}
            dragLabel="true"
            dragMax="255"
          />
        </div>
        <div style={fieldSingleStyle}>
          <EditableInputC
            style={fieldStyle}
            label="g"
            value={rgb.g}
            onChange={handleColorChange}
            dragLabel="true"
            dragMax="255"
          />
        </div>
        <div style={fieldSingleStyle}>
          <EditableInputC
            style={fieldStyle}
            label="b"
            value={rgb.b}
            onChange={handleColorChange}
            dragLabel="true"
            dragMax="255"
          />
        </div>
        {!disableAlpha && (
          <div style={fieldSingleStyle}>
            <EditableInputC
              style={fieldStyle}
              label="a"
              value={Math.round((rgb.a ?? 1) * 100)}
              onChange={handleColorChange}
              dragLabel="true"
              dragMax="100"
            />
          </div>
        )}
        {showPosition && (
          <div style={fieldSingleStyle}>
            <EditableInputC
              style={fieldStyle}
              label="%"
              value={Math.round(offset! * 100)}
              onChange={handlePositionChange}
              dragLabel="true"
              dragMax="100"
            />
          </div>
        )}
      </div>

      {/* Preset colors */}
      {presetColors.length > 0 && (
        <div style={presetsWrapStyle} className="flexbox-fix">
          {presetColors.map((color) => (
            <div key={color} style={swatchWrapStyle}>
              <div
                style={{ ...swatchStyle, background: color }}
                onClick={() => handlePresetClick(color)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomPicker(CustomSketchPickerInner as any) as unknown as ComponentClass<
  CustomSketchPickerOwnProps & ExportedColorProps
>
