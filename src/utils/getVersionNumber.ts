function getVersionNumber(version: string | string[] | number[]): number {
  if (typeof version === 'string') {
    version = version.split('.')
  }

  if (!Array.isArray(version)) return 0

  version = [...version] as number[]

  return version
    .reverse()
    .reduce<number>(
      (previousValue: number, currentValue: number, currentIndex: number) => {
        return (
          previousValue + Number(currentValue) * Math.pow(1000, currentIndex)
        )
      },
      0,
    )
}

export default getVersionNumber
