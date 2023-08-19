/**
 * Snap code from: https://opentype.js.org/
 */
import type { Path } from 'opentype.js'

function sharp(v: number, distance: number = 1, strength: number = 80) {
  return v * (1.0 - strength) + strength * Math.round(v / distance) * distance
}

export default function pathDoSharp(
  path: Path,
  snapStrength = 80,
  snapDistance = 1,
  snapX = 0,
  snapY = 0,
) {
  const strength = snapStrength / 100.0
  for (let i = 0; i < path.commands.length; i++) {
    const cmd = path.commands[i]
    if (cmd.type !== 'Z') {
      cmd.x = sharp(cmd.x + snapX, snapDistance, strength) - snapX
      cmd.y = sharp(cmd.y + snapY, snapDistance, strength) - snapY
    }
    if (cmd.type === 'Q' || cmd.type === 'C') {
      cmd.x1 = sharp(cmd.x1 + snapX, snapDistance, strength) - snapX
      cmd.y1 = sharp(cmd.y1 + snapY, snapDistance, strength) - snapY
    }
    if (cmd.type === 'C') {
      cmd.x2 = sharp(cmd.x2 + snapX, snapDistance, strength) - snapX
      cmd.y2 = sharp(cmd.y2 + snapY, snapDistance, strength) - snapY
    }
  }
}
