import React, { useRef, useState, useEffect, FunctionComponent } from 'react'
import clsx from 'clsx'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'

import styles from './ProjectTab.module.scss'

interface ProjectTabProps {
  name: string
  value: number
  selected?: boolean
  useRemove?: boolean
  onRemove?: (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    value: number,
  ) => void
  onChange?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    value: number,
  ) => void
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onRename?: (name: string, value: number) => void
}

const ProjectTab: FunctionComponent<ProjectTabProps> = (
  props: ProjectTabProps,
) => {
  const {
    name,
    useRemove,
    selected,
    value,
    onChange,
    onClick,
    onRemove,
    onRename,
  } = props
  const { palette } = useTheme()
  const [editor, setEditor] = useState(false)
  const [sname, setSName] = useState(name)
  const editorRef = useRef<HTMLInputElement>(null)

  const handleRemove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation()
    if (onRemove) onRemove(e, value)
  }

  const handleSelect = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): void => {
    e.stopPropagation()
    if (onChange) onChange(e, value)
    if (onClick) onClick(e)
  }

  const handleDoubleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): void => {
    e.stopPropagation()
    if (editorRef.current) {
      setEditor(true)
    }
  }

  const handleEditorEnd = (e: { preventDefault?(): void }) => {
    if (e.preventDefault) e.preventDefault()
    setEditor(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 && editorRef.current) {
      editorRef.current.blur()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSName(e.target.value)
  }

  useEffect(() => {
    if (editor && editorRef.current) editorRef.current.focus()
    if (!editor && onRename) onRename(sname, value)
  }, [editor, onRename, sname, value])

  useEffect(() => {
    setSName(name)
  }, [name])

  return (
    <div
      aria-hidden
      className={clsx(styles.root, {
        [styles.selected]: selected,
      })}
      style={{
        borderRight: `1px solid ${palette.background.default}`,
        ...(selected ? { background: palette.background.default } : {}),
      }}
      onClick={handleSelect}
      onDoubleClick={handleDoubleClick}
      title='Double click rename'
    >
      <span aria-hidden className={styles.name}>
        {editor ? sname : name}
        <input
          className={styles.input}
          hidden={!editor}
          ref={editorRef}
          value={editor ? sname : name}
          type='text'
          onKeyDown={handleKeyDown}
          onBlur={handleEditorEnd}
          //   onInput={handleInput}
          onChange={handleInput}
        />
      </span>
      {useRemove ? (
        <CloseIcon
          className={styles.icon}
          onClick={handleRemove}
          onDoubleClick={handleRemove}
        />
      ) : null}
    </div>
  )
}

export default ProjectTab
