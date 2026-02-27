import Sidebar from 'src/app/components/Sidebar'
import BackgroundColor from 'src/app/layout/RightBar/components/BackgroundColor'
import FillConfig from 'src/app/layout/RightBar/components/FillConfig'
import ShadowConfig from 'src/app/layout/RightBar/components/ShadowConfig'
import StrokeConfig from 'src/app/layout/RightBar/components/StrokeConfig'
import { FunctionComponent } from 'react'

const RightBar: FunctionComponent = () => {
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
