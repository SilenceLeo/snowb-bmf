import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import useStores from 'src/store/hooks'

import LeftBar from '../LeftBar'
import TitleBar from '../TitleBar'
import RightBar from '../RightBar'
import WorkSpace from '../WorkSpace'
import UpdateToast from './UpdateToast'

const useStyles = makeStyles(({ zIndex }) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      display: 'flex',
      flex: 1,
      position: 'relative',
      height: '0',
      overflow: 'hidden',
    },
    loadingBackdrop: {
      zIndex: zIndex.drawer + 1,
      color: '#fff',
    },
  }),
)

const Wrap: FunctionComponent<unknown> = () => {
  const classes = useStyles()
  const { ui } = useStores()

  return (
    <Box className={classes.root}>
      <TitleBar />
      <UpdateToast />
      <Box className={classes.content}>
        <LeftBar />
        <WorkSpace />
        <RightBar />
      </Box>
      <Backdrop className={classes.loadingBackdrop} open={!!ui.globalLoader}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Box>
  )
}

export default observer(Wrap)
