import { PathCommand } from 'opentype.js'

export default function ctxDoPath(
  ctx: CanvasRenderingContext2D,
  commands: PathCommand[],
) {
  ctx.beginPath()
  for (let i = 0; i < commands.length; i += 1) {
    const cmd = commands[i]
    if (cmd.type === 'M') {
      ctx.moveTo(cmd.x, cmd.y)
    } else if (cmd.type === 'L') {
      ctx.lineTo(cmd.x, cmd.y)
    } else if (cmd.type === 'C') {
      ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y)
    } else if (cmd.type === 'Q') {
      ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y)
    } else if (cmd.type === 'Z') {
      ctx.closePath()
    }
  }
}
