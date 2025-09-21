import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import FormFill from 'src/app/layout/common/FormFill'
import { useFill } from 'src/store/hooks'

import ConfigSection from '../../../components/ConfigSection'

const FillConfig: FunctionComponent<unknown> = () => {
  const fill = useFill()

  return (
    <ConfigSection title='Fill'>
      <FormFill config={fill} />
    </ConfigSection>
  )
}

export default observer(FillConfig)
