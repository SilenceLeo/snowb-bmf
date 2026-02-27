import { saveAs } from 'file-saver'
import JSZip from 'jszip'

import getPageFileName from './getPageFileName'
import toBmfInfo from './toBmfInfo'
import { ConfigItem, ExportProjectData } from './type'

export default async function exportFile(
  projectData: ExportProjectData,
  config: ConfigItem,
  fontName: string,
  fileName: string,
): Promise<void> {
  const zip = new JSZip()
  const { packCanvases, layout, name } = projectData
  const saveFileName = fileName || name

  // Generate BMFont info with correct file names from the start
  const bmfont = toBmfInfo(projectData, fontName, saveFileName)
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

    const pagePromise = new Promise<void>((resolve, reject) => {
      sourceCanvas!.toBlob((blob) => {
        if (blob) {
          const pageName = getPageFileName(saveFileName, pageIndex, layout.page)
          zip.file(pageName, blob)
          resolve()
        } else {
          reject(
            new Error(
              `[Export] Failed to create blob for page ${pageIndex}`,
            ),
          )
        }
      })
    })

    pagePromises.push(pagePromise)
  }

  // Wait for all pages to be processed, then generate the zip
  await Promise.all(pagePromises)
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  saveAs(zipBlob, `${saveFileName}.zip`)
}
