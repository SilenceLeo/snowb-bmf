export default function formatStr(
  str: string,
  obj: Record<string, unknown>,
): string {
  return str.replace(/\$\w+\$/gi, (matchs: string): string => {
    const returns = obj[matchs.replace(/\$/g, '')]
    return `${returns}` === 'undefined' ? '' : `${returns}`
  })
}
