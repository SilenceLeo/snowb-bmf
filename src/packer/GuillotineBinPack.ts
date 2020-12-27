import Rect, { RectSize } from './Rect'

interface RefNumber {
  value: number
}
/// Specifies the different choice heuristics that can be used when deciding which of the free subrectangles
/// to place the to-be-packed rectangle into.
enum FreeRectChoiceHeuristic {
  RectBestAreaFit, ///< -BAF
  RectBestShortSideFit, ///< -BSSF
  RectBestLongSideFit, ///< -BLSF
  RectWorstAreaFit, ///< -WAF
  RectWorstShortSideFit, ///< -WSSF
  RectWorstLongSideFit, ///< -WLSF
}

/// Specifies the different choice heuristics that can be used when the packer needs to decide whether to
/// subdivide the remaining free space in horizontal or vertical direction.
enum GuillotineSplitHeuristic {
  SplitShorterLeftoverAxis, ///< -SLAS
  SplitLongerLeftoverAxis, ///< -LLAS
  SplitMinimizeArea, ///< -MINAS, Try to make a single big rectangle at the expense of making the other small.
  SplitMaximizeArea, ///< -MAXAS, Try to make both remaining rectangles as even-sized as possible.
  SplitShorterAxis, ///< -SAS
  SplitLongerAxis, ///< -LAS
}

export default class GuillotineBinPack<T extends Rect> {
  public usedRectangles: T[] = []
  public freeRectangles: Rect[] = []
  static FreeRectChoiceHeuristic = FreeRectChoiceHeuristic
  static GuillotineSplitHeuristic = GuillotineSplitHeuristic
  constructor(
    public binWidth: number = 0,
    public binHeight: number = 0,
    public allowFlip: boolean = false,
  ) {
    if (this.binWidth && this.binHeight) {
      this.freeRectangles.push(new Rect(0, 0, this.binWidth, this.binHeight))
    }
  }

  InsertSizes(
    rects: T[],
    merge: boolean,
    rectChoice: FreeRectChoiceHeuristic,
    splitMethod: GuillotineSplitHeuristic,
  ): void {
    // Remember variables about the best packing choice we have made so far during the iteration process.
    let bestFreeRect = 0
    let bestRect = 0
    let bestFlipped = false

    // Pack rectangles one at a time until we have cleared the rects array of all rectangles.
    // rects will get destroyed in the process.
    while (rects.length > 0) {
      // Stores the penalty score of the best rectangle placement - bigger=worse, smaller=better.
      let bestScore = Number.MAX_VALUE

      for (let i = 0; i < this.freeRectangles.length; ++i) {
        for (let j = 0; j < rects.length; ++j) {
          // If this rectangle is a perfect match, we pick it instantly.
          if (
            rects[j].width === this.freeRectangles[i].width &&
            rects[j].height === this.freeRectangles[i].height
          ) {
            bestFreeRect = i
            bestRect = j
            bestFlipped = false
            bestScore = Number.MIN_VALUE
            i = this.freeRectangles.length // Force a jump out of the outer loop as well - we got an instant fit.
            break
          }
          // If flipping this rectangle is a perfect match, pick that then.
          else if (
            this.allowFlip &&
            rects[j].height === this.freeRectangles[i].width &&
            rects[j].width === this.freeRectangles[i].height
          ) {
            bestFreeRect = i
            bestRect = j
            bestFlipped = true
            bestScore = Number.MIN_VALUE
            i = this.freeRectangles.length // Force a jump out of the outer loop as well - we got an instant fit.
            break
          }
          // Try if we can fit the rectangle upright.
          else if (
            rects[j].width <= this.freeRectangles[i].width &&
            rects[j].height <= this.freeRectangles[i].height
          ) {
            let score = this.ScoreByHeuristic(
              rects[j].width,
              rects[j].height,
              this.freeRectangles[i],
              rectChoice,
            )
            if (score < bestScore) {
              bestFreeRect = i
              bestRect = j
              bestFlipped = false
              bestScore = score
            }
          }
          // If not, then perhaps flipping sideways will make it fit?
          else if (
            this.allowFlip &&
            rects[j].height <= this.freeRectangles[i].width &&
            rects[j].width <= this.freeRectangles[i].height
          ) {
            let score = this.ScoreByHeuristic(
              rects[j].height,
              rects[j].width,
              this.freeRectangles[i],
              rectChoice,
            )
            if (score < bestScore) {
              bestFreeRect = i
              bestRect = j
              bestFlipped = true
              bestScore = score
            }
          }
        }
      }

      // If we didn't manage to find any rectangle to pack, abort.
      if (bestScore === Number.MAX_VALUE) return

      // Remove the rectangle we just packed from the input list.
      const [node] = rects.splice(bestRect, 1)

      node.x = this.freeRectangles[bestFreeRect].x
      node.y = this.freeRectangles[bestFreeRect].y

      // Otherwise, we're good to go and do the actual packing.
      const newNode = new Rect(
        this.freeRectangles[bestFreeRect].x,
        this.freeRectangles[bestFreeRect].y,
        node.width,
        node.height,
      )

      if (bestFlipped)
        [newNode.width, newNode.height] = [newNode.height, newNode.width]

      // Remove the free space we lost in the bin.
      this.SplitFreeRectByHeuristic(
        this.freeRectangles[bestFreeRect],
        newNode,
        splitMethod,
      )
      this.freeRectangles.splice(bestFreeRect, 1)

      // Perform a Rectangle Merge step if desired.
      if (merge) this.MergeFreeList()

      // Remember the new used rectangle.
      this.usedRectangles.push(node)

      // Check that we're really producing correct packings here.
      // debug_assert(disjointRects.Add(newNode) === true);
    }
  }

