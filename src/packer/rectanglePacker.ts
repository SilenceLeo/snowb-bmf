const SUCCESS = 1
const FAIL = 0

/**
 * 放置状态枚举
 */
enum TheState {
  DO_PLACING,
  DEC_WIDTH,
  INC_HEIGHT,
  STOP,
}

/**
 * 矩形接口
 */
export interface Rectangle {
  width: number
  height: number
  x?: number
  y?: number
  __id?: number
}

/**
 * 包围区域
 */
export interface RectangleSize {
  width: number
  height: number
}

/**
 * Cell 是一个链接结构，保存有关单元格的信息
 * height - 单元格的高度
 * occupied - 如果单元格已被占用，则该值将为非零
 * nextCell - 当前单元格正下方的下一个单元格
 */
interface ICell {
  height: number
  occupied: number
  nextCell: ICell | null
}

/**
 * Col 是一个链接结构，保存有关列的信息
 * width - 列宽
 * cell - 指向此列中根单元格的指针（最高的单元格）
 * nextCol - 当前列右边的下一列
 */
interface ICol {
  width: number
  cell: ICell | null
  nextCol: ICol | null
}

/**
 * Placing 将表示放置在矩形表面上的矩形的一个实例
 * enclosingHeight - 包装范围高度，列中所有单元格高度之和
 * enclosingWidth - 包装范围宽度，所有列的宽度之和
 * cols - 指向最左侧的列的指针。
 */
interface IPlacing {
  enclosingHeight: number
  enclosingWidth: number
  cols: ICol | null
}

interface IRange {
  startIndex: number
  endIndex: number
  overshoot: number
}

interface IRegion {
  colR: IRange
  cellR: IRange
}

/**
 * 创建 Placing
 * @param enclosingWidth 区域宽
 * @param enclosingHeight 区域高
 */
function allocPlacing(
  enclosingWidth: number,
  enclosingHeight: number,
): IPlacing {
  const cell: ICell = {
    height: enclosingHeight,
    occupied: 0,
    nextCell: null,
  }

  const cols: ICol = {
    width: enclosingWidth,
    nextCol: null,
    cell,
  }

  const placing: IPlacing = {
    enclosingWidth,
    enclosingHeight,
    cols,
  }

  return placing
}

/**
 * 释放 Placing 对象
 * @param placing 即将释放的 Placing
 */
function freePlacing(placing: IPlacing): void {
  if (placing === null) {
    return
  }
  // 循环释放列和单元格
  let col: ICol | null = placing.cols
  while (col !== null) {
    // 释放列中所有单元格
    let cell: ICell | null = col.cell
    while (cell !== null) {
      const tempR: ICell = cell
      cell = cell.nextCell
      tempR.nextCell = null
    }
    // 保存下一个列，释放当前列
    const tempC: ICol = col
    col = col.nextCol
    tempC.nextCol = null
    tempC.cell = null
  }
  placing.cols = null
  return
}

/**
 * 尝试调整列高度
 * @param col 列
 * @param height 高度
 * @param cellR 区域
 */
function tryFitHeightInCol(col: ICol, height: number, cellR: IRange): 0 | 1 {
  /**
   * 循环列中的单元格
   * 查找高度大于 height 的连续未被占用的单元格序列。
   * 结果存储在 cellR 中
   */
  if (col == null) {
    console.error('Error. col pointer was null.\n')
    return FAIL
  } else if (height <= 0) {
    console.error('Error. height must be positive.\n')
    return FAIL
  }

  let sumHeight: number = 0

  cellR.startIndex = 0
  // 循环列中的单元格
  for (let cell = col.cell, i = 0; cell != null; cell = cell.nextCell, i++) {
    /**
     * 如果单元格被占用, 重置高度总和并且更新 startIndex
     * 否则, 检查高度是否可满足
     */
    if (cell.occupied) {
      sumHeight = 0
      cellR.startIndex = i + 1
    } else {
      if (sumHeight + cell.height > height) {
        cellR.endIndex = i
        cellR.overshoot = height - sumHeight
        return SUCCESS
      } else if (sumHeight + cell.height === height) {
        // 无需拆分
        cellR.endIndex = i
        cellR.overshoot = 0
        return SUCCESS
      }
      sumHeight += cell.height
    }
  }
  // 如果循环到达这里，说明矩形不适合此列
  return FAIL
}

