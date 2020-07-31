/// <reference lib="dom" />

declare module 'requestidlecallback' {
  export const request = requestIdleCallback
  export const cancel = cancelIdleCallback
}
