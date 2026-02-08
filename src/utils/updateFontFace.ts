let fontTargeCache: HTMLStyleElement
let loadDiv: HTMLDivElement

export default async function updateFontFace(
  name: string,
  url: string,
): Promise<void> {
  const cssNode = document.createTextNode(`
    @font-face {
        font-family: "${name}";
        src: url("${url}") format('truetype');
    }`)

  if (!fontTargeCache) {
    const textNode = document.createTextNode(`A`)
    fontTargeCache = document.createElement('style')
    loadDiv = document.createElement('div')
    document.head.appendChild(fontTargeCache)
    fontTargeCache.appendChild(cssNode)
    loadDiv.appendChild(textNode)
    loadDiv.style.position = 'absolute'
    loadDiv.style.left = '-1000px'
    loadDiv.style.top = '-1000px'
    loadDiv.style.opacity = '0'
    loadDiv.style.fontSize = '12px'
    loadDiv.style.pointerEvents = 'none'
    document.body.appendChild(loadDiv)
  } else {
    fontTargeCache.appendChild(cssNode)
  }
  loadDiv.style.fontFamily = name

  // Use FontFace API to detect when font is loaded
  try {
    await document.fonts.load(`12px "${name}"`)
  } catch {
    // Fallback: if fonts.load fails, wait briefly for the CSS @font-face to apply
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
}