/**
 * 查找符合偏移的单元格
 * @param base 基础单元格
 * @param offset 偏移量
 */
function stepOffset(base: ICell | null, offset: number): ICell | null {
  if (base == null) {
    console.error('Error. Basepointer was null.\n')
    return null
  }

  let cell: ICell | null = base

  for (let i = 0; i < offset; i++) {
    cell = cell.nextCell
    if (cell == null) {
      console.error('Error. Offset to large.\n')
      return null
    }
  }
  return cell
}

/**
 * 查找可容纳矩形的区域
 * @param placing 区域
 * @param rectangle 矩形
 * @param reg 位置
 */
function findRegion(
  placing: IPlacing,
  rectangle: Rectangle,
  reg: IRegion,
): 0 | 1 {
  // 遍历所有列
  for (let col = placing.cols, i = 0; col != null; col = col.nextCol, i++) {
    const colR: IRange = {
      startIndex: 0,
      endIndex: 0,
      overshoot: 0,
    }
    const cellR: IRange = {
      startIndex: 0,
      endIndex: 0,
      overshoot: 0,
    }
    let sumWidth: number = 0
    let temp: ICol | null

    // 检查此列是否适合矩形的高度
    if (!tryFitHeightInCol(col, rectangle.height, cellR)) {
      // 不合适
      continue
    }
    // 循环输入列，并检查i的单元格在整个矩形宽度上是否为空
    colR.startIndex = i
    colR.endIndex = i
    for (temp = col; temp != null; temp = temp.nextCol) {
      const cell = stepOffset(temp.cell, cellR.startIndex)
      if (cell?.occupied) {
        // 不合适，无法放置
        break
      } else {
        if (sumWidth + temp.width > rectangle.width) {
          // 需要拆分单元格
          colR.overshoot = rectangle.width - sumWidth
          reg.colR = colR
          reg.cellR = cellR
          return SUCCESS
        } else if (sumWidth + temp.width === rectangle.width) {
          // 不需要拆分单元格
          colR.overshoot = 0
          reg.colR = colR
          reg.cellR = cellR
          return SUCCESS
        }
        sumWidth += temp.width
        colR.endIndex++
      }
    }
  }
  return FAIL
}

function split(placing: IPlacing, reg: IRegion): 0 | 1 {
  let colSplitMe: ICol | null = null

  // 水平拆分单元格
  for (let col = placing.cols, i = 0; col != null; col = col.nextCol, i++) {
    // 仅 overshoot > 0 时才拆分列
    if (reg.cellR.overshoot > 0) {
      const cell = stepOffset(col.cell, reg.cellR.endIndex)
      if (cell == null) continue
      const newCell: ICell = {
        // 设置新的单元格
        height: cell.height - reg.cellR.overshoot,
        occupied: cell.occupied,
        nextCell: cell.nextCell,
      }
      // 更新旧的单元格
      cell.height = reg.cellR.overshoot
      cell.nextCell = newCell
    }

    // 保存要拆分的列
    if (i === reg.colR.endIndex) {
      colSplitMe = col
    }
  }

  // 仅 overshoot > 0 时才拆分列
  if (reg.colR.overshoot > 0) {
    // 纵向拆分列
    if (colSplitMe == null) {
      console.log('Error. Failed to find column to split.\n')
      return FAIL
    }

    const newCol: ICol = {
      width: colSplitMe.width - reg.colR.overshoot,
      nextCol: null,
      cell: {
        height: 0,
        occupied: 0,
        nextCell: null,
      },
    }

    // 设置一个新列
    let tail: ICell = newCol.cell as ICell
    for (let cell = colSplitMe.cell; cell != null; cell = cell.nextCell) {
      tail.height = cell.height
      tail.occupied = cell.occupied
      if (cell.nextCell == null) {
        tail.nextCell = null
        break
      }
      tail.nextCell = {
        height: 0,
        occupied: 0,
        nextCell: null,
      }
      tail = tail.nextCell
    }
    newCol.nextCol = colSplitMe.nextCol

    // 更新旧的列
    colSplitMe.width = reg.colR.overshoot
    colSplitMe.nextCol = newCol
  }

  return SUCCESS
}

