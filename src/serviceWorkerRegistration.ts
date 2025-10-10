// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
    ),
)

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void
  onUpdate?: (registration: ServiceWorkerRegistration) => void
}

// Enhanced configuration for better update management
interface UpdateState {
  isUpdateAvailable: boolean
  isUpdateReady: boolean
  registration: ServiceWorkerRegistration | null
  lastCheckTime: number
}

// Global state for tracking updates
const updateState: UpdateState = {
  isUpdateAvailable: false,
  isUpdateReady: false,
  registration: null,
  lastCheckTime: 0,
}

// Check for updates every 10 minutes (in production) or 30 seconds (in development)
const UPDATE_CHECK_INTERVAL = isLocalhost ? 30 * 1000 : 10 * 60 * 1000

// Dispatch custom events for better update state management
function dispatchUpdateEvent(type: string, detail?: any) {
  window.dispatchEvent(new CustomEvent(type, { detail }))
}

// Enhanced update checker with retry logic
async function checkForUpdates(registration: ServiceWorkerRegistration) {
  try {
    const now = Date.now()
    // Avoid too frequent checks
    if (now - updateState.lastCheckTime < UPDATE_CHECK_INTERVAL / 2) {
      return
    }

    updateState.lastCheckTime = now

    // Check if browser is online
    if (!navigator.onLine) {
      console.log('Service Worker: Skipping update check - offline')
      return
    }

    // Fetch the service worker script with cache busting
    const swUrl = new URL('service-worker.js', window.location.href).href
    const response = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        cache: 'no-store',
        'cache-control': 'no-cache',
      },
    })

    if (response?.status === 200) {
      console.log('Service Worker: Checking for updates...')
      await registration.update()
    }
  } catch (error) {
    console.error('Service Worker: Update check failed:', error)
  }
}

// Set up periodic update checks
function setupPeriodicUpdateCheck(registration: ServiceWorkerRegistration) {
  // Initial check after 30 seconds
  setTimeout(() => checkForUpdates(registration), 30000)

  // Regular interval checks
  const intervalId = setInterval(() => {
    checkForUpdates(registration)
  }, UPDATE_CHECK_INTERVAL)

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(intervalId)
  })

  // Check for updates when page becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(() => checkForUpdates(registration), 1000)
    }
  })

  // Check for updates when page regains focus
  window.addEventListener('focus', () => {
    setTimeout(() => checkForUpdates(registration), 1000)
  })
}

export function register(config?: Config) {
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const baseUrl = import.meta.env.BASE_URL || '/'
    const publicUrl = new URL(baseUrl, window.location.href)

    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return
    }

    window.addEventListener('load', () => {
      // Ensure proper path resolution for service worker
      const swUrl = new URL('service-worker.js', window.location.href).href

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config)

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then((registration) => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://cra.link/PWA',
          )
          setupPeriodicUpdateCheck(registration)
        })
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config)
      }
    })
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      updateState.registration = registration

      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        if (installingWorker == null) {
          return
        }

        updateState.isUpdateAvailable = true
        dispatchUpdateEvent('sw-update-found', { registration })

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'Service Worker: New content is available and will be used when all ' +
                  'tabs for this page are closed.',
              )

              updateState.isUpdateReady = true
              dispatchUpdateEvent('sw-update-ready', { registration })

              // Execute callback
              if (config?.onUpdate) {
                config.onUpdate(registration)
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Service Worker: Content is cached for offline use.')

              dispatchUpdateEvent('sw-ready', { registration })

              // Execute callback
              if (config?.onSuccess) {
                config.onSuccess(registration)
              }
            }
          }
        }
      }

      // Set up periodic update checking
      setupPeriodicUpdateCheck(registration)

      // Listen for controlled page changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker: Controller changed, reloading page')
        window.location.reload()
      })
    })
    .catch((error) => {
      console.error('Service Worker: Registration failed:', error)
      dispatchUpdateEvent('sw-error', { error })
    })
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type')
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload()
          })
        })
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config)
      }
    })
    .catch(() => {
      console.log(
        'Service Worker: No internet connection found. App is running in offline mode.',
      )
    })
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        console.error(error.message)
      })
  }
}

// Enhanced utility functions for manual update management
export function getUpdateState(): UpdateState {
  return { ...updateState }
}

export async function forceUpdate(): Promise<boolean> {
  try {
    if (!updateState.registration) {
      console.warn('Service Worker: No registration available for update')
      return false
    }

    const worker = updateState.registration.waiting
    if (!worker) {
      console.warn('Service Worker: No waiting worker available')
      return false
    }

    console.log('Service Worker: Forcing update...')

    // Create a promise to track the skipWaiting completion
    const updatePromise = new Promise<boolean>((resolve) => {
      const channel = new MessageChannel()

      channel.port1.onmessage = (event) => {
        if (event.data?.error) {
          console.error(
            'Service Worker: Skip waiting failed:',
            event.data.error,
          )
          resolve(false)
        } else {
          console.log('Service Worker: Skip waiting successful')
          resolve(true)
        }
      }

      worker.postMessage({ type: 'SKIP_WAITING' }, [channel.port2])
    })

    const result = await updatePromise

    if (result) {
      dispatchUpdateEvent('sw-update-applied')

      // Give the service worker a moment to take control
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }

    return result
  } catch (error) {
    console.error('Service Worker: Force update failed:', error)
    return false
  }
}

export async function checkForUpdatesManually(): Promise<boolean> {
  try {
    if (!updateState.registration) {
      console.warn('Service Worker: No registration available for manual check')
      return false
    }

    await checkForUpdates(updateState.registration)
    return true
  } catch (error) {
    console.error('Service Worker: Manual update check failed:', error)
    return false
  }
}
