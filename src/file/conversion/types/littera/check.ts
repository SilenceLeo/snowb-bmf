import { CheckFunction } from '../type'
import validate from './schema'

const check: CheckFunction = (litteraStr) => {
  if (typeof litteraStr !== 'string') return false
  let litteraData

  try {
    litteraData = JSON.parse(litteraStr)
  } catch (e) {
    return false
  }

  const isLittera = validate(litteraData)

  if (process.env.NODE_ENV === 'development') {
    console.log(isLittera, validate.errors)
  }

  return false
}

export default check
