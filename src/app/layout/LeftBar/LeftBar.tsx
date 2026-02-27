import { FunctionComponent } from 'react'
import Sidebar from 'src/app/components/Sidebar'

import Experimental from './components/Experimental'
import FontConfig from './components/FontConfig'
import GlobalMetric from './components/GlobalMetric'
import Glyphs from './components/Glyphs'
import LayoutConfig from './components/LayoutConfig'
import PackConfig from './components/PackConfig'

const LeftBar: FunctionComponent<unknown> = () => {
  return (
    <Sidebar title='Font Config' width='256px'>
      <Glyphs />
      <FontConfig />
      <LayoutConfig />
      <PackConfig />
      <GlobalMetric />
      <Experimental />
    </Sidebar>
  )
}

export default LeftBar
