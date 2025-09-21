import * as Sentry from '@sentry/react'
import { browserTracingIntegration, replayIntegration } from '@sentry/react'
import { createRoot } from 'react-dom/client'

import App from './app/App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    release: import.meta.env.VITE_SENTRY_RELEASE || 'test',
    integrations: [browserTracingIntegration(), replayIntegration()],
    tracesSampleRate: 1.0,
    environment: import.meta.env.MODE,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
  })
}

// React 19 enhanced error handling
const handleCaughtError = (
  error: unknown,
  errorInfo: { componentStack?: string; errorBoundary?: React.Component },
) => {
  console.error('React caught error:', error)
  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: errorInfo.componentStack || '',
        errorBoundary: true,
      },
    },
  })
}

const handleUncaughtError = (
  error: unknown,
  errorInfo: { componentStack?: string },
) => {
  console.error('React uncaught error:', error)
  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: errorInfo.componentStack || '',
        errorBoundary: false,
      },
    },
  })
}

const handleRecoverableError = (
  error: unknown,
  errorInfo: { componentStack?: string },
) => {
  if (import.meta.env.DEV) {
    console.warn('React recoverable error:', error)
  }
  Sentry.addBreadcrumb({
    category: 'react.recoverable',
    message: error instanceof Error ? error.message : String(error),
    level: 'warning',
    data: {
      componentStack: errorInfo.componentStack || '',
    },
  })
}

createRoot(document.getElementById('root') as HTMLElement, {
  onCaughtError: handleCaughtError,
  onUncaughtError: handleUncaughtError,
  onRecoverableError: handleRecoverableError,
}).render(<App />)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate(registration) {
    // Use the new enhanced forceUpdate function
    console.log('Service Worker: Update available, preparing to apply...')

    // Dispatch the updateVersion event with the registration for backward compatibility
    const worker = registration.waiting
    if (worker) {
      window.dispatchEvent(new CustomEvent('updateVersion', { detail: worker }))
    }
  },
  onSuccess(_registration) {
    console.log(
      'Service Worker: Successfully registered and ready for offline use',
    )
  },
})
