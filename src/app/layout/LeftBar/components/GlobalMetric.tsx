import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import ConfigSection from 'src/app/components/ConfigSection'
import FormAdjustMetric from 'src/app/layout/common/FormAdjustMetric'
import { useProject } from 'src/store/hooks'

const GlobalMetric: FunctionComponent<unknown> = () => {
  const { globalAdjustMetric } = useProject()
  const { xAdvance, xOffset, yOffset, setXAdvance, setXOffset, setYOffset } =
    globalAdjustMetric

  return (
    <ConfigSection title='Global Metric Adjustments'>
      <FormAdjustMetric
        xAdvance={xAdvance}
        xOffset={xOffset}
        yOffset={yOffset}
        setXAdvance={setXAdvance}
        setXOffset={setXOffset}
        setYOffset={setYOffset}
      />
    </ConfigSection>
  )
}

export default observer(GlobalMetric)
