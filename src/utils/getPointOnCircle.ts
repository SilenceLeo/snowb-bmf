export interface Point {
  x: number
  y: number
}

export default function getPointOnCircle(
  x: number,
  y: number,
  r: number,
  angle: number,
): Point {
  return {
    x: x + r * Math.cos((Math.PI / 180) * angle),
    y: y + r * Math.sin((Math.PI / 180) * angle),
  }
}
