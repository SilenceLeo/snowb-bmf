import conversionList from './fileTypes'

export { encode } from './fileTypes/sbf'

function conversion(inputFile: unknown) {
  const conversion = conversionList.find((item) => item.check(inputFile))
  if (!conversion) {
    throw new Error('unknown file')
  }
  return conversion.decode(inputFile)
}

export default conversion
