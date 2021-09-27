import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import App from './app/App'

import * as serviceWorkerRegistration from './serviceWorkerRegistration'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://007c463bad354a5baf9a11d8e9d7c8a6@o501223.ingest.sentry.io/5981296',
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
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
