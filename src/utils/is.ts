type UseType<T, U> = T extends U ? true : false

type IsNumber<T> = UseType<T, number>

const num = <T>(n: T): IsNumber<T> => {
  return (typeof n === 'number' && !Number.isNaN(n)) as IsNumber<T>
}

const is = {
  num,
}

export default is
