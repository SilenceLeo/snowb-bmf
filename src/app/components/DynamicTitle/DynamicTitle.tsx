import { observer } from 'mobx-react-lite'
import { FunctionComponent, useEffect, useState } from 'react'
import { useWorkspace } from 'src/store/hooks'

const DynamicTitle: FunctionComponent = observer(() => {
  const { currentProject } = useWorkspace()
  const [baseTitle] = useState(
    'Bitmap Font Generator Online - SnowB Bitmap Font',
  )

  useEffect(() => {
    // Dynamically update page title based on current project
    const projectName = currentProject?.name
    const dynamicTitle =
      projectName && projectName !== 'Unnamed'
        ? `${projectName} - SnowB Bitmap Font`
        : baseTitle

    // Use React 19's native title support, only update when necessary
    if (document.title !== dynamicTitle) {
      document.title = dynamicTitle
    }
  }, [currentProject?.name, baseTitle])

  // React 19 supports rendering title in components, but we use traditional approach for compatibility
  return null
})

export default DynamicTitle
