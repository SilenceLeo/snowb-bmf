import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Project } from 'src/store'
import toBmfInfo from './toBmfInfo'
import { ConfigItem } from './type'

export default function exportFile(project: Project, config: ConfigItem): void {
  const zip = new JSZip()
  const { packCanvas, name } = project
  const bmfont = toBmfInfo(project)
  const text = config.getString(bmfont)

  zip.file(`${name}.${config.ext}`, text)

  if (packCanvas) {
    packCanvas.toBlob((blob) => {
      if (blob) zip.file(`${name}.png`, blob)
      zip
        .generateAsync({ type: 'blob' })
        .then((content) => saveAs(content, `${name}.zip`))
    })
  }
}
