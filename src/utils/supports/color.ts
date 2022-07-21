/**
 * 反转颜色，用于区分前景色与背景色
 * @param s
 */
export const invertColor = (s: string): string => {
  // 对于命名色，简单换一下
  if (!s.startsWith('#')) return s !== 'black' ? 'black' : 'white'

  const ss = s.slice(1)
  return (
    '#' +
    (
      (parseInt(ss, 16) + parseInt('8'.repeat(ss.length), 16)) %
      parseInt('F'.repeat(ss.length), 16)
    ).toString(16)
  )
}
