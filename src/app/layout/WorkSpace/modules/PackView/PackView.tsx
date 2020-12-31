import React, { FunctionComponent } from 'react'
// import Grid from '@material-ui/core/Grid'

import PackCanvas from './PackCanvas'
import PackWaring from './PackWaring'

const PackView: FunctionComponent<unknown> = () => {
  return (
    <>
      <PackWaring />
      <PackCanvas />
    </>
  )
}

export default PackView
