export default function readFile(
  file: File,
  isText?: boolean,
): Promise<string | ArrayBuffer | null> {
  if (file.arrayBuffer && !isText) return file.arrayBuffer()

  return new Promise((resolve) => {
    const reader = new FileReader()

    if (isText) {
      reader.readAsText(file)
    } else {
      reader.readAsArrayBuffer(file)
    }

    reader.onload = (e) => {
      resolve(e?.target?.result || null)
    }
  })
}
