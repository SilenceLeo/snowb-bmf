import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { useTheme } from '@mui/material/styles'
import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import { useProject } from 'src/store/hooks'

import styles from './PackSizeBar.module.css'

const PackSizeBar: FunctionComponent<unknown> = () => {
  const { palette } = useTheme()
  const { isPacking, ui } = useProject()
  const { width, height } = ui

  return (
    <Box
      className={styles.root}
      sx={{ bgcolor: 'background.paper', color: palette.text.secondary }}
    >
      Packed texture size: {width} x {height}
      {isPacking ? <LinearProgress className={styles.loading} /> : null}
    </Box>
  )
}

export default observer(PackSizeBar)
