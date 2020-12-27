import Rect, { RectSize } from './Rect'

enum FreeRectChoiceHeuristic {
  RectBestShortSideFit, ///< -BSSF: Positions the rectangle against the short side of a free rectangle into which it fits the best.
  RectBestLongSideFit, ///< -BLSF: Positions the rectangle against the long side of a free rectangle into which it fits the best.
  RectBestAreaFit, ///< -BAF: Positions the rectangle into the smallest free rect into which it fits.
  RectBottomLeftRule, ///< -BL: Does the Tetris placement.
  RectContactPointRule, ///< -CP: Choosest the placement where the rectangle touches other rects as much as possible.
}

interface RefNumber {
  value: number
}

export default class MaxRectsBinPack {
  static FreeRectChoiceHeuristic = FreeRectChoiceHeuristic

  private usedRectangles: Rect[] = []

  private freeRectangles: Rect[] = []

  constructor(
    private binWidth: number = 0,
    private binHeight: number = 0,
    private binAllowFlip: boolean = false,
  ) {
    this.freeRectangles.push(new Rect(0, 0, binWidth, binHeight))
  }

  /// Inserts a single rectangle into the bin, possibly rotated.
  Insert(width: number, height: number, method: FreeRectChoiceHeuristic): Rect {
    let newNode: Rect = new Rect()
    // Unused in this function. We don't need to know the score after finding the position.
    let score1: RefNumber = { value: Number.MAX_VALUE }
    let score2: RefNumber = { value: Number.MAX_VALUE }
    switch (method) {
      case FreeRectChoiceHeuristic.RectBestShortSideFit:
        newNode = this.FindPositionForNewNodeBestShortSideFit(
          width,
          height,
          score1,
          score2,
        )
        break
      case FreeRectChoiceHeuristic.RectBottomLeftRule:
        newNode = this.FindPositionForNewNodeBottomLeft(
          width,
          height,
          score1,
          score2,
        )
        break
      case FreeRectChoiceHeuristic.RectContactPointRule:
        newNode = this.FindPositionForNewNodeContactPoint(width, height, score1)
        break
      case FreeRectChoiceHeuristic.RectBestLongSideFit:
        newNode = this.FindPositionForNewNodeBestLongSideFit(
          width,
          height,
          score2,
          score1,
        )
        break
      case FreeRectChoiceHeuristic.RectBestAreaFit:
        newNode = this.FindPositionForNewNodeBestAreaFit(
          width,
          height,
          score1,
          score2,
        )
        break
    }

    if (newNode.height === 0) return newNode

    let numRectanglesToProcess = this.freeRectangles.length
    for (let i = 0; i < numRectanglesToProcess; ++i) {
      if (this.SplitFreeNode(this.freeRectangles[i], newNode)) {
        this.freeRectangles.splice(i, 1)
        --i
        --numRectanglesToProcess
      }
    }

    this.PruneFreeList()

    this.usedRectangles.push(newNode)
    return newNode
  }

  /// Inserts the given list of rectangles in an offline/batch mode, possibly rotated.
  /// @param rects The list of rectangles to insert. This vector will be destroyed in the process.
  /// @param dst [out] This list will contain the packed rectangles. The indices will not correspond to that of rects.
  /// @param method The rectangle placement rule to use when packing.
  InsertRects(rects: RectSize[], method: FreeRectChoiceHeuristic): Rect[] {
    const dst: Rect[] = []

    while (rects.length > 0) {
      let bestScore1 = Number.MAX_VALUE
      let bestScore2 = Number.MAX_VALUE
      let bestRectIndex = -1
      let bestNode: Rect | undefined

      for (let i = 0; i < rects.length; ++i) {
        const score1: RefNumber = { value: 0 }
        const score2: RefNumber = { value: 0 }
        const newNode: Rect = this.ScoreRect(
          rects[i].width,
          rects[i].height,
          method,
          score1,
          score2,
        )

        if (
          score1.value < bestScore1 ||
          (score1.value === bestScore1 && score2.value < bestScore2)
        ) {
          bestScore1 = score1.value
          bestScore2 = score2.value
          bestNode = newNode
          bestRectIndex = i
        }
      }

      if (!bestNode || bestRectIndex === -1) return []

      this.PlaceRect(bestNode)
      dst.push(bestNode)
      rects.splice(bestRectIndex, 1)
    }
    return dst
  }

