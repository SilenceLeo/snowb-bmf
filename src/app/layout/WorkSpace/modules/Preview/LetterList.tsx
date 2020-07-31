import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import clsx from 'clsx'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import { useProjectUi } from 'src/store/hooks'

import { PreviewObject } from './getPreviewCanvas'

const useStyles = makeStyles(() =>
  createStyles({
    letter: {
      position: 'absolute',
      '&:hover,&$select': {
        background: 'rgba(0,0,0,0.2)',
        outline: '1px solid #000',
      },
    },
    select: {
      '& + $next': {
        background: 'rgba(0,0,0,0.1)',
        outline: '1px dashed #666',
      },
    },
    next: {},
  }),
)

interface LetterListProps {
  data: PreviewObject
}

const LetterList: FunctionComponent<LetterListProps> = (
  props: LetterListProps,
) => {
  const {
    data: { xOffset, yOffset, list },
  } = props
  const classes = useStyles()
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
            className={clsx(classes.letter, {
              [classes.select]: item.letter === ui.selectLetter,
              [classes.next]: item.letter === ui.selectNextLetter,
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
