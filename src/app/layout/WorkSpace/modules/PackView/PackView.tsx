import { FunctionComponent } from 'react'

import PackCanvas from './PackCanvas'
import PackSizeBar from './PackSizeBar'

const PackView: FunctionComponent = () => {
  return (
    <>
      <PackSizeBar />
      <PackCanvas />
    </>
  )
}

export default PackView
