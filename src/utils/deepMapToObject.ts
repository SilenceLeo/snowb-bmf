const mapToObject = (map: Map<any, any>) => Object.fromEntries(map.entries())

function getPlainObjectKeys(object: { [key: PropertyKey]: any }) {
  const enumerable = new Set<PropertyKey>()

  for (const key in object) {
    enumerable.add(key)
  }

  Object.getOwnPropertySymbols(object).forEach((k) => {
    if (Object.getOwnPropertyDescriptor(object, k)!.enumerable) {
      enumerable.add(k)
    }
  })

  return Array.from(enumerable)
}

export default function deepMapToObject(source: any): any {
  if (typeof source !== 'object') {
    return source
  }

  // Directly return null if source is null
  if (source === null) {
    return null
  }

  // Directly return the Date object itself if contained in the observable
  if (source instanceof Date) {
    return source
  }

  if (Array.isArray(source)) {
    return source.map((item) => deepMapToObject(item))
  }

  if (Object.getPrototypeOf(source) === Set.prototype) {
    return deepMapToObject(Array.from(source))
  }

  if (Object.getPrototypeOf(source) === Map.prototype) {
    return deepMapToObject(mapToObject(source))
  }

  if (Object.getPrototypeOf(source) === Object.getPrototypeOf({})) {
    const res: { [key: PropertyKey]: any } = {}

    getPlainObjectKeys(source).forEach((key) => {
      res[key] = deepMapToObject(source[key])
    })

    return res
  }

  return source
}