  /// Places the given rectangle into the bin.
  PlaceRect(node: Rect): void {
    let numRectanglesToProcess = this.freeRectangles.length
    for (let i = 0; i < numRectanglesToProcess; ++i) {
      if (this.SplitFreeNode(this.freeRectangles[i], node)) {
        this.freeRectangles.splice(i, 1)
        --i
        --numRectanglesToProcess
      }
    }

    this.PruneFreeList()

    this.usedRectangles.push(node)
  }

  /// Computes the placement score for placing the given rectangle with the given method.
  /// @param score1 [out] The primary placement score will be outputted here.
  /// @param score2 [out] The secondary placement score will be outputted here. This isu sed to break ties.
  /// @return This struct identifies where the rectangle would be placed if it were placed.
  ScoreRect(
    width: number,
    height: number,
    method: FreeRectChoiceHeuristic,
    score1: RefNumber,
    score2: RefNumber,
  ): Rect {
    let newNode: Rect = new Rect()

    score1.value = Number.MAX_VALUE
    score2.value = Number.MAX_VALUE

    switch (method) {
      case FreeRectChoiceHeuristic.RectBestShortSideFit:
        newNode = this.FindPositionForNewNodeBestShortSideFit(
          width,
          height,
          score1,
          score2,
        )
        break
      case FreeRectChoiceHeuristic.RectBottomLeftRule:
        newNode = this.FindPositionForNewNodeBottomLeft(
          width,
          height,
          score1,
          score2,
        )
        break
      case FreeRectChoiceHeuristic.RectContactPointRule:
        newNode = this.FindPositionForNewNodeContactPoint(width, height, score1)
        score1.value = -score1.value // Reverse since we are minimizing, but for contact point score bigger is better.
        break
      case FreeRectChoiceHeuristic.RectBestLongSideFit:
        newNode = this.FindPositionForNewNodeBestLongSideFit(
          width,
          height,
          score2,
          score1,
        )
        break
      case FreeRectChoiceHeuristic.RectBestAreaFit:
        newNode = this.FindPositionForNewNodeBestAreaFit(
          width,
          height,
          score1,
          score2,
        )
        break
    }

    // Cannot fit the current rectangle.
    if (newNode.height === 0) {
      score1.value = Number.MAX_VALUE
      score2.value = Number.MAX_VALUE
    }

    return newNode
  }

  /// Computes the ratio of used surface area.
  /// Computes the ratio of used surface area to the total bin area.
  Occupancy(): number {
    let usedSurfaceArea = 0
    for (let i = 0; i < this.usedRectangles.length; ++i)
      usedSurfaceArea +=
        this.usedRectangles[i].width * this.usedRectangles[i].height

    return usedSurfaceArea / (this.binWidth * this.binHeight)
  }

  FindPositionForNewNodeBottomLeft(
    width: number,
    height: number,
    bestY: RefNumber,
    bestX: RefNumber,
  ): Rect {
    const bestNode: Rect = new Rect()

    bestY.value = Number.MAX_VALUE
    bestX.value = Number.MAX_VALUE

    for (let i = 0; i < this.freeRectangles.length; ++i) {
      // Try to place the rectangle in upright (non-flipped) orientation.
      if (
        this.freeRectangles[i].width >= width &&
        this.freeRectangles[i].height >= height
      ) {
        const topSideY: number = this.freeRectangles[i].y + height
        if (
          topSideY < bestY.value ||
          (topSideY === bestY.value && this.freeRectangles[i].x < bestX.value)
        ) {
          bestNode.x = this.freeRectangles[i].x
          bestNode.y = this.freeRectangles[i].y
          bestNode.width = width
          bestNode.height = height
          bestY.value = topSideY
          bestX.value = this.freeRectangles[i].x
        }
      }
      if (
        this.binAllowFlip &&
        this.freeRectangles[i].width >= height &&
        this.freeRectangles[i].height >= width
      ) {
        const topSideY: number = this.freeRectangles[i].y + width
        if (
          topSideY < bestY.value ||
          (topSideY === bestY.value && this.freeRectangles[i].x < bestX.value)
        ) {
          bestNode.x = this.freeRectangles[i].x
          bestNode.y = this.freeRectangles[i].y
          bestNode.width = height
          bestNode.height = width
          bestY.value = topSideY
          bestX.value = this.freeRectangles[i].x
        }
      }
    }
    return bestNode
  }

