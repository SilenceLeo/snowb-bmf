import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import { useProjectUi } from 'src/store/hooks'

import PackView from '../PackView'
import Preview from '../Preview'

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    root: {
      backgroundColor: palette.background.default,
      position: 'relative',
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
  }),
)

const MainView: FunctionComponent<unknown> = () => {
  const { showPreview } = useProjectUi()
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {showPreview ? <Preview /> : <PackView />}
    </div>
  )
}

export default observer(MainView)
