import { FunctionComponent } from 'react'

import PackCanvas from './PackCanvas'
import PackSizeBar from './PackSizeBar'

const PackView: FunctionComponent<unknown> = () => {
  return (
    <>
      <PackSizeBar />
      <PackCanvas />
    </>
  )
}

export default PackView
