export interface RectSize {
  width: number
  height: number
}

export default class Rect {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public width: number = 0,
    public height: number = 0,
  ) {}

  static IsContainedIn(a: Rect, b: Rect) {
    return (
      a.x >= b.x &&
      a.y >= b.y &&
      a.x + a.width <= b.x + b.width &&
      a.y + a.height <= b.y + b.height
    )
  }
}
