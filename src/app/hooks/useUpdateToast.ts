import { useCallback, useState } from 'react'

/**
 * Generic state management Hook
 */
export function useSimpleState<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue)

  const updateValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(newValue)
  }, [])

  const resetValue = useCallback(() => {
    setValue(initialValue)
  }, [initialValue])

  return {
    value,
    setValue: updateValue,
    resetValue,
  }
}

/**
 * Loading state Hook
 */
export function useLoading(initialState = false) {
  const [loading, setLoading] = useState(initialState)

  const startLoading = useCallback(() => setLoading(true), [])
  const stopLoading = useCallback(() => setLoading(false), [])

  const withLoading = useCallback(
    async <T>(promise: Promise<T>): Promise<T> => {
      startLoading()
      try {
        const result = await promise
        return result
      } finally {
        stopLoading()
      }
    },
    [startLoading, stopLoading],
  )

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading,
  }
}

/**
 * Error handling Hook
 */
export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null)

  const handleError = useCallback((error: Error | string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error
    setError(errorObj)
    console.error('Component Error:', errorObj)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const withErrorHandling = useCallback(
    async <T>(
      promise: Promise<T>,
      onError?: (error: Error) => void,
    ): Promise<T | null> => {
      try {
        clearError()
        return await promise
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error))
        handleError(errorObj)
        onError?.(errorObj)
        return null
      }
    },
    [handleError, clearError],
  )

  return {
    error,
    handleError,
    clearError,
    withErrorHandling,
    hasError: error !== null,
  }
}
