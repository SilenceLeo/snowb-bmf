const num = (n: unknown): n is number => {
  return typeof n === 'number' && !Number.isNaN(n)
}

const is = {
  num,
}

export default is
