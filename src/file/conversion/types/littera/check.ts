import * as Sentry from '@sentry/react'
import validate from './schema'
import { CheckFunction } from '../type'

const check: CheckFunction = (litteraStr) => {
  if (typeof litteraStr !== 'string') return false
  let litteraData

  try {
    litteraData = JSON.parse(litteraStr)
  } catch (e) {
    return false
  }

  const isLittera = validate(litteraData)

  if (!isLittera) {
    if (process.env.NODE_ENV === 'development')
      console.log(isLittera, validate.errors)

    validate.errors?.forEach((item) => {
      Sentry.addBreadcrumb({
        category: 'littera',
        message: 'Littera validate error',
        level: Sentry.Severity.Info,
        data: item,
      })
    })
    Sentry.captureMessage('Littera validate error')
  }

  return isLittera
}

export default check
