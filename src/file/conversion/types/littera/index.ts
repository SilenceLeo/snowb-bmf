import { ConversionFileItem } from '../type'
import check from './check'
import decode from './decode'

const litteraFile: ConversionFileItem = {
  ext: '.ltr',
  check,
  decode,
}

export default litteraFile
