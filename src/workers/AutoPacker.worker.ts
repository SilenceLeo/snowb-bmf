import { GuillotineBinPack } from 'rectangle-packer'

interface Rectangle {
  width: number
  height: number
  x: number
  y: number
  letter: string
}

const STOP = 0
const DO_PLACING = 1
const INCREASE = 2
const REDUCE = 3

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
  let state = DO_PLACING
  let placed: Rectangle[] = []
  while (state) {
    switch (state) {
      case DO_PLACING:
        const packer = new GuillotineBinPack<Rectangle>(
          min + Math.ceil((max - min) / 2),
          min + Math.ceil((max - min) / 2),
        )
        packer.InsertSizes([...list], true, 1, 1)
        if (max - min < 2) {
          state = STOP
        } else if (list.length > packer.usedRectangles.length) {
          state = INCREASE
        } else {
          placed = packer.usedRectangles
          state = REDUCE
        }
        break
      case INCREASE:
        min += Math.ceil((max - min) / 2)
        state = DO_PLACING
        break
      case REDUCE:
        max -= Math.floor((max - min) / 2)
        state = DO_PLACING
        break
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
