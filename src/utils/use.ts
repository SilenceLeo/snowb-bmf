import is from './is'

const num = <T extends unknown>(a: T, b: number): number => {
  if (is.num(a)) return a as number
  return b
}

const use = {
  num,
}

export default use