  /// @return True if r fits inside freeRect (possibly rotated).
  Fits(r: RectSize, freeRect: Rect): boolean {
    return (
      (r.width <= freeRect.width && r.height <= freeRect.height) ||
      (r.height <= freeRect.width && r.width <= freeRect.height)
    )
  }

  /// @return True if r fits perfectly inside freeRect, i.e. the leftover area is 0.
  FitsPerfectly(r: RectSize, freeRect: Rect): boolean {
    return (
      (r.width === freeRect.width && r.height === freeRect.height) ||
      (r.height === freeRect.width && r.width === freeRect.height)
    )
  }

  //   Insert(
  //     width: number,
  //     height: number,
  //     merge: boolean,
  //     rectChoice: FreeRectChoiceHeuristic,
  //     splitMethod: GuillotineSplitHeuristic,
  //   ): Rect {
  //     // Find where to put the new rectangle.
  //     let freeNodeIndex: RefNumber = { value: 0 }
  //     const newRect: Rect = this.FindPositionForNewNode(
  //       width,
  //       height,
  //       rectChoice,
  //       freeNodeIndex,
  //     )

  //     // Abort if we didn't have enough space in the bin.
  //     if (newRect.height === 0) return newRect

  //     // Remove the space that was just consumed by the new rectangle.
  //     this.SplitFreeRectByHeuristic(
  //       this.freeRectangles[freeNodeIndex.value],
  //       newRect,
  //       splitMethod,
  //     )
  //     this.freeRectangles.splice(freeNodeIndex.value, 1)

  //     // Perform a Rectangle Merge step if desired.
  //     if (merge) this.MergeFreeList()

  //     // Remember the new used rectangle.
  //     this.usedRectangles.push(newRect)

  //     // Check that we're really producing correct packings here.
  //     // debug_assert(disjointRects.Add(newRect) === true);

  //     return newRect
  //   }

  /// Computes the ratio of used surface area to the total bin area.
  Occupancy(): number {
    ///\todo The occupancy rate could be cached/tracked incrementally instead
    ///      of looping through the list of packed rectangles here.
    let usedSurfaceArea = 0
    for (let i = 0; i < this.usedRectangles.length; ++i)
      usedSurfaceArea +=
        this.usedRectangles[i].width * this.usedRectangles[i].height

    return usedSurfaceArea / (this.binWidth * this.binHeight)
  }

  /// Returns the heuristic score value for placing a rectangle of size width*height into freeRect. Does not try to rotate.
  ScoreByHeuristic(
    width: number,
    height: number,
    freeRect: Rect,
    rectChoice: FreeRectChoiceHeuristic,
  ): number {
    switch (rectChoice) {
      case FreeRectChoiceHeuristic.RectBestAreaFit:
        return this.ScoreBestAreaFit(width, height, freeRect)
      case FreeRectChoiceHeuristic.RectBestShortSideFit:
        return this.ScoreBestShortSideFit(width, height, freeRect)
      case FreeRectChoiceHeuristic.RectBestLongSideFit:
        return this.ScoreBestLongSideFit(width, height, freeRect)
      case FreeRectChoiceHeuristic.RectWorstAreaFit:
        return this.ScoreWorstAreaFit(width, height, freeRect)
      case FreeRectChoiceHeuristic.RectWorstShortSideFit:
        return this.ScoreWorstShortSideFit(width, height, freeRect)
      case FreeRectChoiceHeuristic.RectWorstLongSideFit:
        return this.ScoreWorstLongSideFit(width, height, freeRect)
      default:
        return Number.MAX_VALUE
    }
  }