  FindPositionForNewNodeBestShortSideFit(
    width: number,
    height: number,
    bestShortSideFit: RefNumber,
    bestLongSideFit: RefNumber,
  ): Rect {
    const bestNode: Rect = new Rect()

    bestShortSideFit.value = Number.MAX_VALUE
    bestLongSideFit.value = Number.MAX_VALUE

    for (let i = 0; i < this.freeRectangles.length; ++i) {
      // Try to place the rectangle in upright (non-flipped) orientation.
      if (
        this.freeRectangles[i].width >= width &&
        this.freeRectangles[i].height >= height
      ) {
        const leftoverHoriz = Math.abs(this.freeRectangles[i].width - width)
        const leftoverVert = Math.abs(this.freeRectangles[i].height - height)
        const shortSideFit = Math.min(leftoverHoriz, leftoverVert)
        const longSideFit = Math.max(leftoverHoriz, leftoverVert)

        if (
          shortSideFit < bestShortSideFit.value ||
          (shortSideFit === bestShortSideFit.value &&
            longSideFit < bestLongSideFit.value)
        ) {
          bestNode.x = this.freeRectangles[i].x
          bestNode.y = this.freeRectangles[i].y
          bestNode.width = width
          bestNode.height = height
          bestShortSideFit.value = shortSideFit
          bestLongSideFit.value = longSideFit
        }
      }

      if (
        this.binAllowFlip &&
        this.freeRectangles[i].width >= height &&
        this.freeRectangles[i].height >= width
      ) {
        const flippedLeftoverHoriz = Math.abs(
          this.freeRectangles[i].width - height,
        )
        const flippedLeftoverVert = Math.abs(
          this.freeRectangles[i].height - width,
        )
        const flippedShortSideFit = Math.min(
          flippedLeftoverHoriz,
          flippedLeftoverVert,
        )
        const flippedLongSideFit = Math.max(
          flippedLeftoverHoriz,
          flippedLeftoverVert,
        )

        if (
          flippedShortSideFit < bestShortSideFit.value ||
          (flippedShortSideFit === bestShortSideFit.value &&
            flippedLongSideFit < bestLongSideFit.value)
        ) {
          bestNode.x = this.freeRectangles[i].x
          bestNode.y = this.freeRectangles[i].y
          bestNode.width = height
          bestNode.height = width
          bestShortSideFit.value = flippedShortSideFit
          bestLongSideFit.value = flippedLongSideFit
        }
      }
    }
    return bestNode
  }

  FindPositionForNewNodeBestLongSideFit(
    width: number,
    height: number,
    bestShortSideFit: RefNumber,
    bestLongSideFit: RefNumber,
  ): Rect {
    const bestNode: Rect = new Rect()

    bestShortSideFit.value = Number.MAX_VALUE
    bestLongSideFit.value = Number.MAX_VALUE

    for (let i = 0; i < this.freeRectangles.length; ++i) {
      // Try to place the rectangle in upright (non-flipped) orientation.
      if (
        this.freeRectangles[i].width >= width &&
        this.freeRectangles[i].height >= height
      ) {
        const leftoverHoriz = Math.abs(this.freeRectangles[i].width - width)
        const leftoverVert = Math.abs(this.freeRectangles[i].height - height)
        const shortSideFit = Math.min(leftoverHoriz, leftoverVert)
        const longSideFit = Math.max(leftoverHoriz, leftoverVert)

        if (
          longSideFit < bestLongSideFit.value ||
          (longSideFit === bestLongSideFit.value &&
            shortSideFit < bestShortSideFit.value)
        ) {
          bestNode.x = this.freeRectangles[i].x
          bestNode.y = this.freeRectangles[i].y
          bestNode.width = width
          bestNode.height = height
          bestShortSideFit.value = shortSideFit
          bestLongSideFit.value = longSideFit
        }
      }

      if (
        this.binAllowFlip &&
        this.freeRectangles[i].width >= height &&
        this.freeRectangles[i].height >= width
      ) {
        const leftoverHoriz = Math.abs(this.freeRectangles[i].width - height)
        const leftoverVert = Math.abs(this.freeRectangles[i].height - width)
        const shortSideFit = Math.min(leftoverHoriz, leftoverVert)
        const longSideFit = Math.max(leftoverHoriz, leftoverVert)

        if (
          longSideFit < bestLongSideFit.value ||
          (longSideFit === bestLongSideFit.value &&
            shortSideFit < bestShortSideFit.value)
        ) {
          bestNode.x = this.freeRectangles[i].x
          bestNode.y = this.freeRectangles[i].y
          bestNode.width = height
          bestNode.height = width
          bestShortSideFit.value = shortSideFit
          bestLongSideFit.value = longSideFit
        }
      }
    }
    return bestNode
  }

