import { GuillotineBinPack } from 'rectangle-packer'

interface Rectangle {
  width: number
  height: number
  x: number
  y: number
  letter: string
}

function maxMin(list: Rectangle[]) {
  const widthList = list.map((item) => item.width)
  const heightList = list.map((item) => item.height)
  return {
    minWidth: Math.min.apply(null, widthList),
    minHeight: Math.min.apply(null, heightList),
    maxWidth: widthList.reduce((a, b) => a + b, 0),
    maxHeight: heightList.reduce((a, b) => a + b, 0),
  }
}

function packing(list: Rectangle[]) {
  const sizes = maxMin(list)
  let min = Math.max(sizes.minWidth, sizes.minHeight)
  let max = Math.max(sizes.maxWidth, sizes.maxHeight)
  let state = 1
  let placed: Rectangle[] = []
  while (state) {
    const size = min + Math.ceil((max - min) / 2)
    const packer = new GuillotineBinPack<Rectangle>(size, size)
    packer.InsertSizes([...list], true, 1, 1)

    if (max - min < 2) {
      state = 0
    } else if (list.length > packer.usedRectangles.length) {
      min += Math.ceil((max - min) / 2)
    } else {
      placed = packer.usedRectangles
      max -= Math.floor((max - min) / 2)
    }
  }
  return placed
}

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as unknown as Worker
ctx.addEventListener(
  'message',
  function converter(msg) {
    const { data } = msg
    if (data.length > 1) {
      const list = packing(data as Rectangle[])
      ctx.postMessage(list)
    } else {
      ctx.postMessage(data || [])
    }
  },
  false,
)
