import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import { useProjectUi } from 'src/store/hooks'

import styles from './LetterList.module.scss'
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
  const ui = useProjectUi()

  const handleSelect = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    letter: string,
    next: string,
  ) => {
    e.stopPropagation()
    ui.setSelectLetter(letter, next)
  }
  return (
    <>
      {list.map((item, idx) => {
        const key = `${item.letter}${idx}`
        return (
          <div
            aria-hidden
            className={clsx(styles.letter, {
              [styles.select]: item.letter === ui.selectLetter,
              [styles.next]: item.letter === ui.selectNextLetter,
            })}
            style={{
              width: item.width,
              height: item.height,
              left: `${item.x - xOffset}px`,
              top: `${item.y - yOffset + drawYOffset}px`,
            }}
            key={key}
            onClick={(e) => handleSelect(e, item.letter, item.next)}
          />
        )
      })}
    </>
  )
}

export default observer(LetterList)
