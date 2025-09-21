import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { FunctionComponent, ReactNode } from 'react'

interface ConfigSectionProps {
  title: string | ReactNode
  children: ReactNode
}

const ConfigSection: FunctionComponent<ConfigSectionProps> = ({
  title,
  children,
}) => {
  return (
    <>
      <Box sx={{ px: 2, my: 4 }}>
        {typeof title === 'string' ? <Typography>{title}</Typography> : title}
      </Box>
      {children}
    </>
  )
}

export default ConfigSection
