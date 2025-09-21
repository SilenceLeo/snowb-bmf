import { saveAs } from 'file-saver'
import JSZip from 'jszip'
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
  const { packCanvases, layout } = project
  const saveFileName = fileName || project.name

  // Generate BMFont info with correct file names from the start
  const bmfont = toBmfInfo(project, fontName, saveFileName)
  const content = config.getContent(bmfont)

  // Add the font descriptor file to zip
  zip.file(`${saveFileName}.${config.ext}`, content)

  // Create texture files for each page
  const pagePromises: Promise<void>[] = []

  for (let pageIndex = 0; pageIndex < layout.page; pageIndex++) {
    let sourceCanvas: HTMLCanvasElement | null = null

    // Use the appropriate source canvas
    if (packCanvases && packCanvases[pageIndex]) {
      // Use the rendered page canvas (works for both single and multi-page)
      sourceCanvas = packCanvases[pageIndex]
    }

    if (!sourceCanvas) continue

    const pagePromise = new Promise<void>((resolve) => {
      sourceCanvas!.toBlob((blob) => {
        if (blob) {
          const fileName =
            layout.page > 1
              ? `${saveFileName}_${pageIndex}.png`
              : `${saveFileName}.png`
          zip.file(fileName, blob)
        }
        resolve()
      })
    })

    pagePromises.push(pagePromise)
  }

  // Wait for all pages to be processed, then generate the zip
  Promise.all(pagePromises).then(() => {
    zip
      .generateAsync({ type: 'blob' })
      .then((content) => saveAs(content, `${saveFileName}.zip`))
  })
}
