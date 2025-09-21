import { ConversionFileItem } from '../type'
import decode from './decode'
import { check } from './utils'

const sbfFile: ConversionFileItem = {
  ext: '.sbf',
  check,
  decode,
}

export { default as encode } from './encode'
export { getVersion, isSBFFile } from './utils'
export default sbfFile
