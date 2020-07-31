let fontTargeCache: HTMLStyleElement
let loadDiv: HTMLDivElement

export default function updateFontFace(
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
    fontTargeCache.replaceChild(cssNode, fontTargeCache.childNodes[0])
  }
  loadDiv.style.fontFamily = name
  return new Promise((resolve) => setTimeout(resolve, 200))
}