  FindPositionForNewNodeBestAreaFit(
    width: number,
    height: number,
    bestAreaFit: RefNumber,
    bestShortSideFit: RefNumber,
  ): Rect {
    const bestNode: Rect = new Rect()

    bestAreaFit.value = Number.MAX_VALUE
    bestShortSideFit.value = Number.MAX_VALUE

    for (let i = 0; i < this.freeRectangles.length; ++i) {
      const areaFit =
        this.freeRectangles[i].width * this.freeRectangles[i].height -
        width * height

      // Try to place the rectangle in upright (non-flipped) orientation.
      if (
        this.freeRectangles[i].width >= width &&
        this.freeRectangles[i].height >= height
      ) {
        const leftoverHoriz = Math.abs(this.freeRectangles[i].width - width)
        const leftoverVert = Math.abs(this.freeRectangles[i].height - height)
        const shortSideFit = Math.min(leftoverHoriz, leftoverVert)

        if (
          areaFit < bestAreaFit.value ||
          (areaFit === bestAreaFit.value &&
            shortSideFit < bestShortSideFit.value)
        ) {
          bestNode.x = this.freeRectangles[i].x
          bestNode.y = this.freeRectangles[i].y
          bestNode.width = width
          bestNode.height = height
          bestShortSideFit.value = shortSideFit
          bestAreaFit.value = areaFit
        }
      }

      if (
        this.binAllowFlip &&
        this.freeRectangles[i].width >= height &&
        this.freeRectangles[i].height >= width
      ) {
        const leftoverHoriz = Math.abs(this.freeRectangles[i].width - height)
        const leftoverVert = Math.abs(this.freeRectangles[i].height - width)
        const shortSideFit = Math.min(leftoverHoriz, leftoverVert)

        if (
          areaFit < bestAreaFit.value ||
          (areaFit === bestAreaFit.value &&
            shortSideFit < bestShortSideFit.value)
        ) {
          bestNode.x = this.freeRectangles[i].x
          bestNode.y = this.freeRectangles[i].y
          bestNode.width = height
          bestNode.height = width
          bestShortSideFit.value = shortSideFit
          bestAreaFit.value = areaFit
        }
      }
    }
    return bestNode
  }

  /// Returns 0 if the two intervals i1 and i2 are disjoint, or the length of their overlap otherwise.
  CommonIntervalLength(
    i1start: number,
    i1end: number,
    i2start: number,
    i2end: number,
  ): number {
    if (i1end < i2start || i2end < i1start) return 0
    return Math.min(i1end, i2end) - Math.max(i1start, i2start)
  }

  /// Computes the placement score for the -CP variant.
  ContactPointScoreNode(
    x: number,
    y: number,
    width: number,
    height: number,
  ): number {
    let score: number = 0

    if (x === 0 || x + width === this.binWidth) score += height
    if (y === 0 || y + height === this.binHeight) score += width

    for (let i = 0; i < this.usedRectangles.length; ++i) {
      if (
        this.usedRectangles[i].x === x + width ||
        this.usedRectangles[i].x + this.usedRectangles[i].width === x
      )
        score += this.CommonIntervalLength(
          this.usedRectangles[i].y,
          this.usedRectangles[i].y + this.usedRectangles[i].height,
          y,
          y + height,
        )
      if (
        this.usedRectangles[i].y === y + height ||
        this.usedRectangles[i].y + this.usedRectangles[i].height === y
      )
        score += this.CommonIntervalLength(
          this.usedRectangles[i].x,
          this.usedRectangles[i].x + this.usedRectangles[i].width,
          x,
          x + width,
        )
    }
    return score
  }

