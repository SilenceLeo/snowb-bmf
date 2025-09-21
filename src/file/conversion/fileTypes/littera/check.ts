import * as Sentry from '@sentry/react'

import { CheckFunction } from '../type'
import validate from './schema'

const check: CheckFunction = (litteraStr) => {
  let litteraData

  if (typeof litteraStr === 'string') {
    try {
      litteraData = JSON.parse(litteraStr)
    } catch {
      return false
    }
  }

  if (typeof litteraData !== 'object') {
    return false
  }

  const isLittera = validate(litteraData)

  if (!isLittera) {
    if (import.meta.env.DEV) {
      console.log(isLittera, validate.errors)
    }

    validate.errors?.forEach((item) => {
      Sentry.addBreadcrumb({
        category: 'littera',
        message: 'Littera validate error',
        level: 'info',
        data: item,
      })
    })
    Sentry.captureMessage('Littera validate error')
  }

  return isLittera
}

export default check
