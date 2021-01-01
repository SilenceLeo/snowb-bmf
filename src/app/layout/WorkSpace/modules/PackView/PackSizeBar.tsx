import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { useProjectUi } from 'src/store/hooks'

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
    },
  }),
)

const PackSizeBar: FunctionComponent<unknown> = () => {
  const { width, height } = useProjectUi()
  const classes = useStyles()

  return (
    <div className={classes.root}>
      Packed texture size: {width} x {height}
    </div>
  )
}

export default observer(PackSizeBar)
