import { CheckFunction } from '../type'
import getVersion from './getVersion'

const check: CheckFunction = (buffer) => getVersion(buffer) > 0

export default check
