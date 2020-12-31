import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import { useProjectUi } from 'src/store/hooks'

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    '@keyframes slideDown': {
      from: { opacity: 0, transform: 'translate(0, -100%)' },
      to: { opacity: 1, transform: 'translate(0, 0)' },
    },
    root: {
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

const PackWaring: FunctionComponent<unknown> = () => {
  const { packFailed } = useProjectUi()
  const classes = useStyles()

  if (!packFailed) return null

  return (
    <div className={classes.root}>
      <ErrorOutlineIcon className={classes.icon} fontSize='inherit' />
      Packaging failed, try to increase the size of the package please.
    </div>
  )
}

export default observer(PackWaring)
