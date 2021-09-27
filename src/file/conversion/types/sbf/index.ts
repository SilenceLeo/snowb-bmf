import { ConversionFileItem } from '../type'
import check from './check'
import decode from './decode'

const sbfFile: ConversionFileItem = {
  ext: '.sbf',
  check,
  decode,
}

export { default as encode } from './encode'
export default sbfFile
