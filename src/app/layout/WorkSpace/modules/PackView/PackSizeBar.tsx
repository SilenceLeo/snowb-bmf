import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useProject } from 'src/store/hooks'

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    root: {
      width: '100%',
      background: palette.background.paper,
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 12,
      padding: 2,
      animationDuration: '300ms',
      pointerEvents: 'none',
      color: palette.text.secondary,
      position: 'relative',
    },
    loading: {
      position: 'absolute',
      left: 0,
      top: '100%',
      width: '100%',
    },
  }),
)

const PackSizeBar: FunctionComponent<unknown> = () => {
  const { isPacking, ui } = useProject()
  const { width, height } = ui
  const classes = useStyles()

  return (
    <div className={classes.root}>
      Packed texture size: {width} x {height}
      {isPacking ? <LinearProgress className={classes.loading} /> : null}
    </div>
  )
}

export default observer(PackSizeBar)
