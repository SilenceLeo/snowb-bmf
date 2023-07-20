export const PREFIX_STR = 'SnowBambooBMF'
const prefix = (): Uint8Array =>
  new Uint8Array([...PREFIX_STR.split('').map((s) => s.charCodeAt(0)), 1, 1, 1])

export default prefix