  ScoreBestAreaFit(width: number, height: number, freeRect: Rect): number {
    return freeRect.width * freeRect.height - width * height
  }

  ScoreBestShortSideFit(width: number, height: number, freeRect: Rect): number {
    const leftoverHoriz = Math.abs(freeRect.width - width)
    const leftoverVert = Math.abs(freeRect.height - height)
    const leftover = Math.min(leftoverHoriz, leftoverVert)
    return leftover
  }

  ScoreBestLongSideFit(width: number, height: number, freeRect: Rect): number {
    const leftoverHoriz = Math.abs(freeRect.width - width)
    const leftoverVert = Math.abs(freeRect.height - height)
    const leftover = Math.max(leftoverHoriz, leftoverVert)
    return leftover
  }

  ScoreWorstAreaFit(width: number, height: number, freeRect: Rect) {
    return -this.ScoreBestAreaFit(width, height, freeRect)
  }

  ScoreWorstShortSideFit(width: number, height: number, freeRect: Rect) {
    return -this.ScoreBestShortSideFit(width, height, freeRect)
  }

  ScoreWorstLongSideFit(width: number, height: number, freeRect: Rect): number {
    return -this.ScoreBestLongSideFit(width, height, freeRect)
  }

  FindPositionForNewNode(
    width: number,
    height: number,
    rectChoice: FreeRectChoiceHeuristic,
    nodeIndex: RefNumber,
  ): Rect {
    let bestNode: Rect = new Rect()

    let bestScore = Number.MAX_VALUE

    /// Try each free rectangle to find the best one for placement.
    for (let i = 0; i < this.freeRectangles.length; ++i) {
      // If this is a perfect fit upright, choose it immediately.
      if (
        width === this.freeRectangles[i].width &&
        height === this.freeRectangles[i].height
      ) {
        bestNode.x = this.freeRectangles[i].x
        bestNode.y = this.freeRectangles[i].y
        bestNode.width = width
        bestNode.height = height
        bestScore = Number.MIN_VALUE
        nodeIndex.value = i
        // debug_assert(disjointRects.Disjoint(bestNode));
        break
      }
      // If this is a perfect fit sideways, choose it.
      else if (
        height === this.freeRectangles[i].width &&
        width === this.freeRectangles[i].height
      ) {
        bestNode.x = this.freeRectangles[i].x
        bestNode.y = this.freeRectangles[i].y
        bestNode.width = height
        bestNode.height = width
        bestScore = Number.MIN_VALUE
        nodeIndex.value = i
        // debug_assert(disjointRects.Disjoint(bestNode));
        break
      }
      // Does the rectangle fit upright?
      else if (
        width <= this.freeRectangles[i].width &&
        height <= this.freeRectangles[i].height
      ) {
        let score = this.ScoreByHeuristic(
          width,
          height,
          this.freeRectangles[i],
          rectChoice,
        )

        if (score < bestScore) {
          bestNode.x = this.freeRectangles[i].x
          bestNode.y = this.freeRectangles[i].y
          bestNode.width = width
          bestNode.height = height
          bestScore = score
          nodeIndex.value = i
          // debug_assert(disjointRects.Disjoint(bestNode));
        }
      }
      // Does the rectangle fit sideways?
      else if (
        height <= this.freeRectangles[i].width &&
        width <= this.freeRectangles[i].height
      ) {
        let score = this.ScoreByHeuristic(
          height,
          width,
          this.freeRectangles[i],
          rectChoice,
        )

        if (score < bestScore) {
          bestNode.x = this.freeRectangles[i].x
          bestNode.y = this.freeRectangles[i].y
          bestNode.width = height
          bestNode.height = width
          bestScore = score
          nodeIndex.value = i
          // debug_assert(disjointRects.Disjoint(bestNode));
        }
      }
    }
    return bestNode
  }

