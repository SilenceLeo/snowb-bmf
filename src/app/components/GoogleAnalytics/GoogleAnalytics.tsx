import { FunctionComponent, useEffect } from 'react'

interface GoogleAnalyticsProps {
  trackingId?: string
  enableInDevelopment?: boolean
}

const GoogleAnalytics: FunctionComponent<GoogleAnalyticsProps> = ({
  // eslint-disable-next-line @cspell/spellchecker
  trackingId = 'G-8KVLZM97BB',
  enableInDevelopment = false,
}) => {
  const shouldLoadAnalytics = import.meta.env.PROD || enableInDevelopment

  useEffect(() => {
    if (!shouldLoadAnalytics) {
      return
    }

    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    // @ts-ignore - gtag is dynamically added to window
    window.gtag = gtag

    gtag('js', new Date())
    gtag('config', trackingId, {
      // Configuration options
      page_title: document.title,
      page_location: window.location.href,
    })

    // Debug information for development environment
    if (import.meta.env.DEV && enableInDevelopment) {
      console.log(
        `Google Analytics initialized with tracking ID: ${trackingId}`,
      )
    }
  }, [trackingId, shouldLoadAnalytics, enableInDevelopment])

  // If analytics script is not needed, render nothing
  if (!shouldLoadAnalytics) {
    return null
  }

  return (
    <>
      {/* 
        React 19 async script support with automatic deduplication
        The script will only be loaded once even if multiple components render it
      */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
      />
    </>
  )
}

// Extend Window interface to support gtag and dataLayer
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export default GoogleAnalytics
