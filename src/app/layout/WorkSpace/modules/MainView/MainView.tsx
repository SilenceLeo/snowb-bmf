import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Box from '@mui/material/Box'
import { observer } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import { useProjectUi } from 'src/store/hooks'

import PackView from '../PackView'
import Preview from '../Preview'
import styles from './MainView.module.css'

const MainView: FunctionComponent<unknown> = () => {
  const { showPreview, packFailed } = useProjectUi()

  return (
    <Box className={styles.root} sx={{ bgcolor: 'background.default' }}>
      {packFailed ? (
        <Box className={styles.toast} sx={{ bgcolor: 'error.main' }}>
          <ErrorOutlineIcon className={styles.icon} fontSize='inherit' />
          Packaging failed, try to increase the size of the package please.
        </Box>
      ) : null}
      {showPreview ? <Preview /> : <PackView />}
    </Box>
  )
}

export default observer(MainView)
