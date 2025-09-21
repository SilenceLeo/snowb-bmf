function getVersionNumber(version: string | string[] | number[]): number {
  // Normalize input to number array
  const versionArray =
    typeof version === 'string'
      ? version.split('.').map(Number)
      : Array.isArray(version)
        ? version.map(Number)
        : []

  // Return 0 for invalid input
  if (versionArray.length === 0) {
    return 0
  }

  // Convert version array to number (e.g., [1, 2, 3] -> 1002003)
  return versionArray.reduceRight((acc, value, index) => {
    const multiplier = Math.pow(1000, versionArray.length - 1 - index)
    return acc + value * multiplier
  }, 0)
}

export default getVersionNumber
