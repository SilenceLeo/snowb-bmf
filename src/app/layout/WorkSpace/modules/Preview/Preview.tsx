import Grid from '@mui/material/Grid'
import { FunctionComponent } from 'react'

import PreviewCanvas from './PreviewCanvas'
import PreviewKerning from './PreviewKerning'
import PreviewMetric from './PreviewMetric'
import PreviewText from './PreviewText'

const Preview: FunctionComponent<unknown> = () => {
  return (
    <>
      <PreviewCanvas />
      <Grid container alignItems='flex-start'>
        <Grid size={4}>
          <PreviewText />
        </Grid>
        <Grid size={4}>
          <PreviewMetric />
        </Grid>
        <Grid size={4}>
          <PreviewKerning />
        </Grid>
      </Grid>
    </>
  )
}

export default Preview
