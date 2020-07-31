import { rectanglePackerMutation } from 'rectangle-packer'

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = (self as unknown) as Worker
ctx.addEventListener(
  'message',
  function converter(msg) {
    const { data } = msg
    const list = rectanglePackerMutation(data)
    ctx.postMessage(list)
  },
  false,
)
