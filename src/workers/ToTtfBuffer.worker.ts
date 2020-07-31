import toTtfBuffer from 'src/utils/toTtfBuffer'

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = (self as unknown) as Worker

ctx.addEventListener(
  'message',
  function converter(msg) {
    const res = toTtfBuffer(msg.data.buffer, msg.data.type)
    ctx.postMessage(res, [res.buffer])
  },
  false,
)