  FindPositionForNewNodeContactPoint(
    width: number,
    height: number,
    bestContactScore: RefNumber,
  ): Rect {
    const bestNode: Rect = new Rect()

    bestContactScore.value = -1

    for (let i = 0; i < this.freeRectangles.length; ++i) {
      // Try to place the rectangle in upright (non-flipped) orientation.
      if (
        this.freeRectangles[i].width >= width &&
        this.freeRectangles[i].height >= height
      ) {
        const score = this.ContactPointScoreNode(
          this.freeRectangles[i].x,
          this.freeRectangles[i].y,
          width,
          height,
        )
        if (score > bestContactScore.value) {
          bestNode.x = this.freeRectangles[i].x
          bestNode.y = this.freeRectangles[i].y
          bestNode.width = width
          bestNode.height = height
          bestContactScore.value = score
        }
      }
      if (
        this.binAllowFlip &&
        this.freeRectangles[i].width >= height &&
        this.freeRectangles[i].height >= width
      ) {
        const score = this.ContactPointScoreNode(
          this.freeRectangles[i].x,
          this.freeRectangles[i].y,
          height,
          width,
        )
        if (score > bestContactScore.value) {
          bestNode.x = this.freeRectangles[i].x
          bestNode.y = this.freeRectangles[i].y
          bestNode.width = height
          bestNode.height = width
          bestContactScore.value = score
        }
      }
    }
    return bestNode
  }

  /// @return True if the free node was split.
  SplitFreeNode(freeNode: Rect, usedNode: Rect): boolean {
    // Test with SAT if the rectangles even intersect.
    if (
      usedNode.x >= freeNode.x + freeNode.width ||
      usedNode.x + usedNode.width <= freeNode.x ||
      usedNode.y >= freeNode.y + freeNode.height ||
      usedNode.y + usedNode.height <= freeNode.y
    )
      return false

    if (
      usedNode.x < freeNode.x + freeNode.width &&
      usedNode.x + usedNode.width > freeNode.x
    ) {
      // New node at the top side of the used node.
      if (
        usedNode.y > freeNode.y &&
        usedNode.y < freeNode.y + freeNode.height
      ) {
        const newNode = freeNode
        newNode.height = usedNode.y - newNode.y
        this.freeRectangles.push(newNode)
      }

      // New node at the bottom side of the used node.
      if (usedNode.y + usedNode.height < freeNode.y + freeNode.height) {
        const newNode = freeNode
        newNode.y = usedNode.y + usedNode.height
        newNode.height =
          freeNode.y + freeNode.height - (usedNode.y + usedNode.height)
        this.freeRectangles.push(newNode)
      }
    }

    if (
      usedNode.y < freeNode.y + freeNode.height &&
      usedNode.y + usedNode.height > freeNode.y
    ) {
      // New node at the left side of the used node.
      if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width) {
        const newNode = freeNode
        newNode.width = usedNode.x - newNode.x
        this.freeRectangles.push(newNode)
      }

      // New node at the right side of the used node.
      if (usedNode.x + usedNode.width < freeNode.x + freeNode.width) {
        const newNode = freeNode
        newNode.x = usedNode.x + usedNode.width
        newNode.width =
          freeNode.x + freeNode.width - (usedNode.x + usedNode.width)
        this.freeRectangles.push(newNode)
      }
    }

    return true
  }

  /// Goes through the free rectangle list and removes any redundant entries.
  PruneFreeList(): void {
    /// Go through each pair and remove any rectangle that is redundant.
    for (let i = 0; i < this.freeRectangles.length; ++i)
      for (let j = i + 1; j < this.freeRectangles.length; ++j) {
        if (
          Rect.IsContainedIn(this.freeRectangles[i], this.freeRectangles[j])
        ) {
          this.freeRectangles.splice(i, 1)
          --i
          break
        }
        if (
          Rect.IsContainedIn(this.freeRectangles[j], this.freeRectangles[i])
        ) {
          this.freeRectangles.splice(j, 1)
          --j
        }
      }
  }
}
