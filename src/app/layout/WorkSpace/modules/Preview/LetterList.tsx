import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import clsx from 'clsx'

import { useProjectUi } from 'src/store/hooks'

import { PreviewObject } from './getPreviewCanvas'

import styles from './LetterList.module.scss'

interface LetterListProps {
  data: PreviewObject
}

const LetterList: FunctionComponent<LetterListProps> = (
  props: LetterListProps,
) => {
  const {
    data: { xOffset, yOffset, list },
  } = props
  const ui = useProjectUi()
  const handleSelect = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    letter: string,
    next: string,
  ) => {
    // setSelectLetter
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
              top: `${item.y - yOffset}px`,
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
