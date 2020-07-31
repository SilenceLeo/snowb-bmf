import is from './is'

const num = <T extends unknown>(a: T, b: number): number => {
  if (is.num(a)) return a as number
  return b
}

export default {
  num,
}
