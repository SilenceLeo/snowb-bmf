import Grid from '@mui/material/Grid'
import { FunctionComponent } from 'react'
import { useRenderMode } from 'src/store/legend'

import PreviewCanvas from './PreviewCanvas'
import PreviewKerning from './PreviewKerning'
import PreviewMetric from './PreviewMetric'
import PreviewSdfSettings from './PreviewSdfSettings'
import PreviewText from './PreviewText'

const Preview: FunctionComponent = () => {
  const renderMode = useRenderMode()
  const isSdfMode = renderMode !== 'default'

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
          {isSdfMode ? <PreviewSdfSettings /> : null}
        </Grid>
      </Grid>
    </>
  )
}

export default Preview
