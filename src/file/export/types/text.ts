import formatStr from 'src/utils/supports/formatStr'
import { Output, FontToString } from '../type'

const TEMP_INFO = `info face="$face$" size=$size$ bold=$bold$ italic=$italic$ charset=$charset$ unicode=$unicode$ stretchH=$stretchH$ smooth=$smooth$ aa=$aa$ padding=$padding$ spacing=$spacing$\n`
const TEMP_COMMON = `common lineHeight=$lineHeight$ base=$base$ scaleW=$scaleW$ scaleH=$scaleH$ pages=$pages$ packed=$packed$\n`
const TEMP_PAGE = `page id=$id$ file="$file$"\n`
const TEMP_CHARS = `chars count=$count$\n`
const TEMP_CHAR = `char id=$id$ x=$x$ y=$y$ width=$width$ height=$height$ xoffset=$xoffset$ yoffset=$yoffset$ xadvance=$xadvance$ page=$page$ chnl=$chnl$\n`
const TEMP_KERNINGS = `kernings count=$count$\n`
const TEMP_KERNING = `kerning first=$first$ second=$second$ amount=$amount$\n`

const type = 'TEXT'

const exts = ['fnt', 'txt']

const getString: FontToString = (bmfont) => {
  const { info, common, pages, chars, kernings } = bmfont

  let str = ''

  str += formatStr(TEMP_INFO, { ...info, charset: info.charset || '""' })

  str += formatStr(TEMP_COMMON, common)

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

const outputConfig: Output = { type, exts, getString }

export default outputConfig
