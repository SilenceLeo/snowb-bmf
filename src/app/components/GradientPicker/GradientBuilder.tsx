import React, { FunctionComponent, useRef, useState, useEffect } from 'react'
import Color from 'color'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import ColorStopsHolder, {
  AddPaletteItem,
  PaletteItem,
} from './ColorStopsHolder'
import Palette from '../Palette'

export interface GradientBuilderProps {
  children?: JSX.Element
  palette: PaletteItem[]
  onAdd: (addPaletteItem: AddPaletteItem) => void
  onUpdate: (palette: PaletteItem[]) => void
}

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
  const rootEl: React.MutableRefObject<HTMLDivElement | null> = useRef(null)
  const [oldPalette, setOldPalette] = useState([...palette])
  const [activeId, setActiveId] = useState<number>(0)
  const [activeColor, setActiveColor] = useState<string>('')
  const [isAdd, setIsAdd] = useState(false)

  useEffect(() => {
    if (isAdd) {
      const newIds = palette.map(({ id }) => id)
      const oldIds = oldPalette.map(({ id }) => id)
      const diff = Array.from(new Set([...newIds, ...oldIds])).filter(
        (id) => !oldIds.includes(id),
      )
      if (diff.length > 0) {
        setActiveId(diff[0])
      }
      setIsAdd(() => false)
    }
  }, [palette, isAdd, oldPalette])

  useEffect(() => {
    setOldPalette([...palette])
  }, [palette])

  useEffect(() => {
    if (activeId) {
      const paletteItem = palette.find((item) => item.id === activeId)
      if (paletteItem) {
        setActiveColor(paletteItem.color)
      }
    }
  }, [activeId, palette])

  const handleAdd = (offset: number) => {
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
      } else if (!right || right.offset > item.offset) {
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
        (rightColor.blue() - leftColor.blue()) * offsetSpace + leftColor.blue()
      const a =
        (rightColor.alpha() - leftColor.alpha()) * offsetSpace +
        leftColor.alpha()
      current.color = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(
        b,
      )},${Math.round(a)})`
    } else if (left || right) {
      current.color = ((left || right) as PaletteItem).color
    }

    onAdd(current)
    setIsAdd(true)
  }

  const handleUpdate = (item: Partial<AddPaletteItem>, isDelete = false) => {
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
  }

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
        {children
          ? React.cloneElement(children, {
              open: !!activeId || isAdd,
              anchorEl: rootEl.current,
              color: activeColor,
              onChange: (color: string) =>
                handleUpdate({
                  color,
                }),
            })
          : null}
      </div>
    </ClickAwayListener>
  )
}
export default GradientBuilder
