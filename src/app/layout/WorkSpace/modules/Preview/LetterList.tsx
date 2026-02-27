import Box from '@mui/material/Box'
import React, { FunctionComponent } from 'react'
import { setSelectLetter, useSelectLetter } from 'src/store/legend'

import { PreviewObject } from './getPreviewCanvas'

interface LetterListProps {
  data: PreviewObject
  drawYOffset: number
}

const LetterList: FunctionComponent<LetterListProps> = (
  props: LetterListProps,
) => {
  const {
    data: { xOffset, yOffset, list },
    drawYOffset,
  } = props
  const { selectLetter, selectNextLetter } = useSelectLetter()

  const handleSelect = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    letter: string,
    next: string,
  ) => {
    e.stopPropagation()
    setSelectLetter(letter, next)
  }
  return (
    <>
      {/* Items lack unique IDs; letter+index is used since the same letter can appear multiple times */}
      {list.map((item, idx) => {
        const key = `${item.letter}${idx}`
        return (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              width: item.width,
              height: item.height,
              left: `${item.x - xOffset}px`,
              top: `${item.y - yOffset + drawYOffset}px`,
              '&:hover': {
                background: 'rgba(0, 0, 0, 0.2)',
                outline: '1px solid #000',
              },
              ...(item.letter === selectLetter && {
                background: 'rgba(0, 0, 0, 0.2)',
                outline: '1px solid #000',
              }),
              ...(item.letter === selectNextLetter && {
                background: 'rgba(0, 0, 0, 0.1)',
                outline: '1px dashed #666',
              }),
            }}
            key={key}
            onClick={(e) => handleSelect(e, item.letter, item.next)}
          />
        )
      })}
    </>
  )
}

export default LetterList
