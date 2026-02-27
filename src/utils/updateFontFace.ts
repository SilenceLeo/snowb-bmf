let fontTargetCache: HTMLStyleElement
let loadDiv: HTMLDivElement

export default async function updateFontFace(
  name: string,
  url: string,
): Promise<void> {
  const safeName = name.replace(/"/g, '\\"')
  const safeUrl = encodeURI(url)
  const cssNode = document.createTextNode(`
    @font-face {
        font-family: "${safeName}";
        src: url("${safeUrl}") format('truetype');
    }`)

  if (!fontTargetCache) {
    const textNode = document.createTextNode(`A`)
    fontTargetCache = document.createElement('style')
    loadDiv = document.createElement('div')
    document.head.appendChild(fontTargetCache)
    fontTargetCache.appendChild(cssNode)
    loadDiv.appendChild(textNode)
    loadDiv.style.position = 'absolute'
    loadDiv.style.left = '-1000px'
    loadDiv.style.top = '-1000px'
    loadDiv.style.opacity = '0'
    loadDiv.style.fontSize = '12px'
    loadDiv.style.pointerEvents = 'none'
    document.body.appendChild(loadDiv)
  } else {
    // Clear previous @font-face rules to avoid accumulation
    fontTargetCache.textContent = ''
    fontTargetCache.appendChild(cssNode)
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
