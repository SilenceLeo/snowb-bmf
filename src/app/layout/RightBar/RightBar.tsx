import Sidebar from 'src/app/components/Sidebar'
import BackgroundColor from 'src/app/layout/RightBar/components/BackgroundColor'
import FillConfig from 'src/app/layout/RightBar/components/FillConfig'
import RenderConfig from 'src/app/layout/RightBar/components/RenderConfig'
import ShadowConfig from 'src/app/layout/RightBar/components/ShadowConfig'
import StrokeConfig from 'src/app/layout/RightBar/components/StrokeConfig'
import { FunctionComponent } from 'react'
import { useRenderMode } from 'src/store/legend'

const RightBar: FunctionComponent = () => {
  const renderMode = useRenderMode()
  const isDefaultMode = renderMode === 'default'

  return (
    <Sidebar title='Style Config' width='300px'>
      <RenderConfig />
      {isDefaultMode && (
        <>
          <FillConfig />
          <StrokeConfig />
          <ShadowConfig />
          <BackgroundColor />
        </>
      )}
    </Sidebar>
  )
}

export default RightBar