  SplitFreeRectByHeuristic(
    freeRect: Rect,
    placedRect: Rect,
    method: GuillotineSplitHeuristic,
  ): void {
    // Compute the lengths of the leftover area.
    const w = freeRect.width - placedRect.width
    const h = freeRect.height - placedRect.height

    // Placing placedRect into freeRect results in an L-shaped free area, which must be split into
    // two disjoint rectangles. This can be achieved with by splitting the L-shape using a single line.
    // We have two choices: horizontal or vertical.

    // Use the given heuristic to decide which choice to make.

    let splitHorizontal: boolean
    switch (method) {
      case GuillotineSplitHeuristic.SplitShorterLeftoverAxis:
        // Split along the shorter leftover axis.
        splitHorizontal = w <= h
        break
      case GuillotineSplitHeuristic.SplitLongerLeftoverAxis:
        // Split along the longer leftover axis.
        splitHorizontal = w > h
        break
      case GuillotineSplitHeuristic.SplitMinimizeArea:
        // Maximize the larger area === minimize the smaller area.
        // Tries to make the single bigger rectangle.
        splitHorizontal = placedRect.width * h > w * placedRect.height
        break
      case GuillotineSplitHeuristic.SplitMaximizeArea:
        // Maximize the smaller area === minimize the larger area.
        // Tries to make the rectangles more even-sized.
        splitHorizontal = placedRect.width * h <= w * placedRect.height
        break
      case GuillotineSplitHeuristic.SplitShorterAxis:
        // Split along the shorter total axis.
        splitHorizontal = freeRect.width <= freeRect.height
        break
      case GuillotineSplitHeuristic.SplitLongerAxis:
        // Split along the longer total axis.
        splitHorizontal = freeRect.width > freeRect.height
        break
      default:
        splitHorizontal = true
      // assert(false);
    }

    // Perform the actual split.
    this.SplitFreeRectAlongAxis(freeRect, placedRect, splitHorizontal)
  }

  /// This function will add the two generated rectangles into the this.freeRectangles array. The caller is expected to
  /// remove the original rectangle from the this.freeRectangles array after that.
  SplitFreeRectAlongAxis(
    freeRect: Rect,
    placedRect: Rect,
    splitHorizontal: boolean,
  ): void {
    // Form the two new rectangles.
    const bottom: Rect = new Rect(
      freeRect.x,
      freeRect.y + placedRect.height,
      0,
      freeRect.height - placedRect.height,
    )

    const right: Rect = new Rect(
      freeRect.x + placedRect.width,
      freeRect.y,
      freeRect.width - placedRect.width,
      0,
    )

    if (splitHorizontal) {
      bottom.width = freeRect.width
      right.height = placedRect.height
    } // Split vertically
    else {
      bottom.width = placedRect.width
      right.height = freeRect.height
    }

    // Add the new rectangles into the free rectangle pool if they weren't degenerate.
    if (bottom.width > 0 && bottom.height > 0) this.freeRectangles.push(bottom)
    if (right.width > 0 && right.height > 0) this.freeRectangles.push(right)

    // debug_assert(disjointRects.Disjoint(bottom));
    // debug_assert(disjointRects.Disjoint(right));
  }

  MergeFreeList(): void {
    // Do a Theta(n^2) loop to see if any pair of free rectangles could me merged into one.
    // Note that we miss any opportunities to merge three rectangles into one. (should call this function again to detect that)
    for (let i = 0; i < this.freeRectangles.length; ++i)
      for (let j = i + 1; j < this.freeRectangles.length; ++j) {
        if (
          this.freeRectangles[i].width === this.freeRectangles[j].width &&
          this.freeRectangles[i].x === this.freeRectangles[j].x
        ) {
          if (
            this.freeRectangles[i].y ===
            this.freeRectangles[j].y + this.freeRectangles[j].height
          ) {
            this.freeRectangles[i].y -= this.freeRectangles[j].height
            this.freeRectangles[i].height += this.freeRectangles[j].height
            this.freeRectangles.splice(j, 1)
            --j
          } else if (
            this.freeRectangles[i].y + this.freeRectangles[i].height ===
            this.freeRectangles[j].y
          ) {
            this.freeRectangles[i].height += this.freeRectangles[j].height
            this.freeRectangles.splice(j, 1)
            --j
          }
        } else if (
          this.freeRectangles[i].height === this.freeRectangles[j].height &&
          this.freeRectangles[i].y === this.freeRectangles[j].y
        ) {
          if (
            this.freeRectangles[i].x ===
            this.freeRectangles[j].x + this.freeRectangles[j].width
          ) {
            this.freeRectangles[i].x -= this.freeRectangles[j].width
            this.freeRectangles[i].width += this.freeRectangles[j].width
            this.freeRectangles.splice(j, 1)
            --j
          } else if (
            this.freeRectangles[i].x + this.freeRectangles[i].width ===
            this.freeRectangles[j].x
          ) {
            this.freeRectangles[i].width += this.freeRectangles[j].width
            this.freeRectangles.splice(j, 1)
            --j
          }
        }
      }
  }
}
