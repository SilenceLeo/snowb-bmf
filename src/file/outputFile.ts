import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Project } from 'src/store'
import getXmlString from './getXmlString'
import getLuaString from './getLuaString'
import getTextString from './getTextString'
import toOutputInfo from './toOutputInfo'

interface OutputConfig {
  type: 'xml' | 'text' | 'lua'
  ext: 'fnt' | 'xml'
}

export default function outputFile(
  project: Project,
  config = {
    type: 'xml',
    ext: 'fnt',
  },
): void {
  const zip = new JSZip()
  const { packCanvas, name } = project
  const bmfont = toOutputInfo(project)
  let text = ''

  switch (config.type) {
    case 'text':
      text = getTextString(bmfont)
      break
    case 'lua':
      text = getLuaString(bmfont)
      break
    default:
      text = getXmlString(bmfont)
      break
  }

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
