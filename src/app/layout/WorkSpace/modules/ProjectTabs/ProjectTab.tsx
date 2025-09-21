import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import InputBase from '@mui/material/InputBase'
import { svgIconClasses } from '@mui/material/SvgIcon'
import { useTheme } from '@mui/material/styles'
import React, { FunctionComponent, useEffect, useRef, useState } from 'react'

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

const ProjectTab: FunctionComponent<ProjectTabProps> = (props) => {
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
  const [sName, setSName] = useState(name)
  const editorRef = useRef<HTMLInputElement>(null)

  const handleRemove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation()
    if (onRemove) {
      onRemove(e, value)
    }
  }

  const handleSelect = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): void => {
    e.stopPropagation()
    if (onChange) {
      onChange(e, value)
    }
    if (onClick) {
      onClick(e)
    }
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
    if (e.preventDefault) {
      e.preventDefault()
    }
    setEditor(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editorRef.current) {
      editorRef.current.blur()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSName(e.target.value)
  }

  useEffect(() => {
    if (editor && editorRef.current) {
      editorRef.current.focus()
    }
    if (!editor && onRename) {
      onRename(sName, value)
    }
  }, [editor, onRename, sName, value])

  useEffect(() => {
    setSName(name)
  }, [name])

  return (
    <Box
      aria-hidden
      sx={{
        minHeight: 'auto',
        minWidth: '80px',
        maxWidth: 'none',
        height: '34px',
        lineHeight: '16px',
        padding: '10px',
        color: 'rgba(255, 255, 255, 0.5)',
        backgroundColor: 'rgb(45, 45, 45)',
        textTransform: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        borderRight: `1px solid ${palette.background.default}`,
        ...(selected
          ? {
              color: '#fff',
              background: palette.background.default,
            }
          : {}),
        '&:hover': {
          [`.${svgIconClasses.root}`]: {
            opacity: 1,
          },
        },
        '&:last-child': {
          borderRight: '0 none',
        },
      }}
      onClick={handleSelect}
      onDoubleClick={handleDoubleClick}
      title='Double click rename'
    >
      <Box
        aria-hidden
        component='span'
        sx={{
          whiteSpace: 'nowrap',
          position: 'relative',
          background: 'inherit',
        }}
      >
        {editor ? sName : name}
        <InputBase
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            fontSize: 'inherit',
            padding: 0,
            border: 0,
            appearance: 'none',
            color: 'inherit',
            background: 'inherit',
            visibility: editor ? 'visible' : 'hidden',
            input: {
              p: 0,
              display: 'block',
            },
          }}
          ref={editorRef}
          value={editor ? sName : name}
          type='text'
          onKeyDown={handleKeyDown}
          onBlur={handleEditorEnd}
          onChange={handleInput}
        />
      </Box>
      {useRemove ? (
        <CloseIcon
          sx={{
            width: '16px',
            height: '16px',
            marginLeft: '10px',
            opacity: selected ? 1 : 0,
          }}
          onClick={handleRemove}
          onDoubleClick={handleRemove}
        />
      ) : null}
    </Box>
  )
}

export default ProjectTab
