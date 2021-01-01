import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'

import { useProjectUi } from 'src/store/hooks'

import PackView from '../PackView'
import Preview from '../Preview'

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    '@keyframes slideDown': {
      from: { opacity: 0, transform: 'translate(0, -100%)' },
      to: { opacity: 1, transform: 'translate(0, 0)' },
    },
    root: {
      backgroundColor: palette.background.default,
      position: 'relative',
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
    toast: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      zIndex: 10,
      background: palette.error.main,
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 14,
      padding: 2,
      animationName: '$slideDown',
      animationDuration: '300ms',
      pointerEvents: 'none',
    },
    icon: {
      marginRight: 5,
    },
  }),
)

const MainView: FunctionComponent<unknown> = () => {
  const { showPreview, packFailed } = useProjectUi()
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {packFailed ? (
        <div className={classes.toast}>
          <ErrorOutlineIcon className={classes.icon} fontSize='inherit' />
          Packaging failed, try to increase the size of the package please.
        </div>
      ) : null}
      {showPreview ? <Preview /> : <PackView />}
    </div>
  )
}

export default observer(MainView)
