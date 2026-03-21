import { saveAs } from 'file-saver'
import JSZip from 'jszip'

import getPageFileName from './getPageFileName'
import toBmfInfo from './toBmfInfo'
import { BMFontDistanceField, ConfigItem, ExportOptions, ExportProjectData } from './type'

export default async function exportFile(
  projectData: ExportProjectData,
  config: ConfigItem,
  fontName: string,
  fileName: string,
  options?: ExportOptions,
): Promise<void> {
  const zip = new JSZip()
  const { layout, name } = projectData
  const saveFileName = fileName || name

  // Build distanceField metadata for BMFont descriptor (SDF/MSDF modes)
  // Pack canvases are already SDF textures when renderMode !== 'default'
  let distanceField: BMFontDistanceField | undefined
  if (projectData.renderMode !== 'default') {
    distanceField = {
      fieldType: projectData.renderMode as 'sdf' | 'psdf' | 'msdf' | 'mtsdf',
      distanceRange: projectData.distanceRange,
    }
  }

  // Generate BMFont info with correct file names from the start
  const bmfont = toBmfInfo(projectData, fontName, saveFileName, distanceField)

  let includePng = false

  if (config.getFiles) {
    const filesResult = config.getFiles({
      project: projectData,
      bmfont,
      fontName,
      fileName: saveFileName,
      options,
    })

    filesResult.files.forEach((file) => {
      zip.file(file.name, file.content)
    })

    includePng = filesResult.includePng === true
  } else if (config.getContent) {
    const content = config.getContent(bmfont, options)
    includePng = config.includePng !== false

    // Add the font descriptor file to zip
    zip.file(`${saveFileName}.${config.ext}`, content)
  }

  // Add PNG pages if needed, then generate the zip
  if (includePng) {
    await addPngPages(zip, projectData.packCanvases, layout, saveFileName)
  }
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  saveAs(zipBlob, `${saveFileName}.zip`)
}

function addPngPages(
  zip: JSZip,
  packCanvases: HTMLCanvasElement[] | null,
  layout: ExportProjectData['layout'],
  saveFileName: string,
): Promise<void> {
  if (!packCanvases) return Promise.resolve()

  const pagePromises: Promise<void>[] = []

  for (let pageIndex = 0; pageIndex < layout.page; pageIndex++) {
    const sourceCanvas = packCanvases[pageIndex]
    if (!sourceCanvas) continue

    const pagePromise = new Promise<void>((resolve, reject) => {
      sourceCanvas.toBlob((blob) => {
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

  return pagePromises.length
    ? Promise.all(pagePromises).then(() => {})
    : Promise.resolve()
}
