import formatStr from 'src/utils/formatStr'

import { BMFont } from './toOutputInfo'

const TEMP_INFO = `Font.info = {\n\tface = "$face$",\n\tfile = "$file$",\n\tsize = $size$,\n\tbold = $bold$,\n\titalic = $italic$,\n\tcharset = $charset$\n\tunicode = $unicode$,\n\tstretchH = $stretchH$,\n\tsmooth = $smooth$,\n\taa = $aa$,\n\tpadding = {$padding$},\n\tspacing = $spacing$,\n\tcharsCount = $charsCount$,\n\tkerningsCounts = $kerningsCounts$\n}\n\n`
const TEMP_COMMON = `Font.common = {\n\tlineHeight = $lineHeight$,\n\tbase = $base$,\n\tscaleW = $scaleW$,\n\tscaleH = $scaleH$,\n\tpages = $pages$,\n\tpacked = $packed$\n}\n\n`
const TEMP_PAGE = `\t{ id=$id$, file="$file$" }`
const TEMP_CHARS = `Font.chars = {\n`
const TEMP_CHAR = `\t{\n\t\tid = $id$,\n\t\tx = $x$,\n\t\ty = $y$,\n\t\twidth = $width$,\n\t\theight = $height$,\n\t\txoffset = $xoffset$,\n\t\tyoffset = $yoffset$,\n\t\txadvance = $xadvance$,\n\t\tpage = 0,\n\t\tchnl = 15\n\t}`
const TEMP_KERNINGS = `Font.kerning = {\n`
const TEMP_KERNING = `\t{first = $first$, second = $second$, amount = $amount$}`

export default function getLuaString(bmfont: BMFont): string {
  const { info, common, pages, chars, kernings } = bmfont

  let str = ''

  str += formatStr(TEMP_INFO, {
    ...info,
    charset: info.charset || '""',
    charsCount: chars.count,
    kerningsCounts: kernings.count,
    file: pages[0].file,
  })
  str += formatStr(TEMP_COMMON, common)

  str += `Font.pages = {\n`
  str += pages.map((p) => formatStr(TEMP_PAGE, p)).join(',\n')
  str += '\n}\n\n'

  str += TEMP_CHARS
  str += chars.list.map((char) => formatStr(TEMP_CHAR, char)).join(',\n')
  str += '\n}\n\n'

  str += TEMP_KERNINGS
  str += kernings.list
    .map((kerning) => formatStr(TEMP_KERNING, kerning))
    .join(',\n')
  str += '\n}'

  return `local Font = {}

${str.replace(/\t/g, '    ')}

return Font
`
}
