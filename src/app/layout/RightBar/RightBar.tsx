import Sidebar from '@/app/components/Sidebar'
import BackgroundColor from '@/app/layout/RightBar/components/BackgroundColor'
import FillConfig from '@/app/layout/RightBar/components/FillConfig'
import ShadowConfig from '@/app/layout/RightBar/components/ShadowConfig'
import StrokeConfig from '@/app/layout/RightBar/components/StrokeConfig'
import { FunctionComponent } from 'react'

const RightBar: FunctionComponent<unknown> = () => {
  return (
    <Sidebar title='Style Config' width='300px'>
      <FillConfig />
      <StrokeConfig />
      <ShadowConfig />
      <BackgroundColor />
    </Sidebar>
  )
}

export default RightBar
