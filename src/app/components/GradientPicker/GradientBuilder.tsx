import ClickAwayListener from '@mui/material/ClickAwayListener'
import Color from 'color'
import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import Palette from '../Palette'
import ColorStopsHolder, {
  AddPaletteItem,
  PaletteItem,
} from './ColorStopsHolder'

export type GradientBuilderProps = PropsWithChildren<{
  palette: PaletteItem[]
  onAdd: (addPaletteItem: AddPaletteItem) => void
  onUpdate: (palette: PaletteItem[]) => void
}>

export interface ChildrenProps {
  open: boolean
  anchorEl: HTMLDivElement | null
  color: string
  onChange(color: string): void
}

const GradientBuilder: FunctionComponent<GradientBuilderProps> = (
  props: GradientBuilderProps,
) => {
  const { children, palette, onUpdate, onAdd } = props
  const rootEl = useRef<HTMLDivElement | null>(null)
  const prevPaletteRef = useRef(palette)
  const [activeId, setActiveId] = useState<number>(0)

  const activeColor = useMemo(
    () => palette.find((item) => item.id === activeId)?.color ?? '',
    [activeId, palette],
  )

  useEffect(() => {
    // Detect newly added palette items by comparing IDs
    const prevIds = new Set(prevPaletteRef.current.map(({ id }) => id))
    const newItem = palette.find(({ id }) => !prevIds.has(id))
    if (newItem) {
      setActiveId(newItem.id)
    }
    prevPaletteRef.current = palette
  }, [palette])

  const handleAdd = useCallback(
    (offset: number) => {
      const list = [...palette]
      const current = { offset, color: 'rgba(0,0,0,1)' }
      let left: PaletteItem | undefined
      let right: PaletteItem | undefined
      setActiveId(0)

      list.forEach((item) => {
        if (
          item.offset < current.offset &&
          (!left || left.offset < item.offset)
        ) {
          left = item
        } else if (
          item.offset > current.offset &&
          (!right || right.offset > item.offset)
        ) {
          right = item
        }
      })

      if (left && right) {
        const offsetSpace =
          (current.offset - left.offset) / (right.offset - left.offset)
        const leftColor = Color(left.color)
        const rightColor = Color(right.color)

        const r =
          (rightColor.red() - leftColor.red()) * offsetSpace + leftColor.red()
        const g =
          (rightColor.green() - leftColor.green()) * offsetSpace +
          leftColor.green()
        const b =
          (rightColor.blue() - leftColor.blue()) * offsetSpace +
          leftColor.blue()
        const a =
          (rightColor.alpha() - leftColor.alpha()) * offsetSpace +
          leftColor.alpha()
        current.color = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(
          b,
        )},${a})`
      } else if (left || right) {
        current.color = ((left || right) as PaletteItem).color
      }

      onAdd(current)
    },
    [palette, onAdd],
  )

  const handleUpdate = useCallback(
    (item: Partial<AddPaletteItem>, isDelete = false) => {
      if (!activeId) return

      const newPalette = [...palette]
      const idx = newPalette.findIndex(
        (paletteItem) => paletteItem.id === activeId,
      )
      if (isDelete) {
        onUpdate([...newPalette.slice(0, idx), ...newPalette.slice(idx + 1)])
        setActiveId(0)
      } else {
        const updateItem = { ...newPalette[idx], ...item }
        onUpdate([
          ...newPalette.slice(0, idx),
          updateItem,
          ...newPalette.slice(idx + 1),
        ])
      }
    },
    [activeId, palette, onUpdate],
  )

  const handleColorChange = useCallback(
    (color: string) => handleUpdate({ color }),
    [handleUpdate],
  )

  return (
    <ClickAwayListener
      mouseEvent='onMouseDown'
      onClickAway={() => setActiveId(0)}
    >
      <div ref={rootEl}>
        <Palette palette={palette} height='35px' />
        <ColorStopsHolder
          palette={palette}
          activeId={activeId}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onSelect={(id) => setActiveId(id || 0)}
        />
        {/* TODO: Replace React.cloneElement with render prop or Context pattern for better type safety and explicit prop passing */}
        {children &&
          React.isValidElement<ChildrenProps>(children) &&
          React.cloneElement(children, {
            open: !!activeId,
            anchorEl: rootEl.current,
            color: activeColor,
            onChange: handleColorChange,
          })}
      </div>
    </ClickAwayListener>
  )
}
export default GradientBuilder
