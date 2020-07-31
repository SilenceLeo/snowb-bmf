import React, { useRef, useState, useEffect, FunctionComponent } from 'react'
// import { observer } from 'mobx-react'
import clsx from 'clsx'
import { makeStyles, createStyles } from '@material-ui/core/styles'
// import Input from '@material-ui/core/Input'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    root: {
      minHeight: 'auto',
      minWidth: '80px',
      maxWidth: 'none',
      height: '34px',
      lineHeight: '16px',
      padding: '10px',
      color: 'rgba(255,255,255,0.5)',
      backgroundColor: 'rgb(45, 45, 45)',
      borderRight: `1px solid ${palette.background.default}`,
      textTransform: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      '&:hover': {
        '& $icon': {
          opacity: 1,
        },
      },
      '&:last-child': {
        borderRight: '0 none',
      },
    },
    selected: {
      background: palette.background.default,
      color: '#fff',
      '& $icon': {
        opacity: 1,
      },
    },
    name: {
      whiteSpace: 'nowrap',
      position: 'relative',
      background: 'inherit',
    },
    editor: {
      color: 'rgba(0,0,0,0)',
    },
    input: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      fontSize: 'inherit',
      padding: 0,
      border: '0 none',
      appearance: 'none',
      color: 'inherit',
      background: 'inherit',
    },
    icon: {
      width: '16px',
      height: '16px',
      marginLeft: '10px',
      opacity: 0,
    },
  }),
)

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
  const [editor, setEditor] = useState(false)
  const [sname, setSName] = useState(name)
  const editorRef = useRef<HTMLInputElement>(null)
  const classes = useStyles()

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
      className={clsx(classes.root, {
        [classes.selected]: selected,
      })}
      onClick={handleSelect}
      onDoubleClick={handleDoubleClick}
      title='Double click rename'
    >
      <span aria-hidden className={classes.name}>
        {editor ? sname : name}
        <input
          className={classes.input}
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
          className={classes.icon}
          onClick={handleRemove}
          onDoubleClick={handleRemove}
        />
      ) : null}
    </div>
  )
}

export default ProjectTab
