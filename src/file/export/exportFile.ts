import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { Project } from 'src/store'

import toBmfInfo from './toBmfInfo'
import { ConfigItem, ExportOptions } from './type'

export default function exportFile(
  project: Project,
  config: ConfigItem,
  fontName: string,
  fileName: string,
  options?: ExportOptions,
): void {
  const zip = new JSZip()
  const { packCanvases, layout } = project
  const saveFileName = fileName || project.name

  // Generate BMFont info with correct file names from the start
  const bmfont = toBmfInfo(project, fontName, saveFileName)

  let includePng = false

  if (config.getFiles) {
    const filesResult = config.getFiles({
      project,
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

  // Wait for all pages to be processed, then generate the zip
  if (includePng) {
    addPngPages(zip, packCanvases, layout, saveFileName).then(() => {
      finalizeZip(zip, saveFileName)
    })
  } else {
    finalizeZip(zip, saveFileName)
  }
}

function addPngPages(
  zip: JSZip,
  packCanvases: HTMLCanvasElement[] | null,
  layout: Project['layout'],
  saveFileName: string,
): Promise<void> {
  if (!packCanvases) return Promise.resolve()

  const pagePromises: Promise<void>[] = []

  for (let pageIndex = 0; pageIndex < layout.page; pageIndex++) {
    const sourceCanvas = packCanvases[pageIndex]
    if (!sourceCanvas) continue

    const pagePromise = new Promise<void>((resolve) => {
      sourceCanvas.toBlob((blob) => {
        if (blob) {
          const pageName =
            layout.page > 1
              ? `${saveFileName}_${pageIndex}.png`
              : `${saveFileName}.png`
          zip.file(pageName, blob)
        }
        resolve()
      })
    })

    pagePromises.push(pagePromise)
  }

  return pagePromises.length
    ? Promise.all(pagePromises).then(() => {})
    : Promise.resolve()
}

function finalizeZip(zip: JSZip, saveFileName: string): void {
  zip
    .generateAsync({ type: 'blob' })
    .then((content) => saveAs(content, `${saveFileName}.zip`))
}
