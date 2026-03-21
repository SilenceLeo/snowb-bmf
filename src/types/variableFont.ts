/**
 * Variable font (fvar) type definitions
 *
 * Used for OpenType variable font axis selection and named instances.
 */

export interface VariationAxis {
  tag: string // 'wght', 'wdth', 'ital', etc.
  name: string // 'Weight', 'Width', etc.
  minValue: number
  defaultValue: number
  maxValue: number
}

export interface VariationInstance {
  name: string // 'Bold', 'Light', etc.
  coordinates: Record<string, number> // { wght: 700 }
}
