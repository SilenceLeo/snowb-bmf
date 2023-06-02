import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'

import App from './app/App'

import * as serviceWorkerRegistration from './serviceWorkerRegistration'

if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: process.env.REACT_APP_SENTRY_RELEASE || 'test',
    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
  })
}

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate(registration) {
    const worker = registration.waiting
    if (!worker) return

    const channel = new MessageChannel()

    channel.port1.onmessage = () => {
      window.dispatchEvent(new CustomEvent('updateVerion', { detail: worker }))
    }

    worker.postMessage({ type: 'SKIP_WAITING' }, [channel.port2])
  },
})
