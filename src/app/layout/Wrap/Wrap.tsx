import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import useStores from 'src/store/hooks'

import LeftBar from '../LeftBar'
import RightBar from '../RightBar'
import TitleBar from '../TitleBar'
import WorkSpace from '../WorkSpace'
import UpdateToast from './UpdateToast'
import styles from './Wrap.module.css'

const Wrap: FunctionComponent<unknown> = () => {
  const { ui } = useStores()

  return (
    <Box className={styles.root}>
      <TitleBar />
      <UpdateToast />
      <Box className={styles.content}>
        <LeftBar />
        <WorkSpace />
        <RightBar />
      </Box>
      <Backdrop className={styles.loadingBackdrop} open={!!ui.globalLoader}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Box>
  )
}

export default observer(Wrap)
