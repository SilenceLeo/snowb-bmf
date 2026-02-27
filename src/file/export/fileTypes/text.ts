import formatStr from 'src/utils/replaceVariables'

import { FontToContent, Output } from '../type'

const TEMP_INFO = `info face="$face$" size=$size$ bold=$bold$ italic=$italic$ charset=$charset$ unicode=$unicode$ stretchH=$stretchH$ smooth=$smooth$ aa=$aa$ padding=$padding$ spacing=$spacing$ outline=$outline$\n`
const TEMP_COMMON = `common lineHeight=$lineHeight$ base=$base$ scaleW=$scaleW$ scaleH=$scaleH$ pages=$pages$ packed=$packed$ alphaChnl=$alphaChnl$ redChnl=$redChnl$ greenChnl=$greenChnl$ blueChnl=$blueChnl$\n`
const TEMP_PAGE = `page id=$id$ file="$file$"\n`
const TEMP_CHARS = `chars count=$count$\n`
const TEMP_CHAR = `char id=$id$ x=$x$ y=$y$ width=$width$ height=$height$ xoffset=$xoffset$ yoffset=$yoffset$ xadvance=$xadvance$ page=$page$ chnl=$chnl$\n`
const TEMP_KERNINGS = `kernings count=$count$\n`
const TEMP_KERNING = `kerning first=$first$ second=$second$ amount=$amount$\n`

const type = 'TEXT'

const exts = ['fnt', 'txt']

const getContent: FontToContent = (bmfont) => {
  const { info, common, pages, chars, kernings } = bmfont

  // Generate charset description based on actual character IDs
  const generateCharset = () => {
    if (chars.list.length === 0) return '""'

    const sortedIds = chars.list.map((char) => char.id).sort((a, b) => a - b)
    const ranges: string[] = []
    let rangeStart = sortedIds[0]
    let rangeEnd = sortedIds[0]

    for (let i = 1; i < sortedIds.length; i++) {
      if (sortedIds[i] === rangeEnd + 1) {
        rangeEnd = sortedIds[i]
      } else {
        ranges.push(
          rangeStart === rangeEnd
            ? `${rangeStart}`
            : `${rangeStart}-${rangeEnd}`,
        )
        rangeStart = rangeEnd = sortedIds[i]
      }
    }
    ranges.push(
      rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`,
    )

    return `"${ranges.join(',')}"`
  }

  let str = ''

  str += formatStr(TEMP_INFO, {
    ...info,
    charset: info.charset || generateCharset(),
  })

  let commonLine = formatStr(TEMP_COMMON, common).trimEnd()
  if (common.xFpBits) {
    commonLine += ` xFpBits=${common.xFpBits}`
  }
  str += `${commonLine}\n`

  pages.forEach((p) => {
    str += formatStr(TEMP_PAGE, p)
  })

  str += formatStr(TEMP_CHARS, chars)

  chars.list.forEach((char) => {
    str += formatStr(TEMP_CHAR, char)
  })

  if (kernings.count) {
    str += formatStr(TEMP_KERNINGS, kernings)

    kernings.list.forEach((kerning) => {
      str += formatStr(TEMP_KERNING, kerning)
    })
  }

  return str
}

const outputConfig: Output = { type, exts, getContent }

export default outputConfig
