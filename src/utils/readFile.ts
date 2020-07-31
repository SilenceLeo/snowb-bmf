export default function readFile(
  file: File,
): Promise<string | ArrayBuffer | null> {
  if (file.arrayBuffer) return file.arrayBuffer()

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (e) => {
      resolve(e.target?.result)
    }
  })
}
