import conversionList from './fileTypes'

export { encode } from './fileTypes/sbf'

function conversion(inputFile: unknown) {
  const converter = conversionList.find((item) => item.check(inputFile))
  if (!converter) {
    throw new Error('unknown file')
  }
  return converter.decode(inputFile)
}

export default conversion