/**
 * 更新单元格，使其放置在正确的位置
 * @param placing 放置区域
 * @param rectangle 矩形
 * @param reg Region
 */
function update(placing: IPlacing, rectangle: Rectangle, reg: IRegion): 0 | 1 {
  if (!rectangle.__id || rectangle.__id === 0) {
    console.error(`Error. Rectangle can't have id = ${rectangle.__id}.\n`)
    return FAIL
  }

  let x: number = 0
  let y: number = 0
  let done: number = 0
  // 遍历每一列
  for (let col = placing.cols, i = 0; col != null; col = col.nextCol, i++) {
    if (i > reg.colR.endIndex) {
      break
    }
    if (i >= reg.colR.startIndex) {
      // 遍历单元格
      for (
        let cell = col.cell, k = 0;
        cell != null;
        cell = cell.nextCell, k++
      ) {
        if (k > reg.cellR.endIndex) {
          break
        }
        if (k >= reg.cellR.startIndex) {
          cell.occupied = rectangle.__id
          if (!done) {
            rectangle.x = x
            rectangle.y = y
            done = 1
          }
        }
        y += cell.height
      }
    }
    x += col.width
  }
  return SUCCESS
}

function addRec(p: IPlacing, r: Rectangle): 0 | 1 {
  const reg: IRegion = {
    colR: {
      startIndex: 0,
      endIndex: 0,
      overshoot: 0,
    },
    cellR: {
      startIndex: 0,
      endIndex: 0,
      overshoot: 0,
    },
  }

  if (findRegion(p, r, reg) === FAIL) {
    return FAIL
  }

  if (split(p, reg) === FAIL) {
    console.error('Error in splitting.\n')
    return FAIL
  }

  if (update(p, r, reg) === FAIL) {
    console.error('Error in updating.\n')
    return FAIL
  }

  return SUCCESS
}

/**
 * 尝试执行内容排列
 * @param list 矩形列表
 * @param enclosingWidth 容器宽度
 * @param enclosingHeight 容器高度
 */
function doPlacing(
  list: Rectangle[],
  enclosingWidth: number,
  enclosingHeight: number,
): 0 | 1 {
  let p: IPlacing | null = allocPlacing(enclosingWidth, enclosingHeight)
  const len: number = list.length

  for (let i = 0; i < len; i++) {
    if (!addRec(p, list[i])) {
      freePlacing(p)
      p = null
      return FAIL
    }
  }
  freePlacing(p)
  p = null
  return SUCCESS
}

/**
 * 计算所有矩形的宽高和
 * @param list 矩形列表
 */
function sumWH(list: Rectangle[]): RectangleSize {
  const len = list.length
  let width = 0
  let height = 0
  for (let i = 0; i < len; i++) {
    width += list[i].width
    height += list[i].height
  }
  return {
    width,
    height,
  }
}

/**
 * 查找所有矩形中，宽度最大值与高度最大值
 * @param list 矩形列表
 */
function maxWH(list: Rectangle[]): RectangleSize {
  const len = list.length
  let width = 0
  let height = 0

  for (let i = 0; i < len; i++) {
    if (list[i].width >= width) {
      width = list[i].width
    }
    if (list[i].height >= height) {
      height = list[i].height
    }
  }
  return {
    width,
    height,
  }
}

/**
 * 计算所有矩形总面积
 * @param list 矩形列表
 */
function totalArea(list: Rectangle[]): number {
  const len = list.length
  let area = 0
  for (let i = 0; i < len; i++) {
    area += list[i].height * list[i].width
  }
  return area
}

/**
 * 计算容器需要的最大宽度
 * @param list 矩形列表
 */
function placingWidth(list: Rectangle[]): number {
  const len = list.length
  let width = 0
  for (let i = 0; i < len; i++) {
    if (list[i].x === -1) {
      console.error(
        "Error. Can't compute placing_width if not all rectangles have been placed.\n",
      )
      return -1
    }
    if (list[i].width + (list[i].x as number) >= width) {
      width = list[i].width + (list[i].x as number)
    }
  }
  return width
}

