import is from './is'

const num = (a: unknown, b: number): number => {
  if (is.num(a)) return a
  return b
}

const use = {
  num,
}

export default use
