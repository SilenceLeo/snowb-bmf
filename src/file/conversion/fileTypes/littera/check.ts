import * as Sentry from '@sentry/react'

import { CheckFunction } from '../type'
import validate from './schema'

// Check if the data has basic Littera structure indicators (top-level keys)
function looksLikeLittera(data: Record<string, unknown>): boolean {
  const litteraKeys = ['fill', 'font', 'glyphs', 'stroke', 'shadow']
  return litteraKeys.some((key) => key in data)
}

const check: CheckFunction = (litteraStr) => {
  let litteraData

  if (typeof litteraStr === 'string') {
    try {
      litteraData = JSON.parse(litteraStr)
    } catch {
      return false
    }
  } else if (typeof litteraStr === 'object' && litteraStr !== null) {
    litteraData = litteraStr
  }

  if (typeof litteraData !== 'object') {
    return false
  }

  const isLittera = validate(litteraData)

  if (!isLittera && looksLikeLittera(litteraData as Record<string, unknown>)) {
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
