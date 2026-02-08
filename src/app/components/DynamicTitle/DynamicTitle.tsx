import { FunctionComponent, useEffect } from 'react'
import { useProjectName } from 'src/store/legend'

const BASE_TITLE = 'Bitmap Font Generator Online - SnowB Bitmap Font'

const DynamicTitle: FunctionComponent = () => {
  const projectName = useProjectName()

  useEffect(() => {
    const dynamicTitle =
      projectName && projectName !== 'Unnamed'
        ? `${projectName} - SnowB Bitmap Font`
        : BASE_TITLE

    if (document.title !== dynamicTitle) {
      document.title = dynamicTitle
    }
  }, [projectName])

  // React 19 supports rendering title in components, but we use traditional approach for compatibility
  return null
}

export default DynamicTitle
