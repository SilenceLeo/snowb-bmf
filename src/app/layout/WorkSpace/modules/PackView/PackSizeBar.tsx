import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { useTheme } from '@mui/material/styles'
import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import { useProject } from 'src/store/hooks'

const PackSizeBar: FunctionComponent<unknown> = () => {
  const { palette } = useTheme()
  const { isPacking, layout } = useProject()
  const { packWidth, packHeight } = layout

  return (
    <Box
      sx={{
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '12px',
        padding: '2px',
        animationDuration: '300ms',
        pointerEvents: 'none',
        position: 'relative',
        bgcolor: 'background.paper',
        color: palette.text.secondary,
      }}
    >
      Packed texture size: {packWidth} x {packHeight}
      {isPacking ? (
        <LinearProgress
          sx={{
            position: 'absolute',
            left: 0,
            top: '100%',
            width: '100%',
          }}
        />
      ) : null}
    </Box>
  )
}

export default observer(PackSizeBar)
