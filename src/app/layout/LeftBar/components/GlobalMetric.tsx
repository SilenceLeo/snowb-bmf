import { FunctionComponent } from 'react'
import ConfigSection from 'src/app/components/ConfigSection'
import FormAdjustMetric from 'src/app/layout/common/FormAdjustMetric'
import {
  setGlobalXAdvance,
  setGlobalXOffset,
  setGlobalYOffset,
  useGlobalAdjustMetric,
} from 'src/store/legend'

const GlobalMetric: FunctionComponent = () => {
  const globalAdjustMetric = useGlobalAdjustMetric()

  return (
    <ConfigSection title='Global Metric Adjustments'>
      <FormAdjustMetric
        xAdvance={globalAdjustMetric.xAdvance}
        xOffset={globalAdjustMetric.xOffset}
        yOffset={globalAdjustMetric.yOffset}
        setXAdvance={setGlobalXAdvance}
        setXOffset={setGlobalXOffset}
        setYOffset={setGlobalYOffset}
      />
    </ConfigSection>
  )
}

export default GlobalMetric
