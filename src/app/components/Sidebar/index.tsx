import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import React, { FunctionComponent, ReactNode } from 'react'

interface SidebarProps {
  title: string
  width: string
  children: ReactNode
}

const Sidebar: FunctionComponent<SidebarProps> = ({
  title,
  width,
  children,
}) => {
  const childArray = React.Children.toArray(children)

  return (
    <Box
      sx={{
        bgcolor: 'background.sidebar',
        overflow: 'hidden',
        width: width,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ bgcolor: 'background.sidebar', boxShadow: 2, p: 2 }}>
        <Typography variant='subtitle2'>{title}</Typography>
      </Box>
      <Box flex={1} height={0} overflow='hidden auto'>
        {childArray.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {index < childArray.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  )
}

export default Sidebar
