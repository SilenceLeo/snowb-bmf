/// <reference lib="dom" />

declare module 'requestidlecallback' {
  export const request: typeof requestIdleCallback
  export const cancel: typeof cancelIdleCallback
}
