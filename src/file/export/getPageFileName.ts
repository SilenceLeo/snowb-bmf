/**
 * Generates the PNG filename for a given page index.
 * For single-page fonts, returns "{baseName}.png".
 * For multi-page fonts, returns "{baseName}_{paddedIndex}.png"
 * with zero-padded index based on the total page count.
 */
export default function getPageFileName(
  baseName: string,
  pageIndex: number,
  totalPages: number,
): string {
  if (totalPages === 1) {
    return `${baseName}.png`
  }

  const maxPageIndex = totalPages - 1
  const digits = maxPageIndex.toString().length
  const paddedIndex = pageIndex.toString().padStart(digits, '0')
  return `${baseName}_${paddedIndex}.png`
}