/**
 * 放置最小区域算法
 * @param list 矩形列表
 * @param en 初始区域
 */
function areapackAlgorithm(list: Rectangle[], en: RectangleSize): 0 | 1 {
  const { width: maxWidth, height: maxHeight } = maxWH(list)
  const { width: sumWidth } = sumWH(list)
  let minWidth = -1
  let minHeight = -1
  let area = -1
  let status: number
  let state: TheState
  const totArea = totalArea(list)
  /* 初始化高度为最大高度 */
  en.height = maxHeight
  en.width = sumWidth

  area = en.height * en.width
  state = TheState.DO_PLACING

  /* 从封闭区域(w=sum, h=max)开始查找
   * do placing
   * - 如果成功，保存区域
   * - 如果失败，尝试新的封闭区域
   *
   * 减小宽度，否则增加高度直到成功
   *
   * 如果 en width=max: 停止
   *
   * */

  let loop = 1
  while (loop) {
    switch (state) {
      case TheState.DO_PLACING:
        /**
         * 尝试将矩形放置在封闭矩形中。
         * 如果成功，保存该区域，然后尝试减小包装宽度。
         * 如果失败，增加高度并重试。
         */
        status = doPlacing(list, en.width, en.height)
        if (status === 1) {
          en.width = placingWidth(list)

          area = en.height * en.width
          minWidth = en.width
          minHeight = en.height

          state = TheState.DEC_WIDTH
        } else {
          state = TheState.INC_HEIGHT
        }
        break
      case TheState.DEC_WIDTH:
        /**
         * 减小包装宽度，然后尝试再次放置。
         * 如果新宽度小于矩形的最大宽度，则停止算法并提出最佳解决方案
         */
        en.width--
        if (en.width < maxWidth) {
          state = TheState.STOP
        } else {
          state = TheState.DO_PLACING
        }
        break
      case TheState.INC_HEIGHT:
        /**
         * 增加封闭高度，然后尝试再次放置。
         * 但是，如果新的高度使封闭区域小于所有矩形的总面积，则增加封闭高度并重新开始。
         * 如果封闭区域比目前最好的封闭区域大，则减小封闭宽度并重新开始。
         */
        en.height++
        if (en.height * en.width < totArea) {
          state = TheState.INC_HEIGHT
        } else if (en.height * en.width >= area) {
          state = TheState.DEC_WIDTH
        } else {
          state = TheState.DO_PLACING
        }
        break
      case TheState.STOP:
        // 计算结束
        loop = 0
        break
    }
  }
  if (minWidth === -1 || minHeight === -1) {
    return FAIL
  }
  // 以最佳的宽度和高度进行最后放置
  status = doPlacing(list, minWidth, minHeight)

  return SUCCESS
}

/**
 * 打包给到的所有矩形
 * @param rectangleSizes 带有宽高的矩形列表
 */
export function rectanglePacker<T extends RectangleSize>(
  rectangleSizes: T[],
): Rectangle[] {
  if (!Array.isArray(rectangleSizes) || rectangleSizes.length === 0) return []

  const enclosing: Rectangle = { width: 0, height: 0 }

  const rectList = rectangleSizes.map(({ width, height }, i) => {
    if (!width || !height)
      throw new Error('Rectangle width and height must be an integer')
    return {
      width,
      height,
      x: -1,
      y: -1,
      __id: i + 1,
    }
  })

  const result = areapackAlgorithm(rectList, enclosing)

  if (result === FAIL) {
    console.error('Unexpected error in algorithm implementation')
    return []
  }

  // rectList.forEach((rectangle) => delete rectangle.__id);

  return rectList
}

export function rectanglePackerMutation<T extends Rectangle>(
  rectangleSizes: T[],
): (T & Rectangle)[] {
  const list = rectanglePacker(rectangleSizes)

  rectangleSizes.forEach((rs, i) => {
    rs.x = list[i].x
    rs.y = list[i].y
  })

  return rectangleSizes
}
