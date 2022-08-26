import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Project } from 'src/store'
import toBmfInfo from './toBmfInfo'
import { ConfigItem } from './type'

export default function exportFile(
  project: Project,
  config: ConfigItem,
  fontName: string,
  fileName: string,
): void {
  const zip = new JSZip()
  const { packCanvas, name } = project
  const bmfont = toBmfInfo(project, fontName)
  const text = config.getString(bmfont)
  const saveFileName = fileName || name

  zip.file(`${saveFileName}.${config.ext}`, text)

  if (packCanvas) {
    packCanvas.toBlob((blob) => {
      if (blob) zip.file(`${saveFileName}.png`, blob)
      zip
        .generateAsync({ type: 'blob' })
        .then((content) => saveAs(content, `${saveFileName}.zip`))
    })
  }
}
