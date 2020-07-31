import React, { FunctionComponent } from 'react'
import Grid from '@material-ui/core/Grid'

import PreviewCanvas from './PreviewCanvas'
import PreviewText from './PreviewText'
import PreviewMertic from './PreviewMertic'
import PreviewKerning from './PreviewKerning'

const Preview: FunctionComponent<unknown> = () => {
  return (
    <>
      <PreviewCanvas />
      <Grid container alignItems='flex-start'>
        <Grid item xs={4}>
          <PreviewText />
        </Grid>
        <Grid item xs={4}>
          <PreviewMertic />
        </Grid>
        <Grid item xs={4}>
          <PreviewKerning />
        </Grid>
      </Grid>
    </>
  )
}

export default Preview
